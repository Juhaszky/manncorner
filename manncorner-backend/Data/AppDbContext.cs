using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Tf2ItemSchema> schemaItems { get; set; }
    public DbSet<Trade> Trades { get; set; }
    public DbSet<TradeItem> Items { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tf2ItemSchema>()
         .HasKey(x => x.Defindex);


        modelBuilder.Entity<Tf2ItemSchema>()
            .HasMany(x => x.Styles)
            .WithOne(s => s.Tf2ItemSchema)
            .HasForeignKey(s => s.Tf2ItemSchemaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Tf2ItemSchema>()
            .HasMany(x => x.Attributes)
            .WithOne(a => a.Tf2ItemSchema)
            .HasForeignKey(a => a.Tf2ItemSchemaId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Tf2ItemSchema>().ToTable("Tf2ItemSchemas");

        modelBuilder.Entity<ParsedItem>()
    .Property(e => e.classes)
    .HasColumnType("text[]");

        modelBuilder.Entity<ParsedItem>()
            .Property(e => e.parts)
            .HasColumnType("text[]");

        modelBuilder.Entity<ParsedItem>()
            .Property(e => e.spells)
            .HasColumnType("text[]");
    }
    // public DbSet<Item> Items { get; set; }
    // public DbSet<Trade> Trades { get; set; }
}
