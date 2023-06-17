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
using System.Net.Http.Headers;
namespace API.Controllers
{


    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
         private readonly IEmailSender _emailSender;

         private readonly IConfiguration _config;
         
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper, IEmailSender emailSender, IConfiguration config)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailSender = emailSender;
            _config = config;
            
        }


        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindUserByClaimsPrincipleWithAddress (HttpContext.User);
              if (user == null)
    {
        return NotFound("User not found");
    }

            return new UserDto
            {
               id = user.Id,
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName

            };
        }

     [HttpGet("getcurrentusersetting")]
        public async Task<ActionResult<UserDto>> GetCurrentUserForSetting()
 {
    var user = await _userManager.FindUserByClaimsPrincipleWithAddress(HttpContext.User);

    if (user == null)
    {
        return NotFound("User not found");
    }

    var userDto = new UserDto
    {
        id = user.Id,
        Email = user.Email,
        Token = await _tokenService.CreateToken(user),
        DisplayName = user.DisplayName,
        UserProfilePhoto = user.UserProfilePhoto
    };

    if (user.Address != null)
    {
 
        userDto.Address = new AddressDto
        {
            FirstName = user.Address.FirstName,
            LastName = user.Address.LastName,
            Street = user.Address.Street,
            City = user.Address.City,
            State = user.Address.State,
            Zipcode = user.Address.Zipcode,
            AppUserId = user.Address.AppUserId
        };
    }

    return userDto;
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
                UserName = registerDto.Email,
                UserProfilePhoto =  "Content/images/Users/user-default-photo.png" // Default user photo
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
    var frontEndUrl = "https://localhost:5001/account"; // Replace this with your front-end URL
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


//get all users
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


//Edit user in admin panel

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

//Delete user in Admin Panel
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



/* [HttpPost("upload"), DisableRequestSizeLimit]
public IActionResult Upload([FromForm] IFormFile file)
{
    try
    {
       var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "Users");

        if (file.Length > 0)
        {
            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var fullPath = Path.Combine(pathToSave, fileName);
            var dbPath = Path.Combine("Content", "images", "Users", fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return Ok(new { dbPath });
        }
        else
        {
            return BadRequest();
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex}");
    }
} */
[Authorize]
[HttpPut("update-user")]
public async Task<ActionResult<UserDto>> UpdateUserInformation([FromForm] UserUpdateDto userUpdate)
{
    var user = await _userManager.FindUserByClaimsPrincipleWithAddress(HttpContext.User);
    if (user == null) return NotFound("User not found");

    // Check if the edited email already exists
    if (user.Email != userUpdate.Email)
    {
        var emailExists = await _userManager.FindByEmailAsync(userUpdate.Email) != null;
        if (emailExists) return BadRequest("Email already exists");
    }

    // Handle the uploaded file
    if (userUpdate.UserProfilePhoto != null && userUpdate.UserProfilePhoto.Length > 0)
    {
         var allowedFormats = new[] { ".png",".jpg",".jpeg" };
        var fileFormat = Path.GetExtension(userUpdate.UserProfilePhoto.FileName).ToLowerInvariant();
        if (!allowedFormats.Contains(fileFormat))
        {
            return BadRequest("Invalid file format. Only PNG files are allowed.");
        }
        // Generate a unique filename
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(userUpdate.UserProfilePhoto.FileName)}";
        
        // Define the directory
        var uploads = Path.Combine("Content/images/Users");

        // Combine the directory with the filename
        var filePath = Path.Combine(uploads, fileName);

        // Ensure the file directory exists
        if (!Directory.Exists(uploads))
        {
            Directory.CreateDirectory(uploads);
        }

        // Save the file
        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await userUpdate.UserProfilePhoto.CopyToAsync(fileStream);
        }

        // Update the user with the path where the image was saved
        user.UserProfilePhoto = Path.Combine("Content/images/Users", fileName);
    }

    // Update user information
    user.Email = userUpdate.Email;
    user.DisplayName = userUpdate.DisplayName;
    user.Address = _mapper.Map<AddressDto, Address>(userUpdate.Address);

    var result = await _userManager.UpdateAsync(user);

    if (result.Succeeded) return Ok(_mapper.Map<AppUser, UserDto>(user));

    return BadRequest("Problem updating the user");
}

//Allow user to dlete his account 
[Authorize]
[HttpDelete("delete-account")]
public async Task<IActionResult> DeleteAccount([FromQuery] string email)
{
    var user = await _userManager.FindByEmailAsync(email);

    if (user == null)
    {
        return NotFound("User not found");
    }

    var result = await _userManager.DeleteAsync(user);

    if (result.Succeeded)
    {
        return NoContent(); // Return 204 No Content status code
    }
    else
    {
        return BadRequest(result.Errors);
    }
}
}
}

    
