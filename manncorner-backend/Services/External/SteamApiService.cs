
public class SteamApiService : ISteamApiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    public SteamApiService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClient = httpClientFactory.CreateClient();
        _apiKey = configuration["Steam:ApiKey"];
    }
    public async Task<string> GetPlayerSummary(string steamId)
    {
        var url = $"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={_apiKey}&steamids={steamId}";
        var response = await this._httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}