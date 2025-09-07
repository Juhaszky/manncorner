using Microsoft.EntityFrameworkCore;

public class CommentService : ICommentService
{
    private readonly AppDbContext _context;

    public CommentService(AppDbContext db)
    {
        _context = db;
    }
    public async Task MakeComment(int tradeId, string commentData, string userId, int? parentId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.SteamId == userId);
        var comment = new Comment
        {
            CommentData = commentData,
            TradeId = tradeId,
            CreatedAt = DateTime.UtcNow,
            Owner = user,
            ParentCommentId = parentId ?? null
            
        };
        _context.Add(comment);
        await _context.SaveChangesAsync();
    }
}