using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ILS.Infrastructure.Data;
using ILS.Domain.Entities;
using ILS.Shared.Utilities;
using ILS.WebApi.Features.AdminAuth.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ILS.WebApi.Features.AdminAuth.Services
{
    public class AdminAuthService : IAdminAuthService
    {
        private readonly FloravaDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminAuthService(FloravaDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<bool> IsSetupDoneAsync()
        {
            return await _context.AdminAccounts.CountAsync() > 0;
        }

        public async Task<(bool success, string message)> SetupAsync(string password)
        {
            if (await IsSetupDoneAsync())
                return (false, "Admin setup already completed.");

            var (hash, salt) = PasswordHasher.HashPassword(password);
            
            var admin = new AdminAccount
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                PasswordHash = hash,
                Salt = salt
            };

            await _context.AdminAccounts.AddAsync(admin);
            await _context.SaveChangesAsync();

            return (true, "Admin account setup successfully.");
        }

        public async Task<(bool success, string token, string message)> LoginAsync(string password)
        {
            var admin = await _context.AdminAccounts.FirstOrDefaultAsync(u => u.Username == "admin");
            
            if (admin == null)
                return (false, string.Empty, "Admin account not found.");

            if (!PasswordHasher.VerifyPassword(password, admin.PasswordHash, admin.Salt))
                return (false, string.Empty, "Invalid password.");

            admin.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            string token = GenerateJwtToken(admin);
            return (true, token, "Login successful.");
        }

        public async Task<(bool success, string message)> ChangePasswordAsync(string oldPassword, string newPassword)
        {
            var admin = await _context.AdminAccounts.FirstOrDefaultAsync(u => u.Username == "admin");
            if (admin == null) return (false, "Admin account not found.");

            if (!PasswordHasher.VerifyPassword(oldPassword, admin.PasswordHash, admin.Salt))
                return (false, "Current password incorrect.");

            var (hash, salt) = PasswordHasher.HashPassword(newPassword);
            admin.PasswordHash = hash;
            admin.Salt = salt;

            await _context.SaveChangesAsync();
            return (true, "Password changed successfully.");
        }

        private string GenerateJwtToken(AdminAccount admin)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, admin.Username),
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "super_secret_key_florava_2026_long_enough"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(4),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
