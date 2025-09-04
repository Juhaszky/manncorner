public class Trade
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public string? Description { get; set;  }
    public DateTime CreatedAt { get; set; }
    public DateTime BumpDate { get; set; }
    public string Status { get; set; }
    //public User? User { get; set; }
    public string Username { get; set; }
    public ICollection<TradeItem> Items { get; set; }
}