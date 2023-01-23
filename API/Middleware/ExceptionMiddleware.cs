using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env )
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        // This is at the top of the middleware stack, its job
        // is to call the next item in the stack, and just catch any issues which might arise.
        // 
        public async Task InvokeAsync( HttpContext context )
        {
            try
            {
                // just a hack to introduce some wait times...
                System.Threading.Thread.Sleep(500);
                await _next(context);
            }
            catch( Exception ex )
            {
                _logger.LogError( ex, $"Restore handled an error: {ex.Message}");
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                var response = new ProblemDetails
                {
                    Status = 500,
                    Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
                    Title = $"Restored handled error: {ex.Message}",
                };

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}