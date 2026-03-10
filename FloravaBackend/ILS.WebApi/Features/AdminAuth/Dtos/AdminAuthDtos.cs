namespace ILS.WebApi.Features.AdminAuth.Dtos
{
    public class LoginRequest { public string Password { get; set; } = string.Empty; }
    public class SetupRequest { public string Password { get; set; } = string.Empty; }
    public class AuthResponse 
    { 
        public bool Success { get; set; } 
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }
}
