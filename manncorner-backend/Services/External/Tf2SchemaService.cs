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

        foreach (var (item, index) in items.Select((item, index) => (item, index)))
        {
            var entity = new Tf2ItemSchema
            {
                Defindex = item.Defindex,//Convert.ToInt32(item.Defindex.ToString() + index.ToString()),
                Name = item.Name,
                ItemClass = item.ItemClass,
                ItemTypeName = item.ItemTypeName,
                Craftable = true,
                Quality = item.Quality,
                ImageUrl = item.ImageUrl
            };

            var existing = await _db.schemaItems.FindAsync(item.Defindex);
            if (existing == null)
            {
                _db.schemaItems.Add(entity);
            }
            else
            {
                _db.schemaItems.Remove(existing);
            }
        }
        await _db.SaveChangesAsync();


        await _db.SaveChangesAsync();
        _logger.LogInformation("TF2 Schema synced successfully.");
    }
}
