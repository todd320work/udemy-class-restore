using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class ProductsController : BaseApiController 
    {
        private readonly StoreContext _context;
        public ProductsController( StoreContext context )
        {
           this._context = context; 
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct( int id )
        {
            // GEt the product by the ID.
            var product = await _context.Products.FindAsync(id);

            // Return not found when we could not find a product with the id passed in
            if( product == null) 
                return NotFound();
                
            return product;

        }
    }
        
    
}