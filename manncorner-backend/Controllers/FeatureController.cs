using Microsoft.AspNetCore.Mvc;

public class FeatureController : ControllerBase
{
    private readonly IFeatureService _featureService;

    public FeatureController(IFeatureService featureService)
    {
        _featureService = featureService;
    }

    [HttpGet("features")]
    public async Task<IActionResult> GetAllFeatures()
    {
        var features = await _featureService.getAllFeaturesAsync();
        return Ok(features);
    }
}