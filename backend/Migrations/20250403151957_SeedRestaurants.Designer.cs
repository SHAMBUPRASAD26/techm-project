﻿// <auto-generated />
using System;
using FoodReviewAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FoodReviewAPI.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250403151957_SeedRestaurants")]
    partial class SeedRestaurants
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("FoodReviewAPI.Models.Restaurant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("varchar(200)");

                    b.Property<double>("AverageRating")
                        .HasColumnType("double");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("varchar(200)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.Property<string>("Website")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("varchar(200)");

                    b.HasKey("Id");

                    b.ToTable("Restaurants");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Address = "123 Main St",
                            AverageRating = 4.5,
                            CreatedAt = new DateTime(2025, 4, 3, 15, 19, 57, 73, DateTimeKind.Utc).AddTicks(5704),
                            Description = "Authentic Italian cuisine in a cozy atmosphere",
                            ImageUrl = "https://example.com/italian.jpg",
                            Name = "The Italian Place",
                            PhoneNumber = "555-0123",
                            Website = "www.italianplace.com"
                        },
                        new
                        {
                            Id = 2,
                            Address = "456 Oak Ave",
                            AverageRating = 4.7999999999999998,
                            CreatedAt = new DateTime(2025, 4, 3, 15, 19, 57, 73, DateTimeKind.Utc).AddTicks(5707),
                            Description = "Fresh and delicious Japanese sushi",
                            ImageUrl = "https://example.com/sushi.jpg",
                            Name = "Sushi Master",
                            PhoneNumber = "555-0124",
                            Website = "www.sushimaster.com"
                        },
                        new
                        {
                            Id = 3,
                            Address = "789 Pine St",
                            AverageRating = 4.2000000000000002,
                            CreatedAt = new DateTime(2025, 4, 3, 15, 19, 57, 73, DateTimeKind.Utc).AddTicks(5709),
                            Description = "Gourmet burgers and craft beers",
                            ImageUrl = "https://example.com/burger.jpg",
                            Name = "Burger Haven",
                            PhoneNumber = "555-0125",
                            Website = "www.burgerhaven.com"
                        });
                });

            modelBuilder.Entity("FoodReviewAPI.Models.Review", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("FoodImage")
                        .HasColumnType("longtext");

                    b.Property<int>("Rating")
                        .HasColumnType("int");

                    b.Property<int>("RestaurantId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("RestaurantId");

                    b.HasIndex("UserId");

                    b.ToTable("Reviews");
                });

            modelBuilder.Entity("FoodReviewAPI.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("ProfilePicture")
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("FoodReviewAPI.Models.Review", b =>
                {
                    b.HasOne("FoodReviewAPI.Models.Restaurant", "Restaurant")
                        .WithMany("Reviews")
                        .HasForeignKey("RestaurantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FoodReviewAPI.Models.User", "User")
                        .WithMany("Reviews")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Restaurant");

                    b.Navigation("User");
                });

            modelBuilder.Entity("FoodReviewAPI.Models.Restaurant", b =>
                {
                    b.Navigation("Reviews");
                });

            modelBuilder.Entity("FoodReviewAPI.Models.User", b =>
                {
                    b.Navigation("Reviews");
                });
#pragma warning restore 612, 618
        }
    }
}
