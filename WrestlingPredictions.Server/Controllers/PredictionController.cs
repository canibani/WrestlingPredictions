using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WrestlingPredictions.Server.DTOs;
using WrestlingPredictions.Server.DTOs.Authentication;
using WrestlingPredictions.Server.Src.Domain.Entities;

namespace WrestlingPredictions.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PredictionController : ControllerBase
    {
        private readonly WPDbContext _context;

        public PredictionController(WPDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<bool>> SavePredictions([FromBody] List<MatchWithPredictionDto> dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var userGuid = Guid.Parse(userId);

            foreach (var matchDto in dto)
            {
                if (!matchDto.UserPredictionTeamId.HasValue)
                    continue; // skip if user didn't select a team

                // Check if prediction exists
                var existing = await _context.Predictions
                    .FirstOrDefaultAsync(p => p.MatchId == matchDto.MatchId && p.UserId == userGuid);

                if (existing != null)
                {
                    // Update
                    existing.TeamId = matchDto.UserPredictionTeamId.Value;
                    _context.Predictions.Update(existing);
                }
                else
                {
                    // Create
                    var newPrediction = new Prediction
                    {
                        Id = Guid.NewGuid(),
                        MatchId = matchDto.MatchId,
                        UserId = userGuid,
                        TeamId = matchDto.UserPredictionTeamId.Value
                    };
                    await _context.Predictions.AddAsync(newPrediction);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Predictions saved successfully." });
        }
    }
}
