using System.Text.Json.Serialization;

public class ItemResponse
{
    public List<Asset> Assets { get; set; }
    public List<ItemDescription> Descriptions { get; set; }
    [JsonPropertyName("more_items")]
    [JsonConverter(typeof(BoolOrIntConverter))]
    public bool MoreItems { get; set; }
    [JsonPropertyName("total_inventory_count")]
    public int TotalInventoryCount { get; set; }
    [JsonPropertyName("last_assetid")]
    public string LastAssetId { get; set; }
    [JsonPropertyName("success")]
    [JsonConverter(typeof(BoolOrIntConverter))]
    public bool Success { get; set; }

}