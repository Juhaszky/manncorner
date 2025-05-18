// /Services/UserService.cs


using Microsoft.EntityFrameworkCore;

public class UserService
{
    private readonly AppDbContext _context;
    private readonly ExpService _expService;

    public UserService(AppDbContext context, ExpService expService)
    {
        _context = context;
        _expService = expService;
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
        if (user != null)
        {
            bool isFirstTime = string.IsNullOrEmpty(tradeUrl);
            user.TradeUrl = tradeUrl;
            if (isFirstTime)
            {
                await _expService.increaseExp(25, user.SteamId);
            }
            await _context.SaveChangesAsync();
        }
    }
}