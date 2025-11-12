public class TradeItemSearchCriteria
{
    public ICollection<string>? ItemIds { get; set; }
    public ICollection<int>? Effects { get; set; }
    public ICollection<int>? Qualities { get; set; }
    public ICollection<int>? Paints { get; set; }
}