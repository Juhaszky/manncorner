public interface ISteamApiService
{
    Task<SteamPlayerSummary> GetPlayerSummary(string steamId);
}