
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
        _db.Trades.Add(trade);
        await _db.SaveChangesAsync();
        return trade;
    }

    public async Task<IEnumerable<Trade>> GetAllTradesAsync()
    {
        return await _db.Trades
            .Include(t => t.Items)
            .ToListAsync();
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
            .FirstOrDefaultAsync(t => t.Id == tradeId);
        return trade;
    }
}