using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodReviewAPI.Models
{
    public class Dish
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [StringLength(255)]
        public string ImageUrl { get; set; } = string.Empty;

        public int RestaurantId { get; set; }

        [ForeignKey("RestaurantId")]
        public virtual Restaurant Restaurant { get; set; } = null!;

        public List<Review> Reviews { get; set; } = new();

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 