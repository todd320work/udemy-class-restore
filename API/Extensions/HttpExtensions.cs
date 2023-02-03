using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationData pageData)
        {
            const string PaginationHeader = "ReStorePagination";
            var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            response.Headers.Add(PaginationHeader, JsonSerializer.Serialize(pageData, options));
            response.Headers.Add("Access-Control-Expose-Headers", PaginationHeader);
        }
    }
}