// /Services/UserService.cs


using Microsoft.EntityFrameworkCore;

public class UserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateUserAsync(string steamId, string tradeUrl)
    {
        var user = new User
        {
            SteamId = steamId,
            TradeUrl = tradeUrl
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
            user.TradeUrl = tradeUrl;
            await _context.SaveChangesAsync();
        }
    }
}