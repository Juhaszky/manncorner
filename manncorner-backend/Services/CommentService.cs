using Microsoft.EntityFrameworkCore;

public class CommentService : ICommentService
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public CommentService(AppDbContext db, INotificationService notificationService)
    {
        _context = db;
        _notificationService = notificationService;
    }
    public async Task<Comment> MakeComment(int tradeId, string commentData, string userId, int? parentId, ICollection<CommentOfferItem>? itemsOffer)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.SteamId == userId);
        var comment = new Comment
        {
            CommentData = commentData,
            TradeId = tradeId,
            CreatedAt = DateTime.UtcNow,
            Owner = user,
            ParentCommentId = parentId ?? null,
            ItemsOffer = itemsOffer ?? new List<CommentOfferItem>()

        };
        _context.Add(comment);
        await _context.SaveChangesAsync();
        var trade = await _context.Trades.FindAsync(tradeId);
        if (trade.Follow)
        {

            await _notificationService.SendTradeCommentNotificationAsync(user?.SteamId, comment);
        }
        return comment;
    }
}