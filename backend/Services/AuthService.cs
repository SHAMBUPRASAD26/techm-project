using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using FoodReviewAPI.Data;
using FoodReviewAPI.Models;
using FoodReviewAPI.DTOs;
using Microsoft.Extensions.Logging;

namespace FoodReviewAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ApplicationDbContext context,
            JwtService jwtService,
            IEmailService emailService,
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _context = context;
            _jwtService = jwtService;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDto)
        {
            _logger.LogInformation("RegisterAsync started for user: {Username}", registerDto.Username);

            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                _logger.LogWarning("Passwords do not match for user: {Username}", registerDto.Username);
                throw new Exception("Passwords do not match");
            }

            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                _logger.LogWarning("Email already exists: {Email}", registerDto.Email);
                throw new Exception("Email already exists");
            }

            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                _logger.LogWarning("Username already exists: {Username}", registerDto.Username);
                throw new Exception("Username already exists");
            }

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = HashPassword(registerDto.Password),
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);

            _logger.LogInformation("Saving new user to database: {Username}", registerDto.Username);
            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("User saved successfully: {Username}", registerDto.Username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving user to database: {Username}", registerDto.Username);
                throw;
            }

            var token = _jwtService.GenerateToken(user);

            _logger.LogInformation("Token generated for user: {Username}", registerDto.Username);

            return new AuthResponseDTO
            {
                Token = token,
                Username = user.Username,
                Email = user.Email
            };
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                throw new Exception("Invalid username or password");
            }

            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDTO
            {
                Token = token,
                Username = user.Username,
                Email = user.Email
            };
        }

        public async Task ForgotPasswordAsync(string email)
        {
            _logger.LogInformation("Processing forgot password request for email: {Email}", email);

            if (string.IsNullOrWhiteSpace(email))
            {
                throw new Exception("Email is required");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                _logger.LogWarning("Forgot password request for non-existent email: {Email}", email);
                // Return success even if user doesn't exist to prevent email enumeration
                return;
            }

            // Generate reset token
            user.ResetToken = GenerateResetToken();
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);
            await _context.SaveChangesAsync();

            // Send reset email with error handling
            var resetLink = $"{_configuration["FrontendUrl"]}/auth/reset-password?token={user.ResetToken}";
            try
            {
                await _emailService.SendPasswordResetEmail(user.Email, resetLink);
                _logger.LogInformation("Password reset email sent successfully to {Email}", user.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", user.Email);
                // Clear the reset token since email failed to send
                user.ResetToken = string.Empty;
                user.ResetTokenExpires = null;
                await _context.SaveChangesAsync();
                throw new Exception("Failed to send password reset email. Please try again later.");
            }
        }

        public async Task ResetPasswordAsync(ResetPasswordDTO resetPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => 
                u.ResetToken == resetPasswordDto.Token && 
                u.ResetTokenExpires > DateTime.UtcNow);

            if (user == null)
            {
                throw new Exception("Invalid or expired reset token");
            }

            if (resetPasswordDto.NewPassword != resetPasswordDto.ConfirmPassword)
            {
                throw new Exception("Passwords do not match");
            }

            user.PasswordHash = HashPassword(resetPasswordDto.NewPassword);
            user.ResetToken = string.Empty;
            user.ResetTokenExpires = null;
            await _context.SaveChangesAsync();
        }

        private string GenerateResetToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}
