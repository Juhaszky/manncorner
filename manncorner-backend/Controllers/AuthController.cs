using System.Security.Claims;
using System.Text;
using AspNet.Security.OpenId.Steam;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("[controller]")]
public class AuthController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly AuthService _authService;
    private readonly UserService _userService;
    public AuthController(IConfiguration configuration, AuthService authService, UserService userService)
    {
        _configuration = configuration;
        _authService = authService;
        _userService = userService;
    }
    [HttpGet("login")]
    public IActionResult Login()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action("SteamResponse")
        };
        return Challenge(properties, SteamAuthenticationDefaults.AuthenticationScheme);
    }
    [HttpGet("steam/response")]
    public async Task<IActionResult> SteamResponse()
    {
        var result = await HttpContext.AuthenticateAsync("Cookies");
        if (!result.Succeeded)
        {
            return BadRequest("Authentication failed.");
        }
        var claims = result.Principal.Claims;


        var url = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value
               ?? claims.FirstOrDefault(c => c.Type == "sub")?.Value
               ?? claims.FirstOrDefault(c => c.Type.Contains("nameidentifier"))?.Value;
        var steamId = new Uri(url).Segments.Last();
        if (string.IsNullOrEmpty(steamId))
        {
            return BadRequest("SteamID not found in claims.");
        }
        var existingUser = await _userService.GetUserBySteamIdAsync(steamId);
        if (existingUser == null)
        {
            await _userService.CreateUserAsync(steamId, "");
        }
        var token = _authService.GenerateJwtToken(steamId);

        var frontendUrl = $"http://localhost:4200/login-successful?token={token}";
        return Redirect(frontendUrl);
    }
    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("Cookies");
        return Redirect("/");
    }
}