public interface ISteamApiService
{
    Task<string> GetPlayerSummary(string steamId);
}