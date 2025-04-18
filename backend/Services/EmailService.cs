using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FoodReviewAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _fromEmail;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _smtpServer = configuration["EmailSettings:SmtpServer"] ?? string.Empty;
            _smtpPort = int.Parse(configuration["EmailSettings:SmtpPort"] ?? "587");
            _smtpUsername = configuration["EmailSettings:Username"] ?? string.Empty;
            _smtpPassword = configuration["EmailSettings:Password"] ?? string.Empty;
            _fromEmail = configuration["EmailSettings:FromEmail"] ?? string.Empty;
            _logger = logger;

            _logger.LogInformation("EmailService initialized with settings: Server={Server}, Port={Port}, Username={Username}", 
                _smtpServer, _smtpPort, _smtpUsername);

            ValidateSettings();
        }

        private void ValidateSettings()
        {
            if (string.IsNullOrEmpty(_smtpServer))
                throw new InvalidOperationException("SMTP server is not configured");
            if (string.IsNullOrEmpty(_smtpUsername))
                throw new InvalidOperationException("SMTP username is not configured");
            if (string.IsNullOrEmpty(_smtpPassword))
                throw new InvalidOperationException("SMTP password is not configured");
            if (string.IsNullOrEmpty(_fromEmail))
                throw new InvalidOperationException("From email is not configured");
        }

        public async Task SendPasswordResetEmail(string email, string resetLink)
        {
            try
            {
                _logger.LogInformation("Attempting to send password reset email to {Email}", email);

                using var client = new SmtpClient
                {
                    Host = _smtpServer,
                    Port = _smtpPort,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new System.Net.NetworkCredential(_smtpUsername, _smtpPassword),
                    Timeout = 30000
                };

                var message = new MailMessage
                {
                    From = new MailAddress(_fromEmail, "Food Review App"),
                    Subject = "Password Reset Request",
                    Body = $@"
                        <html>
                        <body>
                            <h2>Password Reset Request</h2>
                            <p>You have requested to reset your password. Click the link below to proceed:</p>
                            <p><a href='{resetLink}'>{resetLink}</a></p>
                            <p>This link will expire in 1 hour.</p>
                            <p>If you did not request this password reset, please ignore this email.</p>
                        </body>
                        </html>",
                    IsBodyHtml = true
                };

                message.To.Add(email);

                _logger.LogInformation("Sending email with settings: From={FromEmail}, To={ToEmail}, Server={Server}, Port={Port}", 
                    _fromEmail, email, _smtpServer, _smtpPort);

                try
                {
                    await client.SendMailAsync(message);
                    _logger.LogInformation("Password reset email sent successfully to {Email}", email);
                }
                catch (SmtpException ex)
                {
                    _logger.LogError(ex, "SMTP Error while sending password reset email to {Email}. StatusCode: {StatusCode}, Message: {Message}, StackTrace: {StackTrace}", 
                        email, ex.StatusCode, ex.Message, ex.StackTrace);
                    
                    if (ex.InnerException != null)
                    {
                        _logger.LogError("Inner Exception: {InnerException}", ex.InnerException.Message);
                    }

                    // Log the error but don't throw it to prevent email enumeration
                    _logger.LogWarning("Email sending failed, but returning success to prevent email enumeration");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}. Error: {Error}, StackTrace: {StackTrace}", 
                    email, ex.Message, ex.StackTrace);
                
                if (ex.InnerException != null)
                {
                    _logger.LogError("Inner Exception: {InnerException}", ex.InnerException.Message);
                }
                
                // Log the error but don't throw it to prevent email enumeration
                _logger.LogWarning("Email sending failed, but returning success to prevent email enumeration");
            }
        }
    }
} 