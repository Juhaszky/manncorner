public class User
{
    public int Id { get; set; }
    public string SteamId { get; set; }
    public string? TradeUrl { get; set; }
    public string? Username { get; set; }
    public string? avatarPath { get; set; }
    public int XP { get; set; }
    public List<FavouriteItem> FavoriteItems { get; set; } = new();
}