using Microsoft.EntityFrameworkCore;

namespace ReactNPC.Models
{
    /// <summary>
    /// Provides connnnection with database
    /// </summary>
    public class UserDbContext : DbContext
    {
        /// <summary>
        /// Constructs a new context instance
        /// </summary>
        /// <param name="options">Carries all the required configuration information</param>
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// Represents the collection of entities
        /// </summary>
        public DbSet<User> User { get; set; }

        /// <summary>
        /// Sets connection string
        /// </summary>
        /// <param name="optionsBuiler">Provides an API surface for configuring DbContextOptions.</param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuiler)
        {
            string directory = Directory.GetParent(Environment.CurrentDirectory).Parent.FullName;
            optionsBuiler.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB; AttachDbFilename = "+directory+"\\Data\\UsersDatabase.mdf; TrustServerCertificate=True");
        }
    }
}
