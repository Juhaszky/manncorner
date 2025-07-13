
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
            //var response = await _httpClient.GetAsync(url);
            var mockResponse = @"{
            ""response"": {
                ""players"": [
                    {
                        ""steamid"": ""76561198027857565"",
                        ""communityvisibilitystate"": 3,
                        ""profilestate"": 1,
                        ""personaname"": ""Juhaszky"",
                        ""commentpermission"": 1,
                        ""profileurl"": ""https://steamcommunity.com/id/Juhaszky/"",
                        ""avatar"": ""https://avatars.steamstatic.com/f6826be3e9442a9352849013a5f84f8c6c5b09dd.jpg"",
                        ""avatarmedium"": ""https://avatars.steamstatic.com/f6826be3e9442a9352849013a5f84f8c6c5b09dd_medium.jpg"",
                        ""avatarfull"": ""https://avatars.steamstatic.com/f6826be3e9442a9352849013a5f84f8c6c5b09dd_full.jpg"",
                        ""avatarhash"": ""f6826be3e9442a9352849013a5f84f8c6c5b09dd"",
                        ""lastlogoff"": 1747342985,
                        ""personastate"": 0,
                        ""primaryclanid"": ""103582791474593353"",
                        ""timecreated"": 1279572634,
                        ""personastateflags"": 0
                    }
                ]
            }
        }";
        return mockResponse;
            // if (response.IsSuccessStatusCode)
            // {
            //     return await response.Content.ReadAsStringAsync();
            // }
            // else
            // {
            //     Console.WriteLine($"Steam API error: {(int)response.StatusCode} - {response.ReasonPhrase}");
            //     return null;
            // }
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Steam API doesn't respond: {ex.Message}");
            return null;
        }
    }
}