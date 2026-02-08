using Microsoft.EntityFrameworkCore;
using WrestlingPredictions.Server.Src.Domain.Entities;

namespace WrestlingPredictions.Server
{
    public class WPDbContext : DbContext
    {
        public WPDbContext(DbContextOptions<WPDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Team> Teams { get; set; }
        //public DbSet<Prediction> Predictions { get; set; }
    }
}
