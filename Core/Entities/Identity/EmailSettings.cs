

namespace Core.Entities.Identity
{
    public class EmailSettings 
    {
    public string SenderName { get; set; } // Add this line
    public string Sender { get; set; }
    public string MailServer { get; set; }
    public int MailPort { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
    }
}