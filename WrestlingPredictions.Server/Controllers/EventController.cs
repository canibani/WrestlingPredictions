using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WrestlingPredictions.Server.DTOs;
using WrestlingPredictions.Server.DTOs.CreateMatches;
using WrestlingPredictions.Server.Src.Domain.Entities;

namespace WrestlingPredictions.Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly WPDbContext _context;

        public EventController(WPDbContext context)
        {
            _context = context;
        }

        // GET: api/events
        [HttpGet]
        [Authorize(Roles = "User, Admin")]
        public async Task<ActionResult<IEnumerable<Event>>> GetAllEvents()
        {
            var eventEntities = await _context.Events
                .ToListAsync();

            return Ok(eventEntities);
        }

        // GET: api/event/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "User, Admin")]
        public async Task<ActionResult<EventDto>> GetEventById(Guid id)
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null)
                return Unauthorized();

            var userGuid = Guid.Parse(userId);

            var eventItem = await _context.Events
                .Where(e => e.Id == id)
                .Select(e => new EventDto
                {
                    EventId = e.Id,
                    Name = e.Name,
                    Matches = e.Matches.Select(m => new MatchWithPredictionDto
                    {
                        MatchId = m.Id,

                        Teams = m.Teams.Select(t => new TeamDto
                        {
                            Id = t.Id,
                            Name = t.TeamName,
                            Participants = t.Participants
                                .Select(p => p.Name)
                                .ToList()
                        }).ToList(),

                        UserPredictionTeamId = _context.Predictions
                            .Where(p => p.MatchId == m.Id && p.UserId == userGuid)
                            .Select(p => (Guid?)p.TeamId)
                            .FirstOrDefault()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (eventItem == null)
                return NotFound(new { message = $"Event with id {id} not found." });

            return Ok(eventItem);
        }

        // POST: api/event
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Event>> CreateEvent([FromBody] CreateEventDto createEventDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Event newEvent = new Event
            {
                Name = createEventDto.Name,
            };

            await _context.Events.AddAsync(newEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetEventById),
                new { id = newEvent.Id },
                newEvent
            );
        }

        [HttpPost("{eventId}/matches")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AddMatch(Guid eventId, [FromBody] List<CreateMatchDto> matches)
        {
            var eventEntity = await _context.Events
                .Include(e => e.Matches)
                    .ThenInclude(m => m.Teams)
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventEntity == null)
                return NotFound("Event not found");

            if (matches == null || !matches.Any())
                return BadRequest("No matches provided");

            var newMatches = matches.Select(matchDto => new Match
            {
                Teams = matchDto.Teams.Select(teamDto => new Team
                {
                    Participants = teamDto.Participants.Select(p => new Participant
                    {
                        Name = p.Name
                    }).ToList()
                }).ToList()
            }).ToList();

            foreach (var match in newMatches)
            {
                eventEntity.Matches.Add(match);
            }

            await _context.SaveChangesAsync();

            return Ok(matches);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            var eVent = await _context.Events.FindAsync(id);

            if (eVent == null)
            {
                return NotFound();
            }

            _context.Events.Remove(eVent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}