using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class Tf2SchemaItemService : ITf2SChemaItemService
{
    private readonly AppDbContext _db;

    public Tf2SchemaItemService(AppDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<Tf2ItemSchema>> GetAllSchemaItemsAsync()
    {
        return await _db.schemaItems
               .Include(i => i.Styles)
               .Include(i => i.Attributes)
               .ToListAsync();

    }

    public async Task<Tf2ItemSchema?> GetByDefindexAsync(int defindex)
    {
        return await _db.schemaItems
            .Include(i => i.Styles)
            .Include(i => i.Attributes)
            .FirstOrDefaultAsync(i => i.Defindex == defindex);
    }
}
