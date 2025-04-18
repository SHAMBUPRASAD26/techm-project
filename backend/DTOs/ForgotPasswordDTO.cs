using System.ComponentModel.DataAnnotations;

namespace FoodReviewAPI.DTOs
{
    public class ForgotPasswordDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
} 