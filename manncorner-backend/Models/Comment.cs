public class Comment
{
    public int Id { get; set; }
    public int TradeId { get; set; }
    public int UserId { get; set; }
    public string CommentData { get; set; }
    public DateTime CreatedAt { get; set; }
    public User Owner { get; set; }
    public Trade Trade { get; set; }
    public int? ParentCommentId { get; set; }
    public ICollection<Comment> Replies { get; set; }
    //TODO also be able to offer items!
    // public ICollection<Item> ItemsOffer { get; set; }
}