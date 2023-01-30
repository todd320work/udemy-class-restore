using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Dapper;

namespace API.Interfaces.repository
{
    public class BasketRepository : IBasketRepository
    {
        private readonly DapperContext _context;
        
        public BasketRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<Basket> GetBasket( int basketID )
        {
            var query = " SELECT B.BasketID, B.BuyerID, bi.*, p.*  " +
                        " FROM Baskets B "+
                        "    JOIN BasketItem  bi ON bi.BasketID = B.BasketID " +
                        "    JOIN Products p on p.Id = bi.ProductID " +
                        " WHERE bi.BasketId = @basketId";

            //Basket returnBasket = new();

            using (var connection = _context.CreateConnection())
            { 
                // query async like this means, we need a mapping function
                // to take a Basket, BI, Product, and return a Basket.
                var records = await connection.QueryAsync<Basket, BasketItem, Product, Basket> 
                            (
                                // This a query that MUST return 
                                // Basket data, followed by BasketItem data followed by
                                // product data all in teh Select * list. 
                                // We "split" the results into basket/basketItem/Product 
                                // by using the KeyWord splitOn: with a list of 
                                // fields, to do the splitting.  So, we have to be really 
                                // precise when doing this, an dwe cannot have duplicate names, 
                                // which woul dprobably trip up, the field mapping.
                                query, 
                                (bask, baskItem, prod) 
                                    => { 
                                            // Set the product...
                                            baskItem.Product = prod; 
                                            // Add the item to the Basket
                                            bask.Items.Add(baskItem); 
                                            return bask; 
                                        },
                                new { basketID },
                                // This tells us where, in the params above, to split the 3
                                // objects which are returned. the Id here is the ProductID
                                // from the p.* above...
                                splitOn: "BasketItemId, Id" 
                            );
                // Now group this by the basket record...
                var result = records.GroupBy( b => b.BasketId ).Select( g => 
                    {
                        var basket = g.First();
                        basket.Items = g.Select( b1 => b1.Items.Single()).ToList();
                        return basket;
                    });
                
                return result.First();
            }
        }
        public async Task<Basket> GetBasketByBuyer( string buyerID )
        {
            var query = " SELECT B.BasketID, B.BuyerID, bi.*, p.*  " +
                        " FROM Baskets B "+
                        "    JOIN BasketItem  bi ON bi.BasketID = B.BasketID " +
                        "    JOIN Products p on p.Id = bi.ProductID " +
                        " WHERE b.BuyerID = @buyerId";

            //Basket returnBasket = new();

            using (var connection = _context.CreateConnection())
            { 
                // query async like this means, we need a mapping function
                // to take a Basket, BI, Product, and return a Basket.
                var records = await connection.QueryAsync<Basket, BasketItem, Product, Basket> 
                            (
                                // This a query that MUST return 
                                // Basket data, followed by BasketItem data followed by
                                // product data all in teh Select * list. 
                                // We "split" the results into basket/basketItem/Product 
                                // by using the KeyWord splitOn: with a list of 
                                // fields, to do the splitting.  So, we have to be really 
                                // precise when doing this, an dwe cannot have duplicate names, 
                                // which woul dprobably trip up, the field mapping.
                                query, 
                                (bask, baskItem, prod) 
                                    => { 
                                            // Set the product...
                                            baskItem.Product = prod; 
                                            // Add the item to the Basket
                                            bask.Items.Add(baskItem); 
                                            return bask; 
                                        },
                                new { buyerID },
                                // This tells us where, in the params above, to split the 3
                                // objects which are returned. the Id here is the ProductID
                                // from the p.* above...
                                splitOn: "BasketItemId, Id" 
                            );

                // If we don't have a basket yet, return null
                if( records == null || records.Count<Basket>() == 0)
                    return null;

                // Now group this by the basket record...
                var result = records.GroupBy( b => b.BasketId ).Select( g => 
                    {
                        var basket = g.First();
                        basket.Items = g.Select( b1 => b1.Items.Single()).ToList();
                        return basket;
                    });
                
                return result.First();
            }
                       
        }
    
        // Use Add Item to either add a new product to the basket, or to increase the quantity of one we already have in it. 
        public async Task<Basket> AddItem( Basket b, Product prod, int quant)
        {
            // IF all of the items in the basket don't match the product we are adding, then we need to add a new basket item.
            if( b.Items.All(item => item.ProductId != prod.Id))
            {
                b.Items.Add( new BasketItem{Product = prod, Quantity = quant});
                await AddItemToBasket( b.BasketId, prod.Id, quant);
            }
            else
            {
                // find the existing item and increase its quantity by what we just added to the basket.
                var existingProd = b.Items.FirstOrDefault(item => item.ProductId == prod.Id);
                existingProd.Quantity += quant;
                await ChangeQuantity(existingProd.BasketItemId, quant );
            }

            return b;
        }
        public async Task RemoveItem( Basket basket, int prodId, int quantity )
        {
            var existingProd = basket.Items.FirstOrDefault(item => item.ProductId == prodId);
            if( existingProd == null )
            {
                throw new Exception("Product not in Basket");
            }
            existingProd.Quantity -= quantity;
            if( existingProd.Quantity <= 0 )
            {
                // delete the basketItem
                await DeleteBasketItem( existingProd.BasketItemId );
            }
            else
            {
                // update the basket Item, subtract the quantity...
                await ChangeQuantity( existingProd.BasketItemId, -quantity );
            }
        }

        private async Task DeleteBasketItem( int basketItemId )
        {
            var query = "Delete BasketItem where BasketItemID = @BasketItemID";
            var param = new DynamicParameters();
            param.Add("BasketItemId", basketItemId, System.Data.DbType.Int32);

            using( var conn = _context.CreateConnection())
            {
                await conn.ExecuteAsync(query, param);
            }

        }
        // Method to add an item to a basket that is not already there. 
        private async Task AddItemToBasket( int basketID, int productID, int quantity)
        {
            var query = "INSERT INTO BasketItem (BasketID, ProductID, Quantity) " + 
                        "    Values (@BasketID, @ProductID, @Quantity)";

            var param = new DynamicParameters();
            param.Add("BasketID", basketID, System.Data.DbType.Int32);
            param.Add("ProductID", productID, System.Data.DbType.Int32);
            param.Add("Quantity", quantity, System.Data.DbType.Int32);

            using( var conn = _context.CreateConnection())
            {
                await conn.ExecuteAsync(query, param);
            }   

        }

        // method to increase quantity of an existing item 
        private async Task ChangeQuantity( int basketItemId, int quantityToAdd) 
        {
            var query = "UPDATE BasketItem SET Quantity = Quantity + @QuantityToAdd " +
                        " WHERE BasketItemID = @BasketItemID";
            var param = new DynamicParameters();
            param.Add("BasketItemID", basketItemId, System.Data.DbType.Int32);
            param.Add("QuantityToAdd", quantityToAdd, System.Data.DbType.Int32);

            using( var conn = _context.CreateConnection())
            {
                await conn.ExecuteAsync(query, param);
            }   

        }



        public async Task<Product> GetProduct( int id )
        {
            var query = "dbo.up_products_selectbyID";

            using( var conn = _context.CreateConnection())
            {
                var product = await conn.QuerySingleOrDefaultAsync<Product>(query, new { id }, null, null, System.Data.CommandType.StoredProcedure);
                return product;
            }
        }

        public async Task<Basket> AddBasket( string buyerID )
        {
            var query = "INSERT INTO Baskets (BuyerID) Values (@BuyerID) " + 
                        " Select Cast(Scope_Identity() as int)";

            var param = new DynamicParameters();
            param.Add("BuyerID", buyerID, System.Data.DbType.String);
            using( var conn = _context.CreateConnection())
            {
                // Insert the record and get the BasketID back...
                var id = await conn.QuerySingleAsync<int>(query, param);
                var basket = new Basket
                {
                    BasketId = id,
                    BuyerId = buyerID
                };
                return basket;
            }
        }
    
    }
}