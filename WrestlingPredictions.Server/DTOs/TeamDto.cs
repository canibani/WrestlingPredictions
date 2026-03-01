using WrestlingPredictions.Server.Src.Domain.Entities;

namespace WrestlingPredictions.Server.DTOs
{
    public class TeamDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public List<string> Participants { get; set; } = [];
    }
}
