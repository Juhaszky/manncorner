using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
public class ItemsController : ControllerBase
{
  private readonly IWebHostEnvironment _env;
  private readonly HttpClient _http;
  public ItemsController(IWebHostEnvironment env, IHttpClientFactory httpClientFactory)
  {
    _env = env;
    _http = httpClientFactory.CreateClient();
  }

  [HttpGet("/items")]
  public async Task<IActionResult> GetUserItems([FromQuery] int offset = 0, [FromQuery] int limit = 20)
  {
    var filePath = Path.Combine(_env.ContentRootPath, "Mock", "clean-assets.json");

    if (!System.IO.File.Exists(filePath))
      return NotFound("Mock asset file not found.");
    var inventoryUrl = "https://steamcommunity.com/inventory/76561198027857565/440/2";
    var inventory = await _http.GetAsync(inventoryUrl);
    var inventoryJson = await inventory.Content.ReadAsStringAsync();
    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
    var items = JsonSerializer.Deserialize<ItemResponse>(inventoryJson, options);
    var mergedItems = items.Assets.Select(asset =>
        {
          var matchingDesc = items.Descriptions.FirstOrDefault(d =>
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
            matchingDesc.Name,
            matchingDesc.Market_Name,
            matchingDesc.Market_Hash_Name,
            matchingDesc.Tags,
            matchingDesc.Descriptions,
            matchingDesc.Tradable,
            matchingDesc.Marketable,
            matchingDesc.Commodity,
            matchingDesc.Icon_Url,
          };

          return result;
        })
    .Where(x => x != null)
    .Skip(offset)
    .Take(limit)
    .ToList();
    var json = await System.IO.File.ReadAllTextAsync(filePath);

    //var items = JsonSerializer.Deserialize<ItemResponse>(json, options);

    if (items == null) return StatusCode(500, "Failed to parse items.");

    var pagedItems = items.Descriptions.Skip(offset).Take(limit).ToList();
    var enrichmentTasks = mergedItems.Select(async item =>
    {
      var url = "http://localhost:3000/api/items/parse";
      var content = new StringContent(JsonSerializer.Serialize(item), System.Text.Encoding.UTF8, "application/json");
      var response = await _http.PostAsync(url, content);


      var enrichedJson = await response.Content.ReadAsStringAsync();
      // Log for debugging
      Console.WriteLine($"URL: {url}");
      Console.WriteLine($"Status: {response.StatusCode}");
      Console.WriteLine($"Raw response: {enrichedJson}");
      return JsonSerializer.Deserialize<Item>(enrichedJson, options) ?? throw new InvalidOperationException("Failed to parse item.");
    });

    var enrichedItems = await Task.WhenAll(enrichmentTasks);
    return Ok(enrichedItems);
  }
}
