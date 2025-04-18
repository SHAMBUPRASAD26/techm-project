using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodReviewAPI.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [NotMapped]
        public string? ConfirmPassword { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(10)]
        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        [StringLength(255)]
        public string Avatar { get; set; } = string.Empty;

        public int ReviewCount { get; set; } = 0;
        public decimal AverageRating { get; set; } = 0;

        // Password reset fields
        [StringLength(255)]
        public string ResetToken { get; set; } = string.Empty;
        public DateTime? ResetTokenExpires { get; set; }

        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
} 