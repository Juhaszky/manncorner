using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Trade> Trades { get; set; }
    public DbSet<TradeItem> Items { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Item>()
            .HasIndex(i => i.Effect)
            .HasDatabaseName("idx_items_effect");
        modelBuilder.Entity<Item>()
            .HasIndex(i => i.Defindex)
            .HasDatabaseName("idx_items_defindex");
        modelBuilder.Entity<TradeItem>()
            .HasIndex(i => i.IsSelling)
            .HasDatabaseName("idx_items_isSelling");
            
        modelBuilder.Entity<Trade>()
            .HasMany(t => t.Comments)
            .WithOne(c => c.Trade)
            .HasForeignKey(c => c.TradeId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Owner)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Trade)
            .WithMany(t => t.Comments)
            .HasForeignKey(c => c.TradeId);
        modelBuilder.Entity<Comment>()
            .HasMany(c => c.Replies)
            .WithOne()
            .HasForeignKey("ParentCommentId");
        
    }
}
