using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

public class StrangeItemStatHistoryService
{
    private readonly AppDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly ItemService _itemService;

    public StrangeItemStatHistoryService(AppDbContext context, IMemoryCache cache, ItemService itemService)
    {
        _context = context;
        _cache = cache;
        _itemService = itemService;
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
    public async Task<List<StrangeItemStatHistory>?> GetStatsByItemIdAsync(string itemId)
    {
        var stats = await _context.CountersHistory
            .Where(i => i.ItemId == itemId)
            .ToListAsync();

        if (stats == null || stats.Count == 0)
        {
            return null;
        }

        return stats;
    }
    public async Task<List<StrangeItemStatWithItemDto>?> GetStatsByUserIdAsync(string userId)
    {

        var stats = await _context.CountersHistory
            .Where(i => i.UserId == userId)
            .ToListAsync();

        if (stats == null || stats.Count == 0)
        {
            return null;
        }
        var statItemIds = stats.Select(s => s.ItemId).Distinct().ToList();
        var items = await _itemService.GetOrFetchEnrichedInventory(userId);
        var strangeItems = items.Where(i => i.quality == 11);
        var matchingStrangeItems = strangeItems
                .Where(i => statItemIds.Contains(i.id))
                .ToDictionary(i => i.id, i => i);
        var result = stats
        .Where(s => matchingStrangeItems.ContainsKey(s.ItemId))
        .Select(s => new StrangeItemStatWithItemDto
        {
            Stat = s,
            Item = matchingStrangeItems[s.ItemId]
        })
        .ToList();

        return result.Count > 0 ? result : null;
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