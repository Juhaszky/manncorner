public class CommentRequest
{
    public int TradeId { get; set; }
    public string CommentData { get; set; }
    public int? ParentId { get; set; }
}