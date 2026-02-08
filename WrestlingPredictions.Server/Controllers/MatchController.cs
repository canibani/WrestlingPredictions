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
            .ThenInclude(t => t.Participant)
            .ToListAsync();

        return Ok(matches);
    }

    // POST /Match?wrestler1=A&wrestler2=B
    [HttpPost]
    public async Task<ActionResult<Guid>> Add(List<Team> teams)
    {

        foreach (Team team in teams) 
        {
            foreach (Participant p in team.Participant) {
                if (string.IsNullOrWhiteSpace(p.Name))
                {
                    return BadRequest("Both wrestlers are required.");
                }
            }
        }

        var match = new Match
        {
            Teams = teams
        };

        _context.Matches.Add(match);
        await _context.SaveChangesAsync();

        // return the match ID so the client can act on it
        return CreatedAtAction(nameof(Get), new { id = match.Id }, match.Id);
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

        if (match.Winner is not null)
            return Conflict("Winner has already been set.");

        match.Winner = winnerTeam;

        await _context.SaveChangesAsync();
        return Ok();
    }
}