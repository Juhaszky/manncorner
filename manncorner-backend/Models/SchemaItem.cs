using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using System.Collections.Generic;

public class Tf2ItemSchema
{
    [Key]
    public int Id { get; set; }

    public int Defindex { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("item_class")]
    public string? ItemClass { get; set; }

    [JsonProperty("item_type_name")]
    public string? ItemTypeName { get; set; }

    [JsonProperty("item_name")]
    public string? ItemName { get; set; }

    [JsonProperty("item_description")]
    public string? ItemDescription { get; set; }

    [JsonProperty("proper_name")]
    public bool ProperName { get; set; }

    [JsonProperty("item_slot")]
    public string? ItemSlot { get; set; }

    [JsonProperty("model_player")]
    public string? ModelPlayer { get; set; }

    [JsonProperty("item_quality")]
    public int ItemQuality { get; set; }

    [JsonProperty("image_inventory")]
    public string? ImageInventory { get; set; }

    [JsonProperty("min_ilevel")]
    public int? MinILevel { get; set; }

    [JsonProperty("max_ilevel")]
    public int? MaxILevel { get; set; }

    [JsonProperty("image_url")]
    public string? ImageUrl { get; set; }

    [JsonProperty("image_url_large")]
    public string? ImageUrlLarge { get; set; }

    [JsonProperty("drop_type")]
    public string? DropType { get; set; }

    // Navigation properties for nested arrays

    [JsonIgnore]
    public List<Tf2ItemStyle> Styles { get; set; }

    public List<Tf2ItemAttribute> Attributes { get; set; }
}

public class Tf2ItemStyle
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Tf2ItemSchema")]
    public int Tf2ItemSchemaId { get; set; }

    public Tf2ItemSchema Tf2ItemSchema { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }
}

public class Tf2ItemAttribute
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Tf2ItemSchema")]
    public int Tf2ItemSchemaId { get; set; }

    public Tf2ItemSchema Tf2ItemSchema { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("class")]
    public string Class { get; set; }

    [JsonProperty("value")]
    public double Value { get; set; }
}
public class Tf2SchemaResponse
{
    [JsonProperty("result")]
    public Tf2SchemaResult Result { get; set; }
}

public class Tf2SchemaResult
{
    [JsonProperty("items")]
    public List<Tf2ItemSchema> Items { get; set; }
}