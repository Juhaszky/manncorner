using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly SteamApiService _steamService;
    public UserController(UserService userService, SteamApiService steamService)
    {
        _userService = userService;
        _steamService = steamService;
    }
    [HttpPost]
    public async Task<IActionResult> CreateUser(string steamId, string tradeUrl)
    {
        try
        {
            var externalData = await _steamService.GetPlayerSummary(steamId);
            await _userService.CreateUserAsync(steamId, tradeUrl, externalData.response.players[0].personaname, externalData.response.players[0].avatarmedium);
            return Ok("User Created");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating user: {ex.Message}");
        }
    }
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet]
    [Route("{steamId}")]
    public async Task<IActionResult> GetUser(string steamId)
    {
        var user = await _userService.GetUserBySteamIdAsync(steamId);
        if (user == null)
        {
            return NotFound("User not found");
        }
        return Ok(user);
    }
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPut]
    [Route("{steamId}/tradeurl")]
    public async Task<IActionResult> SetTradeUrl(string steamId, string tradeUrl)
    {
        var tokenSteamId = User.FindFirst("steamId")?.Value;
        if (string.IsNullOrEmpty(tokenSteamId))
        {
            return Unauthorized("Invalid token: steamId not found.");
        }
        if (tokenSteamId != steamId)
        {
            return Forbid("You are not allowed to modify another user's trade URL.");
        }
        try
        {
            await _userService.SetTradeUrlAsync(steamId, tradeUrl);
            return Ok(new { message = "Trade URL updated successfully", status = 200 });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message, status = 404 });
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating trade URL: {ex.Message}");
        }
    }
}