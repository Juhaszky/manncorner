using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TradeController : ControllerBase
{
    private readonly ITradeService _tradeService;
    public TradeController(ITradeService tradeService)
    {
        _tradeService = tradeService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Trade>> GetTrade(int id)
    {
        var trade = await _tradeService.GetTradeByIdAsync(id);
        if (trade == null)
            return NotFound();

        return Ok(trade);
    }
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<Trade>> GetTradesByUserId(string userId)
    {
        var trade = await _tradeService.GetAllTradesByUserAsync(userId);
        if (trade == null)
            return NotFound();

        return Ok(trade);
    }
    [HttpGet]
    public async Task<ActionResult<Trade>> GetTrades(int page = 1, int pageSize = 10)
    {
        if (page < 1 || pageSize < 1 || pageSize > 10000)
            return BadRequest("Invalid pagination parameters.");
        var trades = await _tradeService.GetAllTradesAsync(page, pageSize);
        if (trades == null)
            return NotFound();

        return Ok(trades);
    }
    [HttpPost]
    public async Task<ActionResult<Trade>> CreateTrade([FromBody] Trade trade)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var createTrade = await _tradeService.CreateTradeAsync(trade);
        return CreatedAtAction(nameof(GetTrade), new { id = createTrade.Id }, createTrade);
    }
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost("bump")]
    public async Task<ActionResult> BumpTrade([FromBody] BumpTrade tradeData)
    {

        string userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();
        var bumpResult = await _tradeService.BumpTrade(tradeData.userId, tradeData.tradeId);
        if (bumpResult == null) return NotFound();
        return Ok(bumpResult);
    }
    [HttpPost("changeStatus")]
    public async Task<ActionResult> ChangeTradeStatus([FromBody] TradeIdRequest request)
    {
        var result = await _tradeService.ChangeTradeStatusAsync(request.TradeId);
        if (result.Status == 404)
        {
            return NotFound(result);
        }

        return Ok(result);
    }
    [HttpDelete("delete")]
    public async Task<ActionResult> DeleteTradeStatus([FromBody] TradeIdRequest request)
    {
        var result = await _tradeService.DeleteTrade(request.TradeId);
        if (result.Status == 404)
        {
            return NotFound(result);
        }

        return Ok(result);
    }
}