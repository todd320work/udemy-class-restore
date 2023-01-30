using System;
using System.Threading.Tasks;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductDController : BaseApiController
    {
        private readonly IProductRepository _prodRepo;   

        public ProductDController(IProductRepository repo)
        {
            _prodRepo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            try 
            {
                var products = await _prodRepo.GetProducts();
                return Ok(products);
            }
            catch( Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct( int id )
        {
            try 
            {
                var product = await _prodRepo.GetProduct(id);
                return Ok(product);
            }
            catch( Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        
        }

    }
}