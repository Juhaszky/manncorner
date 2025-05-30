using Microsoft.AspNetCore.Mvc;

public class ImageController : ControllerBase
{
    private readonly ImageService _imageService;
    public ImageController(ImageService imageService)
    {
        _imageService = imageService;
    }
    [HttpGet("convert-img")]
    public async Task<IActionResult> ConvertUrlToWebp(string imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl))
        {
            return BadRequest("Image URL is required");
        }

        try
        {
            var webpImage = await _imageService.ConvertToWebpAsync(imageUrl);
            return File(webpImage, "image/webp", "converted.webp");
        }
        catch (Exception ex)
        {
            return BadRequest($"Failed to process image: {ex.Message}");
        }
    }
}