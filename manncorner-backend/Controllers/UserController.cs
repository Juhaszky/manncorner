using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    public UserController(UserService userService)
    {
        _userService = userService;
    }
    [HttpPost]
    public async Task<IActionResult> CreateUser(string steamId, string tradeUrl)
    {
        try
        {
            await _userService.CreateUserAsync(steamId, tradeUrl);
            return Ok("User Created");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error creating user: {ex.Message}");
        }
    }
    [HttpGet]
    [Route("{steamId}")]
    public async Task<IActionResult> GetUser(string steamId)
    {
        var user = await _userService.GetUserBySteamIdAsync(steamId);  // Aszinkron hívás
        if (user == null)
        {
            return NotFound("User not found");
        }
        return Ok(user);
    }
    [HttpPut]
    [Route("{steamId}/tradeurl")]
    public async Task<IActionResult> SetTradeUrl(string steamId, string tradeUrl)
    {
        try
        {
            await _userService.SetTradeUrlAsync(steamId, tradeUrl); // ✅ await!
            return Ok("Trade URL updated successfully");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating trade URL: {ex.Message}");
        }
    }
}