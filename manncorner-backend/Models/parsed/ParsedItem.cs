public class ParsedItem
{
    public string id { get; set; }
    public string name { get; set; }
    public string fullName { get; set; }
    public string img { get; set; }
    public bool craftable { get; set; }
    public bool tradable { get; set; }
    public bool marketable { get; set; }
    public bool commodity { get; set; }
    public string type { get; set; }
    public int? effect { get; set; }
    public int quality { get; set; }
    public int defindex { get; set; }
    public int level { get; set; }
    public string[] classes { get; set; }
    public string[]? parts { get; set; }
    public string[]? spells { get; set; }

}