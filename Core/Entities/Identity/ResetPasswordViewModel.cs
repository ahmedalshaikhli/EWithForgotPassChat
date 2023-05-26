namespace Core.Entities.Identity
{
public class ResetPasswordViewModel
{
    public string Email { get; set; }
    public string Token { get; set; }
    public string NewPassword { get; set; }
}
}