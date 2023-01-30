using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int BasketId { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();


        

        public void DeleteItem( int productId, int quantity )
        {
            var item = Items.FirstOrDefault( item => item.ProductId == productId);
            if( item == null ) return; // Bad day...
            item.Quantity -= quantity;
            // If the quantity is zero, just remove it entirely
            // Note, some stores will leave the 0 quantity in the basket, to make it easy 
            if( item.Quantity <= 0)
            {
                Items.Remove(item);
            }

        }
    }
}