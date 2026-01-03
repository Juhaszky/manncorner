public interface INotificationService
{
    Task SendTradeCommentNotificationAsync(string targetSteamId, Comment comment);
    Task<List<NotificationDto>> GetUnreadAsync(string steamId);
    Task MarkAsReadAsync(string steamId, int id);
    Task MarkAllAsReadAsync(string steamId);
    Task<List<NotificationDto>> GetAllAsync(string steamId, int page, int pageSize);
}