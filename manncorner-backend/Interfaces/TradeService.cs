public interface ITradeService
{
    Task<Trade> GetTradeByIdAsync(int tradeId);
    Task<object> GetAllTradesAsync(int page, int pageSize);
    Task<Trade> BumpTrade(string userId, int tradeId);
    Task<Trade> CreateTradeAsync(Trade trade);
    Task<List<Trade>> GetAllTradesByUserAsync(string userId);
}