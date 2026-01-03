using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
  private readonly INotificationService _notificationService;

  public NotificationsController(INotificationService notificationService)
  {
    _notificationService = notificationService;
  }

  [HttpGet("unread")]
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
  public async Task<ActionResult<List<NotificationDto>>> GetUnread()
  {
    string userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Unauthorized();

    var notifications = await _notificationService.GetUnreadAsync(userId);
    return Ok(notifications);
  }

  [HttpGet]
  public async Task<ActionResult<List<NotificationDto>>> GetAll(int? page = 1, int pageSize = 20)
  {
    var steamId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(steamId)) return Unauthorized();

    var notifications = await _notificationService.GetAllAsync(steamId, page.Value, pageSize);
    return Ok(notifications);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> MarkAsRead(int id)
  {
    var steamId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(steamId)) return Unauthorized();

    await _notificationService.MarkAsReadAsync(steamId, id);
    return NoContent();
  }

  [HttpDelete("clear-all")]
  public async Task<IActionResult> ClearAll()
  {
    var steamId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(steamId)) return Unauthorized();

    await _notificationService.MarkAllAsReadAsync(steamId);
    return NoContent();
  }
}
