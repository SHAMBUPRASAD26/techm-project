namespace FoodReviewAPI.DTOs
{
    public class RestaurantResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public double AverageRating { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateRestaurantDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class UpdateRestaurantDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }
} 