public class Tf2Item
{
    public int Defindex { get; set; }
    public string Name { get; set; }
    public int Quality { get; set; }
    public bool Craftable { get; set; } = true;
    public int Killstreaker { get; set; }
    public int Spell { get; set; }
    public int Sheen { get; set; }
    public bool Australium { get; set; }
    public bool Festive { get; set; }
    public int? Effect { get; set; }
    public int? Paintkit { get; set; }
    public float? Wear { get; set; }
    public int? Quality2 { get; set; }
    public int? Target { get; set; }
    public int? CraftNumber { get; set; }
    public string? ImageUrl { get; set; }

    public string ToSku()
    {
        var parts = new List<string>
        {
            Defindex.ToString(),
            Quality.ToString(),
            Craftable ? "1" : "0",
            Killstreaker.ToString(),
            Australium ? "1" : "0",
            Festive ? "1" : "0",
            Effect?.ToString() ?? "",
            Paintkit?.ToString() ?? "",
            Wear?.ToString("0.0#####", System.Globalization.CultureInfo.InvariantCulture) ?? "",
            Quality2?.ToString() ?? "",
            Target?.ToString() ?? "",
            CraftNumber?.ToString() ?? ""
        };

        for (int i = parts.Count - 1; i >= 0; i--)
        {
            if (string.IsNullOrEmpty(parts[i]))
                parts.RemoveAt(i);
            else break;
        }

        return string.Join(";", parts);
    }
}
