
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class TradeService : ITradeService
{
    private readonly AppDbContext _db;

    public TradeService(AppDbContext db)
    {
        _db = db;
    }
    public async Task<Trade> CreateTradeAsync(Trade trade)
    {
        trade.CreatedAt = DateTime.UtcNow;
        trade.Deleted = false;
        trade.BumpDate = trade.CreatedAt;
        _db.Trades.Add(trade);
        await _db.SaveChangesAsync();
        return trade;
    }

    public async Task<object> GetAllTradesAsync(int page, int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;
        var totalCount = await _db.Trades.CountAsync(t => t.Deleted == false);
        var trades = await _db.Trades
            .Include(t => t.Items)
            .OrderByDescending(t => t.BumpDate)
            .Where(t => t.Status != "closed")
            .Where(t => t.Deleted == false)
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
            .OrderByDescending(t => t.BumpDate)
            .OrderByDescending(t => t.Status == "open")
            .Where(t => t.Deleted == false)
            .Where(t => t.UserId == userId)
            .ToListAsync();
    }

    public async Task<Trade> GetTradeByIdAsync(int tradeId)
    {
        var trade = await _db.Trades
            .Include(t => t.Items)
            .Include(t => t.Comments)
                .ThenInclude(c => c.Owner)
            .Include(t => t.Comments)
                .ThenInclude(c => c.ItemsOffer)
            .FirstOrDefaultAsync(t => t.Id == tradeId);
        return trade;
    }
    public async Task<TradeBumpResult> BumpTrade(string userId, int tradeId)
    {
        var trade = await _db.Trades.FirstOrDefaultAsync(t => t.Id == tradeId);

        if (trade == null)
        {
            return new TradeBumpResult
            {
                Status = 404,
                Error = "Trade not found"
            };
        }

        if (trade.BumpDate.AddMinutes(5) > DateTime.UtcNow)
        {
            return new TradeBumpResult
            {
                Status = 200,
                Error = "Cannot bump yet"
            };
        }

        trade.BumpDate = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return new TradeBumpResult
        {
            Status = 200,
            Trade = trade
        };
    }
    public async Task<TradeStatusResult> ChangeTradeStatusAsync(int tradeId)
    {
        var trade = await _db.Trades.FirstOrDefaultAsync(t => t.Id == tradeId);

        if (trade == null)
        {
            return new TradeStatusResult
            {
                Status = 404,
                Error = "Trade not found"
            };
        }

        trade.Status = trade.Status == "open" ? "closed" : "open";
        await _db.SaveChangesAsync();

        return new TradeStatusResult
        {
            Status = 200,
            Trade = trade
        };
    }

    public async Task<TradeDeleteResult> DeleteTrade(int tradeId)
    {
        var trade = await _db.Trades.FirstOrDefaultAsync(t => t.Id == tradeId);
        if (trade == null)
        {
            return new TradeDeleteResult
            {
                Status = 404,
                Error = "Trade not found"
            };
        }

        trade.Deleted = true;
        await _db.SaveChangesAsync();

        return new TradeDeleteResult
        {
            Status = 200,
            Trade = trade
        };
    }
}