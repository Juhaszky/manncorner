public interface ITradeService
{
    Task<Trade> GetTradeByIdAsync(int tradeId);
    Task<IEnumerable<Trade>> GetAllTradesAsync();
    Task<Trade> CreateTradeAsync(Trade trade);
    Task MakeTrade(Item itemToTrade, Item itemForTrade);
}