using Microsoft.EntityFrameworkCore;
using ILS.Domain.Entities;

namespace ILS.Infrastructure.Data
{
    public class FloravaDbContext : DbContext
    {
        public FloravaDbContext(DbContextOptions<FloravaDbContext> options) : base(options)
        {
        }

        public DbSet<AdminAccount> AdminAccounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AdminAccount>(entity =>
            {
                entity.ToTable("ADMIN_ACCOUNTS");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Salt).IsRequired();
            });
        }
    }
}
