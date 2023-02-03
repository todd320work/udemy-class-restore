using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.RequestHelpers;

namespace API.Interfaces
{
    public interface IProductRepository
    {
        public Task<PagedList<Product>> GetProducts(ProductParams p);
        public Task<Product> GetProduct( int id );

        public Task<Object> GetBrands();
        public Task<Object> GetTypes();
    }
}