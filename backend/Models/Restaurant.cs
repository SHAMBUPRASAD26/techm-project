using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodReviewAPI.Models
{
    public class Restaurant
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [StringLength(100)]
        public string Website { get; set; } = string.Empty;

        [StringLength(255)]
        public string ImageUrl { get; set; } = string.Empty;

        public double AverageRating { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Dish> Dishes { get; set; } = new List<Dish>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
} 