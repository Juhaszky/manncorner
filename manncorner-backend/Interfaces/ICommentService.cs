public interface ICommentService
{
    Task MakeComment(int tradeId, string commentData, string userId,  int? parentId);
}