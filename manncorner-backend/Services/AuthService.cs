using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public class AuthService
{
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _dbContext;

    public AuthService(IConfiguration configuration, AppDbContext dbContext)
    {
        _configuration = configuration;
        _dbContext = dbContext;
    }

    public string GenerateJwtToken(string steamId)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
        new Claim(ClaimTypes.NameIdentifier, steamId),
        new Claim("steamId", steamId)
    };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
    public async Task StoreRefreshTokenAsync(string userId, string refreshToken, DateTime expiresAt)
    {
        var hashedToken = HashToken(refreshToken);

        var tokenEntity = new RefreshToken
        {
            UserId = userId,
            TokenHash = hashedToken,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt,
            IsRevoked = false
        };

        _dbContext.RefreshTokens.Add(tokenEntity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<(bool IsValid, string UserId)> ValidateRefreshTokenAsync(string refreshToken)
    {
        var hashedToken = HashToken(refreshToken);
        var tokenEntity = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.TokenHash == hashedToken && !rt.IsRevoked);

        if (tokenEntity == null || tokenEntity.ExpiresAt <= DateTime.UtcNow)
            return (false, null);

        return (true, tokenEntity.UserId);
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken)
    {
        var hashedToken = HashToken(refreshToken);
        var tokenEntity = await _dbContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == hashedToken);
        if (tokenEntity != null)
        {
            tokenEntity.IsRevoked = true;
            await _dbContext.SaveChangesAsync();
        }
    }

    private static string HashToken(string token)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(token);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}