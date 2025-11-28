using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class StrangeItemStatHistoryController : ControllerBase
{
    private readonly StrangeItemStatHistoryService _strangeItemStatHistoryService;
    public StrangeItemStatHistoryController(StrangeItemStatHistoryService strangeItemStatHistoryService)
    {
        _strangeItemStatHistoryService = strangeItemStatHistoryService;
    }
    
    [HttpGet]
    public async Task<ActionResult<StrangeItemStatHistory>> GetStatsByItemId(string itemId)
    {
        var stats = await _strangeItemStatHistoryService.GetStatsByItemIdAsync(itemId);
        if (stats == null)
            return NotFound();

        return Ok(stats);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("histories")]

    public async Task<ActionResult<StrangeItemStatHistory>> GetStatsByUserId()
    {
        string userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();
        var stats = await _strangeItemStatHistoryService.GetStatsByUserIdAsync(userId);
        return Ok(stats);
    }
}