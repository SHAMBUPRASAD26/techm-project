using FoodReviewAPI.DTOs;

namespace FoodReviewAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDto);
        Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto);
        Task ForgotPasswordAsync(string email);
        Task ResetPasswordAsync(ResetPasswordDTO resetPasswordDto);
    }
} 