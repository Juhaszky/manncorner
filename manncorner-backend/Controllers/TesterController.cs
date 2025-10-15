using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TesterController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ItemService _itemService;

    public TesterController(AppDbContext dbContext, ItemService itemService)
    {
        _dbContext = dbContext;
        _itemService = itemService;
    }
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("Tester controller is working!"); // Breakpoint here
    }

    [HttpGet("generate-mock-trades")]
    public async Task<IActionResult> GenerateMockTrades()
    {
        try
        {
            var steamItems = await _itemService.GetOrFetchEnrichedInventory("76561198027857565");
            var baseItems = await _itemService.GetFullBaseItems();
            var random = new Random();
            var mockTrades = new List<Trade>();
            var numberOfTrades = 20000;
            var baseItemCount = random.Next(1, 10);
            for (int i = 0; i < numberOfTrades; i++)
            {
                var itemCount = random.Next(1, 10);
                var selectedItems = steamItems
                    .OrderBy(x => random.Next())
                    .Take(itemCount)
                    .ToList();
                var selectedBaseItems = baseItems
                    .OrderBy(x => random.Next())
                    .Take(baseItemCount)
                    .ToList();
                var tradeId = 2000 + i;
                var trade = new Trade
                {
                    UserId = "76561198027857565",
                    Username = "Juhaszky",
                    AvatarPath = "https://example.com/avatar.jpg",
                    Description = $"Mock trade #{i} with {itemCount} items",
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(0, 30)),
                    BumpDate = DateTime.UtcNow.AddHours(-random.Next(0, 24)),
                    Status = "Active",
                    Deleted = false,
                    Items = selectedItems.Select(item => new TradeItem
                    {
                        Defindex = item.defindex,
                        Name = item.name,
                        FullName = item.fullName,
                        Img = item.img,
                        Craftable = item.craftable,
                        Tradable = item.tradable,
                        Effect = random.Next(4, 368),
                        Quality = random.Next(1, 5),
                        Quantity = item.quantity,
                        Type = item.type,
                        Killstreak = item.killstreak,
                        Killstreaker = item.killstreaker,
                        Sheen = item.sheen,
                        Marketable = item.marketable,
                        Commodity = item.commodity,
                        Level = random.Next(1, 10),
                        paint = item.paint,
                        paintDefindex = item.paintDefindex,
                        Classes = item.classes,
                        Parts = item.parts,
                        Spells = item.spells,
                        IsSelling = true
                    }).Concat(selectedBaseItems.Select(item => new TradeItem
                    {
                        Name = item.name,
                        Defindex = item.defindex,
                        FullName = item.fullName,
                        Img = item.img,
                        Craftable = item.craftable,
                        Tradable = item.tradable,
                        Effect = random.Next(4, 368),
                        Quality = random.Next(1, 5),
                        Quantity = item.quantity,
                        Type = item.type,
                        Killstreak = item.killstreak,
                        Killstreaker = item.killstreaker,
                        Sheen = item.sheen,
                        Marketable = item.marketable,
                        Commodity = item.commodity,
                        Level = item.level,
                        paint = item.paint,
                        paintDefindex = item.paintDefindex,
                        Classes = item.classes,
                        Parts = item.parts,
                        Spells = item.spells,
                        IsSelling = false,
                    })).ToList(),
                    Comments = new List<Comment>()
                };

                mockTrades.Add(trade);
            }
            await _dbContext.Trades.AddRangeAsync(mockTrades);
            await _dbContext.SaveChangesAsync();
            return Ok(new
            {
                Success = true,
                TradeCount = mockTrades.Count,
                TotalSellingItems = mockTrades.Sum(t => t.Items.Count(i => i.IsSelling)),
                TotalBuyingItems = mockTrades.Sum(t => t.Items.Count(i => !i.IsSelling)),
                Message = "Mock trades generated successfully"
            });

        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                Error = ex.Message,
                InnerError = ex.InnerException?.Message,
                StackTrace = ex.InnerException?.StackTrace
            });
        }
    }
}
