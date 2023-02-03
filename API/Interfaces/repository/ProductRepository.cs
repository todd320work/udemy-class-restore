using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.RequestHelpers;
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
        public async Task<PagedList<Product>> GetProducts( ProductParams p )
        {
            var proc = "dbo.up_products_select";

            var param = new DynamicParameters();
            param.Add("orderBy", p.OrderBy, System.Data.DbType.String);
            param.Add("nameSearch", p.SearchTerm, System.Data.DbType.String);
            param.Add("brands", p.Brands, System.Data.DbType.String);
            param.Add("types", p.Types, System.Data.DbType.String);
            param.Add("pageIndex", p.PageNumber, System.Data.DbType.Int32);
            param.Add("rowCount", p.RowCount, System.Data.DbType.Int32);
            
            using( var conn = _context.CreateConnection())
            using( var multi = await conn.QueryMultipleAsync(proc, param, null, null, System.Data.CommandType.StoredProcedure))
            {
                // Our Stored procedure returns the count of total records
                // without pagination, so we can calculate total pages.
                var recordCount = await multi.ReadSingleOrDefaultAsync<int>();

                // followed by the actual paged data (so just rowCount records, typicall
                // much less than the actual recordCount)
                var products = (await multi.ReadAsync<Product>()).ToList();

                var pageList = new PagedList<Product>(products, recordCount, p.PageNumber, p.RowCount);

                return pageList;
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

        public async Task<Object> GetBrands()
        {
            var query = "Select distinct Brand from Products with (nolock)";
            using( var conn = _context.CreateConnection())
            {
                var brands = (await conn.QueryAsync(query));
                return brands;
            }
        }
        public async Task<Object> GetTypes()
        {
            var query = "Select distinct [Type] from Products with (nolock)";
            using( var conn = _context.CreateConnection())
            {
                var typeList = (await conn.QueryAsync(query));
                return typeList;
            }
        }
    }
}