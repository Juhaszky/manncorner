public class ExpService
{
    private readonly AppDbContext _context;
    private readonly UserService _userService;

    public ExpService(AppDbContext context, UserService userService)
    {
        _context = context;
        _userService = userService;
    }
    public async Task increaseExp(int amount, string steamId)
    {
        var user = await _userService.GetUserBySteamIdAsync(steamId);
        if (user != null)
        {
            user.XP += amount;
            await _context.SaveChangesAsync();
        }
    }
}