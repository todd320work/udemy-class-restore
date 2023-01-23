using API.Data;
using API.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });
            // Add the database context for the Store using SQLite...
            services.AddDbContext<StoreContext>(opt => 
            {
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            // Add support for cross origin access
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // The order we place middleware items hwere is the order they are located in the request handler.
        // For example, we want the exception handler at the top, so that it can handle gracefully any exceptions
        // created in code further down the chain.
        // 
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Order is extremely important here in this entire app.
            // ORDER IS IMPORTANT..
            app.UseMiddleware<ExceptionMiddleware>();
            
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            // add in the cross site access
            app.UseCors( opt => {
                // AllowAnyOrigin is required if the request is coming from any other user's PC/etc.
                // For DEV work, using .WithOrigins("http://todd2015mbp.local:3000") works great, but anything 
                // off the PC is useless...
                opt.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();;
            });

            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
