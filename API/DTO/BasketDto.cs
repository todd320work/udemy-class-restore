using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class BasketDto
    {
        public int BasketId { get; set; }
        public string BuyerID { get; set; }
        public List<BasketItemDto> Items { get; set; }
    }
}