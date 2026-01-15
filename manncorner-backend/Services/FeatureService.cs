using Microsoft.EntityFrameworkCore;

public class FeatureService : IFeatureService
{
    private readonly AppDbContext _context;
    public FeatureService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<Feature>> getAllFeaturesAsync()
    {
        var featureList = await _context.Features.ToListAsync();
        return featureList;
    } 
}