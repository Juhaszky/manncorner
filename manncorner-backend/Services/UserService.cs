// /Services/UserService.cs


using Microsoft.EntityFrameworkCore;

public class UserService
{
    private readonly AppDbContext _context;
    private readonly IServiceProvider _serviceProvider;

    public UserService(AppDbContext context, IServiceProvider serviceProvider)
    {
        _context = context;
        _serviceProvider = serviceProvider;
    }

    public async Task CreateUserAsync(string steamId, string tradeUrl)
    {
        var user = new User
        {
            SteamId = steamId,
            TradeUrl = null
        };
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }
    public async Task<User?> GetUserBySteamIdAsync(string steamId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.SteamId == steamId);
    }

    public async Task SetTradeUrlAsync(string steamId, string tradeUrl)
    {
        var user = await GetUserBySteamIdAsync(steamId);
        if (user == null)
        {
            throw new InvalidOperationException($"User with Steam ID '{steamId}' not found.");
        }

        bool isFirstTime = string.IsNullOrEmpty(user.TradeUrl);
        user.TradeUrl = tradeUrl;
        if (isFirstTime)
        {
            var expService = _serviceProvider.GetRequiredService<ExpService>();
            await expService.increaseExp(25, user.SteamId);
        }
        await _context.SaveChangesAsync();
    }
}