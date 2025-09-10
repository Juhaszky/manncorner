using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly CommentService _commentService;
    public CommentController(CommentService commentService)
    {
        _commentService = commentService;
    }
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost]
    async public Task<ActionResult<Comment>> MakeComment([FromBody] CommentRequest request)
    {
        string userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? parentId = request.ParentId ?? null;
        if (userId == null) return Unauthorized();

        var comment = await _commentService.MakeComment(request.TradeId, request.CommentData, userId, parentId, request.ItemsOffer);
        return Ok(comment);
    }
}