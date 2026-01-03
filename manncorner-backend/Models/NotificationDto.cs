public class NotificationDto
{
  public int Id { get; set; }
  public string Title { get; set; } = null!;
  public string Message { get; set; } = null!;
  public string? DataJson { get; set; }
  public bool IsRead { get; set; }
  public DateTime CreatedAt { get; set; }
}