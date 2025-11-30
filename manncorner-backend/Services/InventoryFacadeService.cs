using System.Text.RegularExpressions;

public class InventoryFacadeService
{
    private readonly ItemService _itemService;
    private readonly StrangeItemStatHistoryService _strangeItemStatHistoryService;

    public InventoryFacadeService(ItemService itemService, StrangeItemStatHistoryService strangeItemStatHistoryService)
    {
        _itemService = itemService;
        _strangeItemStatHistoryService = strangeItemStatHistoryService;
    }

    public async Task<List<StrangeItemStatWithItemDto>?> GetStatsByUserIdAsync(string userId)
    {

        var stats = await _strangeItemStatHistoryService.GetStatsByUserIdRawAsync(userId);

        if (stats == null || stats.Count == 0)
        {
            return null;
        }
        var statItemIds = stats.Select(s => s.ItemId).Distinct().ToList();
        var items = await GetOrFetchEnrichedInventoryWithStatRefresh(userId);
        if (items == null) return null;
        var strangeItems = items.Where(i => i.quality == 11);
        var matchingStrangeItems = strangeItems
                .Where(i => statItemIds.Contains(i.id))
                .ToDictionary(i => i.id, i => i);
        var groupedStats = stats
            .GroupBy(s => new { s.ItemId, s.UserId })
            .Select(g => new StrangeItemStatHistory
            {
                ItemId = g.Key.ItemId,
                UserId = g.Key.UserId,
                Counters = g.Select(x => new CounterEntry { ChangeDate = x.ChangeDate, Value = x.Counter }).ToList(),
            })
            .ToList();
        var result = groupedStats
        .Where(s => matchingStrangeItems.ContainsKey(s.ItemId))
        .Select(s => new StrangeItemStatWithItemDto
        {
            Stat = s,
            Item = matchingStrangeItems[s.ItemId]
        })
        .ToList();

        return result.Count > 0 ? result : null;
    }

    public async Task<List<ParsedItem>?> GetOrFetchEnrichedInventoryWithStatRefresh(string userId)
    {
        var items = await _itemService.GetOrFetchEnrichedInventory(userId);
        if (items == null) return null;

        var strangeItems = items.Where(i => i.quality == 11);
        foreach (var strangeItem in strangeItems)
        {
            var counterMatch = Regex.Match(strangeItem.originalTypeTxt ?? "",
                @"-\s*([^:]+):\s*(\d+)", RegexOptions.IgnoreCase);

            if (counterMatch.Success)
            {
                var statName = counterMatch.Groups[1].Value.Trim();
                var counterValue = int.Parse(counterMatch.Groups[2].Value);

                await _strangeItemStatHistoryService.refreshCounter(
                    userId,
                    strangeItem.id,
                    counterValue
                );
            }
        }

        return items;
    }

}

