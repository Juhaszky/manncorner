public class InventoryResult
{
    public ItemResponse? Response { get; set; }
    public string? Error { get; set; }
    public bool IsSuccess => Response != null && Error == null;
}