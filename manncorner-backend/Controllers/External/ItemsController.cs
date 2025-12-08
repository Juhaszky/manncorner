using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Net;
using System.Text.Json;
using System.Text.RegularExpressions;

[ApiController]
public class ItemsController : ControllerBase
{
  private readonly IWebHostEnvironment _env;
  private readonly HttpClient _http;
  private readonly IConfiguration _configuration;
  private readonly StrangeItemStatHistoryService _strangeItemStatHistoryService;
  private readonly IMemoryCache _cache;
  public ItemsController(IWebHostEnvironment env, IHttpClientFactory httpClientFactory, IConfiguration configuration, IMemoryCache cache, StrangeItemStatHistoryService strangeItemStatHistoryService)
  {
    _env = env;
    _http = httpClientFactory.CreateClient("SteamClient");
    _configuration = configuration;
    _cache = cache;
    _strangeItemStatHistoryService = strangeItemStatHistoryService;
  }

  [HttpGet("/items")]
  public async Task<IActionResult> GetUserItems([FromQuery] string userId, int offset = 0, [FromQuery] int limit = 40)
  {

    var fullEnrichedList = await GetOrFetchEnrichedInventory(userId);

    if (fullEnrichedList == null)
    {
      return StatusCode(500, "Failed to parse items.");
    }
    var page = fullEnrichedList
        .Skip(offset)
        .Take(limit)
        .ToList();

    return Ok(page);
  }
  [HttpGet("/items/search")]
  public async Task<IActionResult> SearchUserItems([FromQuery] string searchString, [FromQuery] string userId)
  {
    var fullEnrichedList = await GetOrFetchEnrichedInventory(userId);

    if (fullEnrichedList == null)
    {
      return StatusCode(500, "Failed to parse items.");
    }

    if (fullEnrichedList == null)
      return StatusCode(500, "Failed to parse items.");

    // Null-safe property checks for Contains to avoid ArgumentNullException
    var matched = fullEnrichedList
        .Where(item =>
            (!string.IsNullOrEmpty(item.name) && item.name.Contains(searchString, StringComparison.OrdinalIgnoreCase)) ||
            (!string.IsNullOrEmpty(item.fullName) && item.fullName.Contains(searchString, StringComparison.OrdinalIgnoreCase))
        )
        .Take(15)
        .ToList();

    return Ok(matched);
  }
  private async Task<InventoryResult> GetFullSteamInventory(string userId)
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

  private async Task<List<ParsedItem>?> GetOrFetchEnrichedInventory(string userId)
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
                   matchingDesc.OriginalTypeTxt,
                   matchingDesc.IsAustralium,
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
      var strangeItems = fullEnrichedList
        .Where(i => i.quality == 11);
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
      var cacheEntryOptions = new MemoryCacheEntryOptions()
          .SetSlidingExpiration(TimeSpan.FromMinutes(10))
          .SetAbsoluteExpiration(TimeSpan.FromHours(1))
          .SetPriority(CacheItemPriority.Normal);

      _cache.Set($"full-enriched-inventory_{userId}", fullEnrichedList, cacheEntryOptions);
    }
    return fullEnrichedList;
  }

}
