namespace WrestlingPredictions.Server.DTOs.CreateMatches
{
    public class CreateMatchDto
    {
        public string MatchName { get; set; } = "";
        public List<CreateTeamDto> Teams { get; set; } = [];
    }
}
