using System.Security.Claims;
using System.Text;
using AspNet.Security.OpenId.Steam;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;


[ApiController]
[Route("[controller]")]
public class AuthController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly AuthService _authService;
    private readonly UserService _userService;
    private readonly SteamApiService _steamService;
    public AuthController(IConfiguration configuration, AuthService authService, UserService userService, SteamApiService steamService)
    {
        _configuration = configuration;
        _authService = authService;
        _userService = userService;
        _steamService = steamService;
    }
    [AllowAnonymous]
    [HttpGet("login")]
    public IActionResult Login()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action("SteamResponse")
        };
        return Challenge(properties, SteamAuthenticationDefaults.AuthenticationScheme);
    }
    [AllowAnonymous]
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
            var externalData = await _steamService.GetPlayerSummary(steamId);

            await _userService.CreateUserAsync(steamId, "", externalData.response.players[0].personaname, externalData.response.players[0].avatarmedium);
        }
        var token = _authService.GenerateJwtToken(steamId);
        Response.Cookies.Append("accessToken", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(15)
        });

        var frontendUrl = $"http://localhost:4200/home";
        return Redirect(frontendUrl);
    }
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("status")]
    public IActionResult Status()
    {
        var user = HttpContext.User;
        if (user?.Identity?.IsAuthenticated == true)
        {
            return Ok(new { isAuthenticated = true, userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value });
        }
        return Ok(new { isAuthenticated = false });
    }
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized();

        var (isValid, userId) = await _authService.ValidateRefreshTokenAsync(refreshToken);
        if (!isValid)
            return Unauthorized();

        var newAccessToken = _authService.GenerateJwtToken(userId);
        var newRefreshToken = _authService.GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(30);

        await _authService.StoreRefreshTokenAsync(userId, newRefreshToken, refreshTokenExpiry);
        await _authService.RevokeRefreshTokenAsync(refreshToken);

        Response.Cookies.Append("accessToken", newAccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(15)
        });

        Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = refreshTokenExpiry
        });

        return Ok();
    }
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        Response.Cookies.Append("accessToken", "", new CookieOptions
        {
             HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(-1)
        });

        await HttpContext.SignOutAsync("Cookies");

        return Ok(new { message = "Logged out" });
    }
}