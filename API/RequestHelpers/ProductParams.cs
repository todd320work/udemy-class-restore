using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelpers
{
    public class ProductParams
    {
        public string OrderBy { get; set; }
        public string SearchTerm { get; set; }
        public string Types { get; set; }
        public string Brands { get; set; }
        public int PageNumber { get; set; }
        public int RowCount { get; set; }
        public ProductParams()
        {
            PageNumber = 0;
            RowCount = 5;
        }
    }

    
}