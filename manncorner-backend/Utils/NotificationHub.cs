using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub
{
    private readonly INotificationService _notificationService;

    public async Task JoinUserGroup(string steamId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{steamId}");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}