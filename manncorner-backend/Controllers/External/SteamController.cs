using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/steam")]
public class SteamController : ControllerBase
{
    private readonly SteamApiService _steamApiService;
    public SteamController(SteamApiService steamApiService)
    {
        _steamApiService = steamApiService;
    }
    [HttpGet("profile/{steamId}")]
    public async Task<IActionResult> GetProfile(string steamId) {
        var result = await _steamApiService.GetPlayerSummary(steamId);
        return Content(result, "application/json");
    }
}