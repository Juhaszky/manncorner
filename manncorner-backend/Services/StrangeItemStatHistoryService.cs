using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

public class StrangeItemStatHistoryService
{
    private readonly AppDbContext _context;

    public StrangeItemStatHistoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task refreshCounter(string userId, string itemId, int counterValue)
    {
        var existingStat = await _context.CountersHistory
            .FirstOrDefaultAsync(s => s.ItemId == itemId);
            
        if (existingStat == null)
        {
            var newStat = new StrangeItemStatHistory
            {
                UserId = userId,
                ItemId = itemId,
                Counter = counterValue,
                ChangeDate = DateTime.UtcNow
            };
            _context.CountersHistory.Add(newStat);

            await AddHistoryEntry(userId, itemId, counterValue);
        }
        else if (existingStat.Counter != counterValue)
        {
            existingStat.Counter = counterValue;
            existingStat.ChangeDate = DateTime.UtcNow;
            _context.CountersHistory.Update(existingStat);

            await AddHistoryEntry(userId, itemId, counterValue);
        }

        await _context.SaveChangesAsync();
    }
    public async Task<List<StrangeItemStatHistory>> GetStatsByItemIdAsync(string itemId)
    {
        var stats = await _context.CountersHistory
            .Where(s => s.ItemId == itemId)
            .OrderBy(s => s.ChangeDate)
            .ToListAsync();

        var grouped = stats
            .GroupBy(s => new { s.ItemId, s.UserId })
            .Select(g => new StrangeItemStatHistory
            {
                ItemId = g.Key.ItemId,
                UserId = g.Key.UserId,
                Counters = g.Select(x => new CounterEntry { ChangeDate = x.ChangeDate, Value = x.Counter }).ToList(),
            })
            .ToList();

        return grouped;
    }

    public async Task<List<StrangeItemStatHistory>> GetStatsByUserIdRawAsync(string userId)
    {
        return await _context.CountersHistory
            .Where(i => i.UserId == userId)
            .ToListAsync();
    }

    private async Task AddHistoryEntry(string userId, string itemId, int counterValue)
    {
        var historyEntry = new StrangeItemStatHistory
        {
            UserId = userId,
            ItemId = itemId,
            Counter = counterValue,
            ChangeDate = DateTime.UtcNow,
        };
        await _context.CountersHistory.AddAsync(historyEntry);
    }

}