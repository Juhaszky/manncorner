public class TradeItem : Item
{
    public bool IsSelling { get; set; }
    public int TradeId { get; set; }
     public Trade? Trade { get; set; }
}