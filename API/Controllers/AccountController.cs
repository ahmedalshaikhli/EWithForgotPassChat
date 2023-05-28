using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers
{


    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
         private readonly IEmailSender _emailSender;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper, IEmailSender emailSender)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailSender = emailSender;
            
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindUserByClaimsPrincipleWithAddress (HttpContext.User);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            var user = await _userManager.FindUserByClaimsPrincipleWithAddress (HttpContext.User);

            return _mapper.Map<Address, AddressDto>(user.Address);
        }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindUserByClaimsPrincipleWithAddress (HttpContext.User);

            user.Address = _mapper.Map<AddressDto, Address>(address);

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return Ok(_mapper.Map<Address, AddressDto>(user.Address));

            return BadRequest("Problem updating the user");
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse{Errors = new []{"Email address is in use"}});
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(new ApiResponse(400));

            var roleAddResult = await _userManager.AddToRoleAsync(user, "Member");
            
            if (!roleAddResult.Succeeded) return BadRequest("Failed to add to role");

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };
        }
        
[HttpPost("forgotpassword")]
public async Task<ActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
{
    var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
    if (user == null) return NotFound(new ApiResponse(404, "User not found"));

    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
    var frontEndUrl = "https://localhost:4200/account"; // Replace this with your front-end URL
    var resetLink = $"{frontEndUrl}/reset-password?email={HttpUtility.UrlEncode(user.Email)}&token={HttpUtility.UrlEncode(token)}";

    // Send the reset link via email
    await _emailSender.SendEmailAsync(user.Email, "Reset Password", $"Please reset your password by clicking [here]({resetLink}) this process is vaild for 15 minutes only");

    return Ok("Password reset email has been sent");
}

[HttpPost("reset-password")]
public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model)
{
    // Get the user associated with the provided email address
    var user = await _userManager.FindByEmailAsync(model.Email);
    if (user == null)
    {
        // Return an error if the user is not found
        return BadRequest("User not found.");
    }

    // Validate the token
    var isTokenValid = await _userManager.VerifyUserTokenAsync(user, _userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", model.Token);
    if (!isTokenValid)
    {
        // Return an error if the token is invalid
        return BadRequest("Invalid or expired token.");
    }

    // Reset the user's password
    var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
    if (!result.Succeeded)
    {
        // Return an error if the password reset failed
        return BadRequest("Failed to reset password.");
    }

    // Return a JSON response with the success message
    return Ok(new { message = "Password successfully reset." });
}

//https://localhost:5001/api/account/all-users
[Authorize(Roles = "Admin")]
[HttpGet("all-users")]
public async Task<ActionResult<IEnumerable<AppUser>>> GetAllUsers(int pageIndex = 0, int pageSize = 10, string searchTerm = "")
{
    var query = _userManager.Users.Include(u => u.Address).AsQueryable();
    
    if (!string.IsNullOrEmpty(searchTerm))
    {
        query = query.Where(u => u.DisplayName.Contains(searchTerm) || u.Email.Contains(searchTerm));
    }

    var totalCount = await query.CountAsync();
    var users = await query.Skip(pageIndex * pageSize).Take(pageSize).ToListAsync();

    return Ok(new { users, totalCount });
}
// get user 
 //localhost:5001/api/account/edit/8ac15527-4350-4690-8e99-2e254d086970

[HttpGet("edit/{id}")]
    public async Task<AppUser> FindByIdAsyncf(string id)
{
    return await _userManager.Users.Include(u => u.Address).SingleOrDefaultAsync(u => u.Id == id);
}


 [HttpPut("edit/{id}")]
public async Task<IActionResult> UpdateUser(string id, [FromBody] AppUser appUser)
{
    // Retrieve the existing user data
    AppUser existingUser = await FindByIdAsyncf(id);

    // Check if the user exists
    if (existingUser == null)
    {
        return NotFound("User not found");
    }

    // Update the existing user data with the new data
    existingUser.DisplayName = appUser.DisplayName;
    existingUser.Email = appUser.Email;
    existingUser.Address.FirstName = appUser.Address.FirstName;
    existingUser.Address.LastName = appUser.Address.LastName;
    existingUser.Address.Street = appUser.Address.Street;
    existingUser.Address.City = appUser.Address.City;
    existingUser.Address.State = appUser.Address.State;
    existingUser.Address.Zipcode = appUser.Address.Zipcode;
    // Add any other fields you'd like to update

    // Save the changes using the UserManager
    IdentityResult result = await _userManager.UpdateAsync(existingUser);

    // Check if the update was successful
    if (result.Succeeded)
    {
        return Ok(existingUser);
    }

    // If the update was not successful, return an error response
    return BadRequest(result.Errors);
}


[HttpDelete("delete/{id}")]
public async Task<IActionResult> DeleteUserAsync(string id)
{
    var user = await _userManager.FindByIdAsync(id);
    if (user == null)
    {
        return NotFound();
    }

    var result = await _userManager.DeleteAsync(user);
    if (result.Succeeded)
    {
        return Ok();
    }
    else
    {
        return BadRequest(result.Errors);
    }
}

}



}

    
