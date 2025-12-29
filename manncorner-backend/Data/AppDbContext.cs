using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Trade> Trades { get; set; }
    public DbSet<StrangeItemStatHistory> CountersHistory { get; set; }
    public DbSet<TradeItem> Items { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<FavouriteItem> FavouriteItems { get; set; }
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
        modelBuilder.Entity<TradeItem>()
            .HasIndex(i => i.Killstreak)
            .HasDatabaseName("idx_items_killstreak");
        modelBuilder.Entity<TradeItem>()
            .HasIndex(i => i.Killstreaker)
            .HasDatabaseName("idx_items_killstreaker");
        modelBuilder.Entity<TradeItem>()
            .HasIndex(i => i.Sheen)
            .HasDatabaseName("idx_items_sheen");

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
        modelBuilder.Entity<StrangeItemStatHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ItemId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Counter).IsRequired();
            entity.HasIndex(e => e.ItemId).HasDatabaseName("IX_StrangeItemStat_ParsedItemId");
        });
        modelBuilder.Entity<CounterEntry>(entity =>
        {
            entity.HasNoKey();
        });
        modelBuilder.Entity<FavouriteItem>(entity =>
        {
            entity.HasOne(e => e.OwnerUser)
              .WithMany(u => u.FavoriteItems)
              .HasForeignKey(e => e.OwnerUserId)
              .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.OwnerUserId, e.Defindex });
        });



    }
}
