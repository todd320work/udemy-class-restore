using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface IBasketRepository
    {
        public Task<Basket> GetBasket( int basketID );
        public Task<Basket> GetBasketByBuyer( string buyerID );

        public Task<Basket> AddItem( Basket b, Product prod, int quant);

        // method to remove an item from a basket
        public Task RemoveItem( Basket b, int productID, int quantity);

        public Task<Basket> AddBasket( string buyerID );

        public Task<Product> GetProduct( int id );

    }
}