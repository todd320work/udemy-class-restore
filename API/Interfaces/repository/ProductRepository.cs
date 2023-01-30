using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Dapper;


namespace API.Interfaces.repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly DapperContext _context;
        public ProductRepository(DapperContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Product>> GetProducts()
        {
            var proc = "dbo.up_products_select";

            using( var conn = _context.CreateConnection())
            {
                var products = await conn.QueryAsync<Product>(proc, null, null, null, System.Data.CommandType.StoredProcedure);
                return products.ToList();
            }
        }
        public async Task<Product> GetProduct( int id )
        {
            var query = "dbo.up_products_selectbyID";

            using( var conn = _context.CreateConnection())
            {
                var product = await conn.QuerySingleAsync<Product>(query, new { id }, null, null, System.Data.CommandType.StoredProcedure);
                return product;
            }
        }
    }
}