using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

public class Tf2ItemSchema
{
    [Key]
    public int Defindex { get; set; }

    [Required]
    public string Name { get; set; }

    public string? ItemClass { get; set; }

    public string ?ItemTypeName { get; set; }

    public string ?ItemName { get; set; }

    public string ?ProperName { get; set; }

    public bool ?Craftable { get; set; }

    public int? Quality { get; set; }

    public string ?ImageUrl { get; set; }
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

