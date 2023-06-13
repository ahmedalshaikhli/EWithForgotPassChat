using API.Dtos;

public class UserUpdateDto
{
    public string Email { get; set; }
    public string DisplayName { get; set; }
    public AddressDto Address { get; set; }
     public IFormFile UserProfilePhoto { get; set; }
}