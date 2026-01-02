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

    public async Task CreateUserAsync(string steamId, string tradeUrl, string username, string avatarPath)
    {
        var user = new User
        {
            SteamId = steamId,
            Username = username,
            avatarPath = avatarPath,
            TradeUrl = null
        };
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }
    public async Task<User?> GetUserBySteamIdAsync(string steamId)
    {
        return await _context.Users.Include(u => u.FavoriteItems).FirstOrDefaultAsync(u => u.SteamId == steamId);
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
    public async Task<FavouriteItem[]> SetFavoriteItemsAsync(string steamId, Item[] items)
    {
        var user = await GetUserBySteamIdAsync(steamId);
        if (user == null)
        {
            throw new InvalidOperationException($"User with Steam ID '{steamId}' not found.");
        }
        user.FavoriteItems.Clear();
        var addedFavorites = new List<FavouriteItem>();
        foreach (var item in items)
        {
            var favoriteItem = new FavouriteItem
            {
                Name = item.Name,
                FullName = item.FullName,
                Id = item.Id,
                Img = item.Img,
                Craftable = item.Craftable,
                Tradable = item.Tradable,
                IsAustralium = item.IsAustralium,
                Type = item.Type,
                Effect = item.Effect,
                Quality = item.Quality,
                Quantity = item.Quantity,
                Killstreak = item.Killstreak,
                Killstreaker = item.Killstreaker,
                Sheen = item.Sheen,
                Defindex = item.Defindex,
                Marketable = item.Marketable,
                Commodity = item.Commodity,
                Level = item.Level,
                paint = item.paint,
                paintDefindex = item.paintDefindex,
                Classes = item.Classes != null ? new List<string>(item.Classes) : null,
                Parts = item.Parts != null ? new List<string>(item.Parts) : null,
                Spells = item.Spells != null ? new List<string>(item.Spells) : null,

                OwnerUserId = user.Id,
                OwnerUser = user
            };
            user.FavoriteItems.Add(favoriteItem);
            addedFavorites.Add(favoriteItem);
        }

        await _context.SaveChangesAsync();
        return addedFavorites.ToArray(); 
    }

    public async Task<List<FavouriteItem>> GetFavoritesAsync(string steamId)
    {
        var user = await _context.Users
            .Include(u => u.FavoriteItems)
            .FirstOrDefaultAsync(u => u.SteamId == steamId);

        if (user == null)
        {
            throw new InvalidOperationException($"User with Steam ID '{steamId}' not found.");
        }

        return user.FavoriteItems?.ToList() ?? new List<FavouriteItem>();
    }
}