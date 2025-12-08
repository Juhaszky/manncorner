using System.Text.Json.Serialization;

public class ItemDescription
{
    public int Appid { get; set; }
    public string Classid { get; set; }
    public string Instanceid { get; set; }
    public int Currency { get; set; }
    public string Background_Color { get; set; }
    public string Icon_Url { get; set; }
    public string Icon_Url_Large { get; set; }
    public List<DescriptionEntry> Descriptions { get; set; }
    [JsonConverter(typeof(BoolOrIntConverter))]
    public bool Tradable { get; set; }
    public List<ActionEntry> Actions { get; set; }
    public string Name { get; set; }
    public string Name_Color { get; set; }
    public string Type { get; set; }
    public string OriginalTypeTxt { get; set; }
    public bool IsAustralium { get; set; }
    public string Market_Name { get; set; }
    public string Market_Hash_Name { get; set; }
    public List<ActionEntry> Market_Actions { get; set; }
    [JsonConverter(typeof(BoolOrIntConverter))]
    public bool Commodity { get; set; }
    public int Market_Tradable_Restriction { get; set; }
    public int Market_Marketable_Restriction { get; set; }
    [JsonConverter(typeof(BoolOrIntConverter))]
    public bool Marketable { get; set; }
    public List<Tag> Tags { get; set; }
}