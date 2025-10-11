using System.Security.Claims;
using System.Text;
using AspNet.Security.OpenId.Steam;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.AspNetCore;
using Serilog.Sinks.File;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("Logs/app-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();
builder.Services.AddControllers().AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();
var configuration = builder.Configuration;
builder.Services.AddAuthentication(options =>
{
  options.DefaultScheme = "Cookies";
  options.DefaultChallengeScheme = SteamAuthenticationDefaults.AuthenticationScheme; ;

})
.AddCookie("Cookies")
.AddSteam(options =>
{
  options.Events.OnAuthenticated = context =>
  {
    var url = context.Identity?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var steamId = new Uri(url).Segments.Last();
    if (!string.IsNullOrEmpty(steamId))
    {

      context.Identity?.AddClaim(new Claim("steamId", steamId));
    }
    return Task.CompletedTask;
  };
  options.SignInScheme = "Cookies";

}).AddJwtBearer(options =>
{
  var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]);
  options.Events = new JwtBearerEvents
  {
    OnMessageReceived = context =>
    {
      var accessToken = context.Request.Cookies["accessToken"];
      if (!string.IsNullOrEmpty(accessToken))
      {
        context.Token = accessToken;
      }
      return Task.CompletedTask;
    },
    OnAuthenticationFailed = context =>
    {
      Console.WriteLine("Authentication failed: " + context.Exception.Message);
      return Task.CompletedTask;
    },
    OnTokenValidated = context =>
    {
      Console.WriteLine("Token validated successfully.");
      return Task.CompletedTask;
    },
    OnChallenge = context =>
    {
      Console.WriteLine("JWT challenge: " + context.Error + " - " + context.ErrorDescription);
      return Task.CompletedTask;
    }
  };
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = configuration["Jwt:Issuer"],
    ValidAudience = configuration["Jwt:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(key),
    ClockSkew = TimeSpan.Zero
  };
});

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAll", policy =>
  {
    policy
          .WithOrigins("http://localhost:4200")
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
  });
});
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ExpService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ImageService>();
builder.Services.AddScoped<SteamApiService>();
builder.Services.AddScoped<ITradeService, TradeService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddSingleton<ILoggerService, LoggerService>();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
  app.UseSwagger();
  app.UseSwaggerUI();
}
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
  var forecast = Enumerable.Range(1, 5).Select(index =>
      new WeatherForecast
      (
          DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
          Random.Shared.Next(-20, 55),
          summaries[Random.Shared.Next(summaries.Length)]
      ))
      .ToArray();
  return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
  public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
