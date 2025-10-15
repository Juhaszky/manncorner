public interface IItemService
{
    Task<Comment> MakeComment(int tradeId, string commentData, string userId, int? parentId, ICollection<CommentOfferItem>? itemsOffer);
}