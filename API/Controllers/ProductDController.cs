using System;
using System.Text.Json;
using System.Threading.Tasks;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using API.RequestHelpers;
using API.Entities;
using API.Extensions;

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
        // Attribute [FromQuery] clues the software into the fact the object will come from query parameters and 
        // and posted in the body.
        public async Task<ActionResult<PagedList<Product>>> GetProducts( [FromQuery] ProductParams param )
        {
            try 
            {
                var products = await _prodRepo.GetProducts(param);
                // Add our pagination information to the response headers...
                Response.AddPaginationHeader(products.PageData);

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

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _prodRepo.GetBrands();
            var types = await _prodRepo.GetTypes();

            // Return an anonymous object...
            return Ok( new { brands, types });
        }

    }
}