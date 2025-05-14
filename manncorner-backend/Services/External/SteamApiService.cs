
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
        try
        {
            var url = $"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={_apiKey}&steamids={steamId}";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                Console.WriteLine($"Steam API error: {(int)response.StatusCode} - {response.ReasonPhrase}");
                return null;
            }
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Steam API doesn't respond: {ex.Message}");
            return null;
        }
    }
}