using Microsoft.AspNetCore.Identity;
using WrestlingPredictions.Server.Src.Domain.Entities;

namespace WrestlingPredictions.Server.Src.Domain.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string Username;
    }
}
