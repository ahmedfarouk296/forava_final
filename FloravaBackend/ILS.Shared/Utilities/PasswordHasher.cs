using System;
using System.Security.Cryptography;
using System.Text;

namespace ILS.Shared.Utilities
{
    public static class PasswordHasher
    {
        public static (string hash, string salt) HashPassword(string password)
        {
            byte[] saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            string salt = Convert.ToBase64String(saltBytes);

            using (var sha256 = SHA256.Create())
            {
                byte[] combinedBytes = Encoding.UTF8.GetBytes(password + salt);
                byte[] hashBytes = sha256.ComputeHash(combinedBytes);
                return (Convert.ToBase64String(hashBytes), salt);
            }
        }

        public static bool VerifyPassword(string password, string hash, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] combinedBytes = Encoding.UTF8.GetBytes(password + salt);
                byte[] hashBytes = sha256.ComputeHash(combinedBytes);
                return Convert.ToBase64String(hashBytes) == hash;
            }
        }
    }
}
