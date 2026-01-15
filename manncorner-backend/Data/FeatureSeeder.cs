using Microsoft.EntityFrameworkCore;

public static class FeatureSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!context.Features.Any())
        {
            var features = new[]
            {
                new Feature { Id = 1, Icon = "pi pi-search", Name = "Advanced TF2 Search", Description = "Filter by paint, quality, australium, killstreak" },
                new Feature { Id = 2, Icon = "pi pi-bell", Name = "Real-time Notifications", Description = "Comment alerts via SignalR" },
                new Feature { Id = 3, Icon = "pi pi-user", Name = "User Profiles", Description = "Steam integration + favorites" },
                new Feature { Id = 4, Icon = "pi pi-comments", Name = "Trade Comments", Description = "Nested replies + notifications" },
                new Feature { Id = 5, Icon = "pi pi-heart", Name = "Follow Trades", Description = "Get notified on your listings" },
                new Feature { Id = 6, Icon = "pi pi-chart-line", Name = "Strange item stat histories", Description = "Follow strange item statistics histories" },
                new Feature { Id = 7, Icon = "pi pi-edit", Name = "Modify Trades", Description = "Customize your trade listings (visibility, notifications, edit)" },
                new Feature { Id = 8, Icon = "pi pi-link", Name = "Backpack.tf integration", Description = "You can open item details on bp.tf with right click on item" },
                new Feature { Id = 9, Icon = "pi pi-shopping-cart", Name = "Trade Creation", Description = "Trading" },
                new Feature { Id = 10, Icon = "pi pi-search", Name = "Item Search", Description = "Inventory" },
                new Feature { Id = 11, Icon = "pi pi-user", Name = "User Profile", Description = "Users" },
            };

            await context.Features.AddRangeAsync(features);
            await context.SaveChangesAsync();
        }
    }
}
