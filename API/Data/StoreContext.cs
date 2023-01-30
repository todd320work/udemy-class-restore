
using Microsoft.EntityFrameworkCore;
using API.Entities;

namespace API.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
            // Any options??
        }

        public DbSet<Product> Products {get; set;}

        public DbSet<Basket> Baskets {get; set;}
    }
}