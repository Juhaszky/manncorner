public class StrangeItemStatHistory
{
    public int Id { get; set; }
    public string UserId {get; set; }
    public string ItemId { get; set; }
    public int Counter { get; set; }
    public DateTime ChangeDate { get; set; } = DateTime.UtcNow;
}