using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WrestlingPredictions.Server;
using WrestlingPredictions.Server.Src.Domain.Entities;

[ApiController]
[Route("api/[controller]")]
public class MatchController : ControllerBase
{
    private readonly WPDbContext _context;

    public MatchController(WPDbContext context)
    {
        _context = context;
    }

    // GET /Match
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Match>>> Get()
    {
        var matches = await _context.Matches
            .Include(m => m.Teams)
            .ThenInclude(t => t.Participants)
            .ToListAsync();

        return Ok(matches);
    }

    // PUT /Match/{matchId}/winner/{winnerTeamId}
    [HttpPut("{matchId}/winner/{winnerTeamId}")]
    public async Task<IActionResult> SetWinnerAsync(Guid matchId, Guid winnerTeamId)
    {
        var match = await _context.Matches
            .Include(m => m.Teams)
            .FirstOrDefaultAsync(m => m.Id == matchId);

        if (match is null)
            return NotFound("Match not found.");

        var winnerTeam = match.Teams
            .FirstOrDefault(t => t.Id == winnerTeamId);

        if (winnerTeam is null)
            return BadRequest("Team does not belong to this match.");

        //if (match.Winner is not null)
        //    return Conflict("Winner has already been set.");

        //match.Winner = winnerTeam;

        await _context.SaveChangesAsync();
        return Ok();
    }
}