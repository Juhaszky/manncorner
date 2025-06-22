using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class Tf2SchemaItemsController : ControllerBase
{
    private readonly Tf2SchemaItemService _service;
    private readonly AppDbContext _db;

    public Tf2SchemaItemsController(AppDbContext db, Tf2SchemaItemService service)
    {
        _service = service;
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tf2ItemSchema>>> GetAllSchemaItems()
    {
        var items = await this._service.GetAllSchemaItemsAsync();
        return Ok(items);
    }
    [HttpGet("{defindex}")]
    public async Task<ActionResult<Tf2ItemSchema>> GetByDefindex(int defindex)
    {
        var item = await _service.GetByDefindexAsync(defindex);
        if (item == null) return NotFound();
        return Ok(item);
    }
}
