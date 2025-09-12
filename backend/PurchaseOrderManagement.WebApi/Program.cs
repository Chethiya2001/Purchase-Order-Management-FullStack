using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PurchaseOrderManagement.Application.Interfaces;
using PurchaseOrderManagement.Infrastructure.Persistence;
using PurchaseOrderManagement.Infrastructure.Repositories;
using PurchaseOrderManagement.WebApi.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


// Add DbContext with MySQL
builder.Services.AddDbContext<AppDbContext>(op =>
{
    op.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 29)));
    op.EnableSensitiveDataLogging();

});

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ApiResponseWrapperFilter>();
});
builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ReportApiVersions = true;
});

builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
