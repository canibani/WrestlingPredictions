using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using WrestlingPredictions.Server.DTOs;
using WrestlingPredictions.Server.Src.Domain.Entities;

namespace WrestlingPredictions.Server.Controllers
{
    [Route("api/[controller]")]
    //[Authorize]
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
        public async Task<ActionResult<IEnumerable<Event>>> GetAllEvents()
        {
            var eventEntities = await _context.Events
                //.Include(e => e.Matches)
                //    .ThenInclude(m => m.Teams)
                //        .ThenInclude(t => t.Participants)
                .ToListAsync();

            return Ok(eventEntities);
        }

        // GET: api/events/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EventDto>> GetEventById(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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
        public async Task<ActionResult<Event>> CreateEvent([FromBody] Event newEvent)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _context.Events.AddAsync(newEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetEventById),
                new { id = newEvent.Id },
                newEvent
            );
        }

        [HttpPost("{eventId}/matches")]
        public async Task<ActionResult> AddMatch(Guid eventId, CreateMatchDto dto)
        {
            var eventEntity = await _context.Events
                .Include(e => e.Matches)
                    .ThenInclude(m => m.Teams)
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventEntity == null)
                return NotFound("Event not found");

            if (dto.Matches == null || !dto.Matches.Any())
                return BadRequest("No matches provided");

            var matches = dto.Matches.Select(matchDto => new Match
            {
                Teams = matchDto.Teams.Select(teamDto => new Team
                {
                    // TODO: Check
                    Participants = teamDto.Participants.Select(p => new Participant
                    {
                        Name = p
                    }).ToList()
                }).ToList()
            }).ToList();

            foreach (var match in matches)
            {
                eventEntity.Matches.Add(match);
            }

            await _context.SaveChangesAsync();

            return Ok(matches);
        }
    }
}