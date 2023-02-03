using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
        public PaginationData PageData { get; set; }
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            PageData = new PaginationData
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling((decimal)count / (decimal) pageSize),
            };
            // Add all of the items passed in to this list. 
            this.AddRange(items);

        }

        //public static PagedList<T> ToPagedList( <sometype of dapper object> )

        

    }

}