
using System.Diagnostics;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class TradeService : ITradeService
{
    private readonly AppDbContext _db;
    private readonly ILoggerService _logger;

    public TradeService(AppDbContext db, ILoggerService logger)
    {
        _db = db;
        _logger = logger;
    }
    public async Task<Trade> CreateTradeAsync(Trade trade)
    {
        trade.CreatedAt = DateTime.UtcNow;
        trade.Deleted = false;
        trade.Follow = true;
        trade.BumpDate = trade.CreatedAt;
        _logger.LogInformation("User {UserId} added trade {TradeId} with {ItemCount} items", trade.UserId, trade.Id, trade.Items.Count);
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
    public async Task<TradeStatusResult> ChangeTradeFollowFlagAsync(int tradeId)
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

        trade.Follow = !trade.Follow;
        await _db.SaveChangesAsync();

        return new TradeStatusResult
        {
            Status = 200,
            Trade = trade
        };
    }
    public async Task<Trade?> UpdateTradeAsync(Trade trade)
    {
        var existingTrade = await _db.Trades
            .Include(t => t.Items)
            .FirstOrDefaultAsync(t => t.Id == trade.Id);

        if (existingTrade == null)
        {
            return null;
        }

        existingTrade.Description = trade.Description;
        existingTrade.Username = trade.Username;
        existingTrade.BumpDate = DateTime.UtcNow;
        _db.Items.RemoveRange(existingTrade.Items);

        existingTrade.Items.Clear();
        foreach (var item in trade.Items)
        {
            existingTrade.Items.Add(item);
        }

        await _db.SaveChangesAsync();
        return existingTrade;
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
    public async Task<object> SearchTradesAsync(ICollection<TradeItem> items, int page = 1, int pageSize = 50)
    {
        IQueryable<Trade> query = _db.Trades
            .Where(t => t.Deleted == false && t.Status != "closed");

        if (items != null && items.Any())
        {
            var hasCustomSpells = items.Any(i => i.Name == "CUSTOM_SPELLS");

            if (hasCustomSpells)
            {
                query = query.Where(t => t.Items.Any(i => i.Spells != null && i.Spells.Count > 0));
            }
            else
            {
                foreach (var searchItem in items)
                {
                    var localSearchItem = searchItem;

                    query = query.Where(t => t.Items.Any(dbItem =>
                        dbItem.Defindex == localSearchItem.Defindex &&
                        (localSearchItem.Effect == null || dbItem.Effect == localSearchItem.Effect) &&
                        (localSearchItem.paintDefindex == null || dbItem.paintDefindex == localSearchItem.paintDefindex) &&
                        (localSearchItem.Killstreak == null || dbItem.Killstreak == localSearchItem.Killstreak) &&
                        (string.IsNullOrEmpty(localSearchItem.Killstreaker) || dbItem.Killstreaker == localSearchItem.Killstreaker) &&
                        (string.IsNullOrEmpty(localSearchItem.Sheen) || dbItem.Sheen == localSearchItem.Sheen) &&
                        dbItem.IsSelling == localSearchItem.IsSelling
                    ));
                }
            }
        }

        var totalCount = await query.CountAsync();

        var pagedTrades = await query
            .Include(t => t.Items)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return new
        {
            Trades = pagedTrades,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }
}