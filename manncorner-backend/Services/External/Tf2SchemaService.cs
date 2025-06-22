using AngleSharp.Text;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

public class Tf2SchemaService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<Tf2SchemaService> _logger;

    public Tf2SchemaService(AppDbContext db, IConfiguration config, ILogger<Tf2SchemaService> logger)
    {
        _db = db;
        _config = config;
        _logger = logger;
    }

    public async Task SyncTf2SchemaAsync()
    {
        string apiKey = _config["Steam:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogError("Steam API Key not found.");
            return;
        }



        string url = $"https://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/?key={apiKey}";

        using var httpClient = new HttpClient();
        var json = await httpClient.GetStringAsync(url);

        var schema = JsonConvert.DeserializeObject<Tf2SchemaResponse>(json);
        var items = schema?.Result?.Items.GroupBy(i => i.Defindex).Select(g => g.First()).ToList() ?? new List<Tf2ItemSchema>();

        foreach (var item in items)
        {
            var existing = await _db.schemaItems
                .Include(i => i.Styles)
                .Include(i => i.Attributes)
                .FirstOrDefaultAsync(i => i.Defindex == item.Defindex);

            if (existing == null)
            {
                
                _db.schemaItems.Add(item); 
            }
            else
            {
                
                existing.Name = item.Name;
                existing.ItemClass = item.ItemClass;
                existing.ItemTypeName = item.ItemTypeName;
                existing.ItemName = item.ItemName;
                existing.ItemDescription = item.ItemDescription;
                existing.ProperName = item.ProperName;
                existing.ItemSlot = item.ItemSlot;
                existing.ModelPlayer = item.ModelPlayer;
                existing.ItemQuality = item.ItemQuality;
                existing.ImageInventory = item.ImageInventory;
                existing.MinILevel = item.MinILevel;
                existing.MaxILevel = item.MaxILevel;
                existing.ImageUrl = item.ImageUrl;
                existing.ImageUrlLarge = item.ImageUrlLarge;
                existing.DropType = item.DropType;

                _db.RemoveRange(existing.Styles);
                existing.Styles = item.Styles;

                _db.RemoveRange(existing.Attributes);
                existing.Attributes = item.Attributes;
            }
        }
        await _db.SaveChangesAsync();

        await _db.SaveChangesAsync();

        _logger.LogInformation("TF2 Schema synced successfully.");
    }
}
