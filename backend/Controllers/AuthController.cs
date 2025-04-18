using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodReviewAPI.Data;
using FoodReviewAPI.Models;
using FoodReviewAPI.DTOs;
using FoodReviewAPI.Services;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;

namespace FoodReviewAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            ApplicationDbContext context, 
            JwtService jwtService,
            IConfiguration configuration,
            IEmailService emailService,
            IAuthService authService,
            ILogger<AuthController> logger)
        {
            _context = context;
            _jwtService = jwtService;
            _configuration = configuration;
            _emailService = emailService;
            _authService = authService;
            _logger = logger;
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterDTO registerDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO forgotPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                _logger.LogWarning("Invalid forgot password request: {Errors}", string.Join(", ", errors));
                return Ok(new { message = "If an account exists with this email, a password reset link has been sent." });
            }

            try
            {
                _logger.LogInformation("Processing forgot password request for email: {Email}", forgotPasswordDto.Email);
                
                // Check if user exists first
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);
                if (user == null)
                {
                    _logger.LogInformation("User not found for email: {Email}", forgotPasswordDto.Email);
                    return Ok(new { message = "If an account exists with this email, a password reset link has been sent." });
                }

                await _authService.ForgotPasswordAsync(forgotPasswordDto.Email);
                _logger.LogInformation("Successfully processed forgot password request for email: {Email}", forgotPasswordDto.Email);
                return Ok(new { message = "If an account exists with this email, a password reset link has been sent." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during forgot password process for email: {Email}. Error: {Error}, StackTrace: {StackTrace}", 
                    forgotPasswordDto.Email, ex.Message, ex.StackTrace);
                
                if (ex.InnerException != null)
                {
                    _logger.LogError("Inner Exception: {InnerException}", ex.InnerException.Message);
                }
                
                // Always return success to prevent email enumeration
                return Ok(new { message = "If an account exists with this email, a password reset link has been sent." });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                _logger.LogWarning("Invalid reset password request: {Errors}", string.Join(", ", errors));
                return BadRequest(new { message = "Invalid request data" });
            }

            try
            {
                _logger.LogInformation("Processing reset password request for token: {Token}", resetPasswordDto.Token);
                await _authService.ResetPasswordAsync(resetPasswordDto);
                _logger.LogInformation("Password reset successful for token: {Token}", resetPasswordDto.Token);
                return Ok(new { message = "Password reset successful" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset for token: {Token}. Error: {Error}, StackTrace: {StackTrace}", 
                    resetPasswordDto.Token, ex.Message, ex.StackTrace);
                
                if (ex.InnerException != null)
                {
                    _logger.LogError("Inner Exception: {InnerException}", ex.InnerException.Message);
                }
                
                return BadRequest(new { message = ex.Message });
            }
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