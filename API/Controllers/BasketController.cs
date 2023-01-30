using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _repo;   
        private const string buyerIDCookie = "buyerID";

        public BasketController(IBasketRepository repo)
        {
            _repo = repo;
        }


        [HttpGet(Name = "GetBasket")]
        public async Task<IActionResult> GetBasketByBuyer()
        {
            try 
            {
                var basket = await _repo.GetBasketByBuyer( Request.Cookies[buyerIDCookie] );
                return Ok(basket);
            }
            catch( Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        
        }

        [HttpPost] // api/basket?productID=3&quantity=4 ...
        public async Task<ActionResult<Basket>> AddItemToBasket( int productId, int quantity )
        {
            var basket = await _repo.GetBasketByBuyer( Request.Cookies[buyerIDCookie]);
            if( basket == null ) basket = await CreateBasket();
            var product = await _repo.GetProduct( productId );
            // GetProduct should be a BADREquest if we can't find it, 
            // should never happen.
            if( product == null ) return BadRequest(new ProblemDetails{Title = "product Not found"});

            try 
            {
                Basket b = await _repo.AddItem( basket, product, quantity );
                return CreatedAtRoute( "GetBasket", b );
            }
            catch(Exception ex)
            {
                return BadRequest(new ProblemDetails{Title = $"Error adding item to basket, {ex.Message}"});
            }
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem( int productId, int quantity )
        {
            var basket = await _repo.GetBasketByBuyer( Request.Cookies[buyerIDCookie]);
            if( basket == null ) return NotFound();
            try 
            {
                await _repo.RemoveItem(basket, productId, quantity);
            }
            catch( Exception ex )
            {
                return BadRequest(new ProblemDetails{Title = $"Error removing item from basket, {ex.Message}"});
            }
            return Ok();
        }

        private async Task<Basket> CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append(buyerIDCookie, buyerId, cookieOptions);
            // Now, add this basket to the DB.
            var basket = await _repo.AddBasket( buyerId );
            return basket;

        }

        
    }
}