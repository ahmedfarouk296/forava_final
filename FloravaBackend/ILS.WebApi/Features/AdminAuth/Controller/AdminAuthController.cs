using Microsoft.AspNetCore.Mvc;
using ILS.WebApi.Features.AdminAuth.Interfaces;

namespace ILS.WebApi.Features.AdminAuth.Controller
{
    // DTOs moved here from ILS.WebApi.Features.AdminAuth.Dtos
    public class LoginRequest { public string Password { get; set; } = string.Empty; }
    public class SetupRequest { public string Password { get; set; } = string.Empty; }
    public class ChangePasswordRequest 
    { 
        public string OldPassword { get; set; } = string.Empty; 
        public string NewPassword { get; set; } = string.Empty; 
    }
    public class AuthResponse 
    { 
        public bool Success { get; set; } 
        public string Message { get; set; } = string.Empty; 
        public string? Token { get; set; } 
    }

    [ApiController]
    [Route("api/[controller]")]
    public class AdminAuthController : ControllerBase
    {
        private readonly IAdminAuthService _authService;

        public AdminAuthController(IAdminAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            bool isSetup = await _authService.IsSetupDoneAsync();
            return Ok(new { isSetupDone = isSetup });
        }

        [HttpPost("setup")]
        public async Task<IActionResult> Setup([FromBody] SetupRequest request)
        {
            var result = await _authService.SetupAsync(request.Password);
            if (!result.success) return BadRequest(new { message = result.message });
            return Ok(new { message = result.message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request.Password);
            if (!result.success) return Unauthorized(new { message = result.message });
            return Ok(new AuthResponse { Success = true, Message = result.message, Token = result.token });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var result = await _authService.ChangePasswordAsync(request.OldPassword, request.NewPassword);
            if (!result.success) return BadRequest(new { message = result.message });
            return Ok(new { message = result.message });
        }
    }
}
