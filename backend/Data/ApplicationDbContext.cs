using Microsoft.EntityFrameworkCore;
using FoodReviewAPI.Models;

namespace FoodReviewAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.FirstName).HasMaxLength(50);
                entity.Property(e => e.LastName).HasMaxLength(50);
                entity.Property(e => e.Role).HasMaxLength(10);
                entity.Property(e => e.Avatar).HasMaxLength(255);
                entity.Property(e => e.ReviewCount).HasDefaultValue(0);
                entity.Property(e => e.AverageRating).HasDefaultValue(0);
                entity.Property(e => e.ResetToken).HasMaxLength(255);
            });

            // Configure Restaurant entity
            modelBuilder.Entity<Restaurant>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Address).HasMaxLength(200);
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);
                entity.Property(e => e.Website).HasMaxLength(100);
                entity.Property(e => e.ImageUrl).HasMaxLength(255);
            });

            // Configure Dish entity
            modelBuilder.Entity<Dish>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.ImageUrl).HasMaxLength(255);
                entity.Property(e => e.Price).HasPrecision(10, 2);
            });

            // Configure Review entity
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.FoodImage).HasMaxLength(255);
            });

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Restaurant)
                .WithMany(r => r.Reviews)
                .HasForeignKey(r => r.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed data for restaurants
            modelBuilder.Entity<Restaurant>().HasData(
                new Restaurant
                {
                    Id = 1,
                    Name = "The Italian Place",
                    Description = "Authentic Italian cuisine in a cozy atmosphere",
                    Address = "123 Main St",
                    PhoneNumber = "555-0123",
                    Website = "www.italianplace.com",
                    ImageUrl = "/assets/images/restaurant1.jpg",
                    AverageRating = 4.5,
                    CreatedAt = DateTime.UtcNow
                },
                new Restaurant
                {
                    Id = 2,
                    Name = "Sushi Master",
                    Description = "Fresh and delicious Japanese sushi",
                    Address = "456 Oak Ave",
                    PhoneNumber = "555-0124",
                    Website = "www.sushimaster.com",
                    ImageUrl = "/assets/images/restaurant2.jpg",
                    AverageRating = 4.8,
                    CreatedAt = DateTime.UtcNow
                },
                new Restaurant
                {
                    Id = 3,
                    Name = "Burger Haven",
                    Description = "Gourmet burgers and craft beers",
                    Address = "789 Pine St",
                    PhoneNumber = "555-0125",
                    Website = "www.burgerhaven.com",
                    ImageUrl = "/assets/images/restaurant3.jpg",
                    AverageRating = 4.2,
                    CreatedAt = DateTime.UtcNow
                },
                new Restaurant
                {
                    Id = 4,
                    Name = "Taco Fiesta",
                    Description = "Authentic Mexican street food and margaritas",
                    Address = "321 Spice St",
                    PhoneNumber = "555-0126",
                    Website = "www.tacofiesta.com",
                    ImageUrl = "/assets/images/restaurant4.jpg",
                    AverageRating = 4.6,
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
} 