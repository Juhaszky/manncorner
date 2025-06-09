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
  public async Task<IActionResult> GetUserItems()
  {
    var filePath = Path.Combine(_env.ContentRootPath, "Mock", "clean-assets.json");

    if (!System.IO.File.Exists(filePath))
      return NotFound("Mock asset file not found.");

    var json = await System.IO.File.ReadAllTextAsync(filePath);

    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
    var items = JsonSerializer.Deserialize<object>(json, options);
    

    return Ok(items);
  }
}
