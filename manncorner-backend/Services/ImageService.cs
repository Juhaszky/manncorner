using System.Net.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;

public class ImageService
{
    private readonly HttpClient _httpClient;

    public ImageService()
    {
        _httpClient = new HttpClient();
    }
    public async Task<byte[]> ConvertToWebpAsync(string imageUrl)
    {
        var imageBytes = await _httpClient.GetByteArrayAsync(imageUrl);

        using var inputStream = new MemoryStream(imageBytes);
        using var image = await Image.LoadAsync(inputStream);

        image.Mutate(x => x.Resize(128, 128)); 

        using var outputStream = new MemoryStream();
        await image.SaveAsync(outputStream, new WebpEncoder { Quality = 75 });

        return outputStream.ToArray();
    }
}