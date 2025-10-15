
using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;

public class ItemService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _configuration;
    private readonly IMemoryCache _cache;
    private readonly string _apiKey;
    public ItemService(IConfiguration configuration, HttpClient httpClient, IMemoryCache cache)
    {
        _configuration = configuration;
        _http = httpClient;
        _apiKey = configuration["Steam:ApiKey"];
        _cache = cache;
    }
    public async Task<List<ParsedItem>?> GetOrFetchEnrichedInventory(string userId)
    {
        if (!_cache.TryGetValue($"full-enriched-inventory_{userId}", out List<ParsedItem>? fullEnrichedList))
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var items = await GetFullSteamInventory(userId);

            if (items == null || items.Error != null) return null;

            var mergedItems = items.Response.Assets.Select(asset =>
                     {
                         var matchingDesc = items.Response.Descriptions.FirstOrDefault(d =>
                   d.Classid == asset.classId &&
                   (d.Instanceid ?? "0") == (asset.instanceId ?? "0")
               );
                         if (matchingDesc == null) return null;

                         var enrichedDesc = JsonSerializer.Deserialize<ItemDescription>(
                   JsonSerializer.Serialize(matchingDesc), options);

                         var result = new
                         {
                             assetid = asset.assetId.ToString(),
                             matchingDesc.Appid,
                             matchingDesc.Classid,
                             matchingDesc.Instanceid,
                             matchingDesc.Currency,
                             matchingDesc.Background_Color,
                             matchingDesc.Actions,
                             matchingDesc.Name,
                             matchingDesc.Market_Name,
                             matchingDesc.Market_Hash_Name,
                             matchingDesc.Market_Actions,
                             matchingDesc.Market_Marketable_Restriction,
                             matchingDesc.Market_Tradable_Restriction,
                             matchingDesc.Name_Color,
                             matchingDesc.Type,
                             matchingDesc.Tags,
                             matchingDesc.Descriptions,
                             matchingDesc.Tradable,
                             matchingDesc.Marketable,
                             matchingDesc.Commodity,
                             matchingDesc.Icon_Url,
                             matchingDesc.Icon_Url_Large
                         };
                         return result;
                     })
                 .Where(x => x != null)
                 .ToList();

            var url = _configuration["MicroService:BASE_URL"];
            var enrichEndpoint = $"{url}/items/parse";

            var content = new StringContent(JsonSerializer.Serialize(mergedItems), System.Text.Encoding.UTF8, "application/json");
            var response = await _http.PostAsync(enrichEndpoint, content);
            var enrichedJson = await response.Content.ReadAsStringAsync();

            fullEnrichedList = JsonSerializer.Deserialize<List<ParsedItem>>(enrichedJson, options);
            if (fullEnrichedList == null) return null;

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(10))
                .SetAbsoluteExpiration(TimeSpan.FromHours(1))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set($"full-enriched-inventory_{userId}", fullEnrichedList, cacheEntryOptions);
        }
        return fullEnrichedList;
    }
    public async Task<List<ParsedItem>> GetFullBaseItems()
    {
        var response = await _http.GetAsync("http://localhost:3000/api/items");
        response.EnsureSuccessStatusCode();

        var items = await response.Content.ReadFromJsonAsync<List<ParsedItem>>();
        return items;
    }

    public async Task<InventoryResult> GetFullSteamInventory(string userId)
    {
        string lastAssetId = null;
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        var allAssets = new List<Asset>();
        var allDescriptions = new List<ItemDescription>();

        bool moreItems = true;
        while (moreItems)
        {
            string url = $"https://steamcommunity.com/inventory/{userId}/440/2";
            if (lastAssetId != null)
                url += $"?start_assetid={lastAssetId}";

            var response = await _http.GetAsync(url);
            if (response.StatusCode == HttpStatusCode.InternalServerError)
            {
                return new InventoryResult
                {
                    Error = response.ReasonPhrase

                    // 
                };
            }
            var json = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrWhiteSpace(json) || json.Equals("null", StringComparison.OrdinalIgnoreCase))
            {
                return new InventoryResult
                {
                    Response = new ItemResponse
                    {
                        Assets = new List<Asset>(),
                        Descriptions = new List<ItemDescription>()
                    }
                };
            }
            var page = JsonSerializer.Deserialize<ItemResponse>(json, options);
            if (page == null)
                throw new Exception("Failed to parse Steam inventory page!");

            allAssets.AddRange(page.Assets);
            allDescriptions.AddRange(page.Descriptions);
            moreItems = page.MoreItems;
            lastAssetId = page.LastAssetId;
        }

        var items = new ItemResponse
        {
            Assets = allAssets,
            Descriptions = allDescriptions
        };
        return new InventoryResult
        {
            Response = items
        };
    }
}