using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Tf2ItemSchema> schemaItems { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tf2ItemSchema>().ToTable("Tf2ItemSchemas");
    }
    // public DbSet<Item> Items { get; set; }
    // public DbSet<Trade> Trades { get; set; }
}
