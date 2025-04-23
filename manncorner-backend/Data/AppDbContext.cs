using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // Itt adod meg az entitásokat, pl.
    public DbSet<User> Users { get; set; }
    // public DbSet<Item> Items { get; set; }
    // public DbSet<Trade> Trades { get; set; }
}
