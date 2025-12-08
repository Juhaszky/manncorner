using System.ComponentModel.DataAnnotations;

public class Item
{
    [Key]
    public int dbId { get; set; }
    public string Name { get; set; }
    public string FullName { get; set; }
    public string? Id { get; set; }
    public string Img { get; set; }
    public bool Craftable { get; set; }
    public bool Tradable { get; set; }
    public bool IsAustralium { get; set; }
    public string Type { get; set; }
    public int? Effect { get; set; } // optional
    public int Quality { get; set; }
    public int? Quantity { get; set; }
    public int? Killstreak { get; set; }
    public string? Killstreaker { get; set; }
    public string? Sheen { get; set; }
    public int Defindex { get; set; }

    // EconItem attributes
    public bool? Marketable { get; set; } // optional
    public bool? Commodity { get; set; }  // optional
    public int? Level { get; set; }    // optional
    public string? paint { get; set; }
    public int? paintDefindex { get; set; }
    public List<string>? Classes { get; set; } // optional
    public List<string>? Parts { get; set; }   // optional
    public List<string>? Spells { get; set; }  // optional
}
