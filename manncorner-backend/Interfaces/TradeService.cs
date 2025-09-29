public interface ITradeService
{
    Task<Trade> GetTradeByIdAsync(int tradeId);
    Task<object> GetAllTradesAsync(int page, int pageSize);
    Task<TradeBumpResult> BumpTrade(string userId, int tradeId);
    Task<Trade> CreateTradeAsync(Trade trade);
    Task<List<Trade>> GetAllTradesByUserAsync(string userId);
    Task<TradeStatusResult> ChangeTradeStatusAsync(int tradeId);
    Task<TradeDeleteResult> DeleteTrade(int tradeId);
    Task<Trade?> UpdateTradeAsync(Trade trade);
    Task<object> SearchTradesAsync(TradeItemSearchCriteria criteria, int page = 1, int pageSize = 50);
}