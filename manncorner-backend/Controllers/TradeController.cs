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
    [HttpGet]
    public async Task<ActionResult<Trade>> GetTrades()
    {
        var trades = await _tradeService.GetAllTradesAsync();
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