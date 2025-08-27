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
}