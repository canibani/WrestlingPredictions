using WrestlingPredictions.Server.Src.Domain.Entities;

namespace WrestlingPredictions.Server.DTOs
{
    public class MatchDto
    {

        public List<TeamDto> Teams { get; set; } = [];
    }
}
