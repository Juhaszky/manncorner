using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;
    public NotificationService(AppDbContext context, IHubContext<NotificationHub> notificationHub)
    {
        _context = context;
        _hubContext = notificationHub;
    }
    public async Task SendTradeCommentNotificationAsync(string targetSteamId, Comment comment)
    {
        var user = await _context.Users.FindAsync(comment.UserId);
        var isReply = comment.ParentCommentId != null;

        var notification = new Notification
        {
            TargetUserId = comment.UserId,
            TargetSteamId = targetSteamId,
            Type = isReply ? "CommentReply" : "TradeComment",
            Title = isReply ? "New reply on your comment" : "New comment on your trade",
            Message = $"{user.Username} {(isReply ? "replied to your comment" : "commented on your trade")}",
            DataJson = JsonSerializer.Serialize(new { tradeId = comment.TradeId })
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.Group($"user_{targetSteamId}")
            .SendAsync("ReceiveNotification", notification);
    }
    public async Task<List<NotificationDto>> GetUnreadAsync(string steamId)
    {
        return await _context.Notifications
          .Where(n => n.TargetSteamId == steamId && !n.IsRead)
          .OrderByDescending(n => n.CreatedAt)
          .Take(50)
          .Select(n => new NotificationDto
          {
              Id = n.Id,
              Title = n.Title,
              DataJson = n.DataJson,
              Message = n.Message,
              IsRead = n.IsRead,
              CreatedAt = n.CreatedAt
          })
          .ToListAsync();
    }

    public async Task MarkAsReadAsync(string steamId, int id)
    {
        var notification = await _context.Notifications
          .FirstOrDefaultAsync(n => n.Id == id && n.TargetSteamId == steamId);

        if (notification != null)
        {
            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task MarkAllAsReadAsync(string steamId)
    {
        var notifications = await _context.Notifications
          .Where(n => n.TargetSteamId == steamId && !n.IsRead)
          .ToListAsync();

        foreach (var n in notifications) n.IsRead = true;
        await _context.SaveChangesAsync();
    }
    public async Task<List<NotificationDto>> GetAllAsync(string steamId, int page, int pageSize)
    {
        return await _context.Notifications
          .Where(n => n.TargetSteamId == steamId)
          .OrderByDescending(n => n.CreatedAt)
          .Skip((page - 1) * pageSize)
          .Take(pageSize)
          .Select(n => new NotificationDto
          {
              Id = n.Id,
              Title = n.Title,
              Message = n.Message,
              IsRead = n.IsRead,
              CreatedAt = n.CreatedAt
          })
          .ToListAsync();
    }
}