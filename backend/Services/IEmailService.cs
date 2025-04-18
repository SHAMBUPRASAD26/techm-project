using System.Threading.Tasks;

namespace FoodReviewAPI.Services
{
    public interface IEmailService
    {
        Task SendPasswordResetEmail(string email, string resetLink);
    }
} 