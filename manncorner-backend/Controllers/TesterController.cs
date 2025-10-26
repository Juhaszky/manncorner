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
            var random = new Random();
            var mockTrades = new List<Trade>();
            var numberOfTrades = 25000;
            var mockUsers = new List<(string UserId, string UserName, string Avatar)>
            {
                ("76561198027857565", "Juhaszky", "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"),
            };
            var baseItems = await _itemService.GetFullBaseItems();
            for (int i = 0; i < numberOfTrades; i++)
            {
                var randomUser = mockUsers[random.Next(mockUsers.Count)];
                var steamItems = await _itemService.GetOrFetchEnrichedInventory(randomUser.UserId);
                if (steamItems != null)
                {


                    var sellingItemCount = random.Next(1, Math.Min(10, steamItems.Count));
                    var buyingItemCount = random.Next(1, 10);

                    var selectedItems = steamItems
                        .OrderBy(x => random.Next())
                        .Take(sellingItemCount)
                        .ToList();
                    var selectedBaseItems = baseItems
                        .OrderBy(x => random.Next())
                        .Take(buyingItemCount)
                        .ToList();
                    var tradeId = 2000 + i;
                    var itemQuality = random.Next(1, 6);
                    var trade = new Trade
                    {
                        UserId = randomUser.UserId,
                        Username = randomUser.UserName,
                        AvatarPath = randomUser.Avatar,
                        Description = $"Trading {sellingItemCount} items for {buyingItemCount} items",
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
                            Effect = itemQuality == 5 ? random.Next(4, 368) : null,
                            Quality = itemQuality,
                            Quantity = item.quantity,
                            Type = item.type,
                            Killstreak = item.killstreak ?? 0,
                            Killstreaker = item.killstreaker ?? "",
                            Sheen = item.sheen ?? "",
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
                            Effect = itemQuality == 5 ? random.Next(4, 368) : null,
                            Quality = random.Next(1, 5),
                            Quantity = item.quantity,
                            Type = item.type,
                            Killstreak = item.killstreak ?? 0,
                            Killstreaker = item.killstreaker ?? "",
                            Sheen = item.sheen ?? "",
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
                    if ((i + 1) % 1000 == 0)
                    {
                        await _dbContext.Trades.AddRangeAsync(mockTrades);
                        await _dbContext.SaveChangesAsync();
                        _dbContext.ChangeTracker.Clear();
                        mockTrades.Clear();
                        Console.WriteLine($"Saved {i + 1} trades...");
                        GC.Collect();
                        GC.WaitForPendingFinalizers();
                    }
                }
            }
            if (mockTrades.Any())
            {
                await _dbContext.Trades.AddRangeAsync(mockTrades);
                await _dbContext.SaveChangesAsync();
            }
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
