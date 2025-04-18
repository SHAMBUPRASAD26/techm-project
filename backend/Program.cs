using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FoodReviewAPI.Data;
using FoodReviewAPI.Services;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Configure the server URL and port
builder.WebHost.UseUrls("http://localhost:5128");

// Add services to the container.
builder.Services.AddControllers();

// Configure MySQL
try
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    Console.WriteLine($"\n=== Database Configuration ===");
    Console.WriteLine($"Connection String: {connectionString}");
    
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    });
    
    Console.WriteLine("MySQL configuration completed successfully");
}
catch (Exception ex)
{
    Console.WriteLine($"\n=== Database Configuration Error ===");
    Console.WriteLine($"Error configuring MySQL: {ex.Message}");
    Console.WriteLine($"Stack Trace: {ex.StackTrace}");
}

// Configure JWT Authentication
var jwtSecretKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Secret Key is not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
        };
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("Content-Disposition", "Authorization")
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    });
});

// Register services
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS - Must be before UseRouting
app.UseCors("AllowFrontend");

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Print startup information
Console.WriteLine("\n=== Application Information ===");
Console.WriteLine($"Application Name: FoodReviewAPI");
Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"Application URL: http://localhost:5128");
Console.WriteLine($"Swagger URL: http://localhost:5128/swagger");

// Test database connection
try
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.OpenConnection();
        Console.WriteLine("✓ Database connection successful!");
        db.Database.CloseConnection();
    }
}
catch (Exception ex)
{
    Console.WriteLine($"\n=== Database Connection Error ===");
    Console.WriteLine($"Error connecting to database: {ex.Message}");
}

app.Run();
