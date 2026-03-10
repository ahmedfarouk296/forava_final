using System;
using System.Threading.Tasks;

namespace ILS.WebApi.Features.AdminAuth.Interfaces
{
    public interface IAdminAuthService
    {
        Task<(bool success, string token, string message)> LoginAsync(string password);
        Task<(bool success, string message)> SetupAsync(string password);
        Task<(bool success, string message)> ChangePasswordAsync(string oldPassword, string newPassword);
        Task<bool> IsSetupDoneAsync();
    }
}
