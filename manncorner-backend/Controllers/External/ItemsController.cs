using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
public class ItemsController : ControllerBase
{
  private readonly IWebHostEnvironment _env;

  public ItemsController(IWebHostEnvironment env)
  {
    _env = env;
  }

  [HttpGet("/items")]
  public async Task<IActionResult> GetUserItems([FromQuery] int offset = 0, [FromQuery] int limit = 20)
  {
    var filePath = Path.Combine(_env.ContentRootPath, "Mock", "clean-assets.json");

    if (!System.IO.File.Exists(filePath))
      return NotFound("Mock asset file not found.");

    var json = await System.IO.File.ReadAllTextAsync(filePath);

    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
    var items = JsonSerializer.Deserialize<ItemResponse>(json, options);

    if (items == null) return StatusCode(500, "Failed to parse items.");

    var pagedItems = items.Descriptions.Skip(offset).Take(limit).ToList();

    return Ok(pagedItems);
  }
}
