public interface IFeatureService
{
    Task<List<Feature>> getAllFeaturesAsync();
}