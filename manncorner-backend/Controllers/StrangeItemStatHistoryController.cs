using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class StrangeItemStatHistoryController : ControllerBase
{
    private readonly StrangeItemStatHistoryService _strangeItemStatHistoryService;
    private readonly InventoryFacadeService _inventoryFacadeService;
    public StrangeItemStatHistoryController(StrangeItemStatHistoryService strangeItemStatHistoryService, InventoryFacadeService inventoryFacadeService)
    {
        _strangeItemStatHistoryService = strangeItemStatHistoryService;
        _inventoryFacadeService = inventoryFacadeService;
    }

    [HttpGet]
    public async Task<ActionResult<StrangeItemStatHistory>> GetStatsByItemId(string itemId)
    {
        var stats = await _strangeItemStatHistoryService.GetStatsByItemIdAsync(itemId);
        foreach (var stat in stats)
        {
            Console.WriteLine($"{stat.ItemId} - {stat.UserId}:");
            foreach (var c in stat.Counters)
            {
                Console.WriteLine($" - {c.ChangeDate}: {c.Value}");
            }
        }
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
        var stats = await _inventoryFacadeService.GetStatsByUserIdAsync(userId);
        return Ok(stats);
    }
}