public class LoggerService : ILoggerService
{
    private readonly ILogger _logger;
    public LoggerService(ILogger<LoggerService> logger)
    {
        _logger = logger;
    }
    public void LogInformation(string message, params object[] args)
    {
        _logger.LogInformation(message, args);
    }
    public void LogWarning(string message, params object[] args)
    {
        _logger.LogWarning(message, args);
    }
    public void LogError(string message, Exception ex = null)
    {
        _logger.LogError(ex, message);
    }
}