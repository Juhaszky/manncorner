public class Trade
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; }
    public User? User { get; set; }
    public ICollection<TradeItem> Items { get; set; }
}