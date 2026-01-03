using System.ComponentModel.DataAnnotations;

public class Notification
{
  [Key] public int Id { get; set; }
  public int TargetUserId { get; set; }
  public string TargetSteamId { get; set; } = null!;
  public string Type { get; set; } = null!;
  public string Title { get; set; } = null!;
  public string Message { get; set; } = null!;
  public string? DataJson { get; set; }
  public bool IsRead { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public User TargetUser { get; set; } = null!;
}