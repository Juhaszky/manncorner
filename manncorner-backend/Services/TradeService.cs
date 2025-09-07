
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

public class TradeService : ITradeService
{
    private readonly AppDbContext _db;

    public TradeService(AppDbContext db)
    {
        _db = db;
    }
    public Task<string> GetTrades(string steamId)
    {
        throw new NotImplementedException();
    }
    public Task MakeTrade(Item itemToTrade, Item itemForTrade)
    {

        return null;
    }
    public async Task<Trade> CreateTradeAsync(Trade trade)
    {
        trade.CreatedAt = DateTime.UtcNow;
        trade.BumpDate = trade.CreatedAt;
        _db.Trades.Add(trade);
        await _db.SaveChangesAsync();
        return trade;
    }

    public async Task<object> GetAllTradesAsync(int page, int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;
        var totalCount = await _db.Trades.CountAsync();
        var trades = await _db.Trades
            .Include(t => t.Items)
            .OrderByDescending(t => t.BumpDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return new
        {
            Trades = trades,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<List<Trade>> GetAllTradesByUserAsync(string userId)
    {
        return await _db.Trades
            .Include(t => t.Items)
            .Where(t => t.UserId == userId)
            .ToListAsync();
    }

    public async Task<Trade> GetTradeByIdAsync(int tradeId)
    {
        var trade = await _db.Trades
            .Include(t => t.Items)
            .Include(t => t.Comments)
                .ThenInclude(c => c.Owner)
            .FirstOrDefaultAsync(t => t.Id == tradeId);
        return trade;
    }
    public async Task<Trade> BumpTrade(string userId, int tradeId)
    {
        var trade = await _db.Trades.FirstOrDefaultAsync(t => t.Id == tradeId);
        trade.BumpDate = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return trade;
    }
}