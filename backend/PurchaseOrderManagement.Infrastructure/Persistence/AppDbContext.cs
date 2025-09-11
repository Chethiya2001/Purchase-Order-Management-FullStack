using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PurchaseOrderManagement.Domain.Entities;

namespace PurchaseOrderManagement.Infrastructure.Persistence
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
       protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure PurchaseOrder entity
            modelBuilder.Entity<PurchaseOrder>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Unique constraint on PONumber
                entity.HasIndex(e => e.PONumber).IsUnique();

                // Decimal precision
                entity.Property(e => e.TotalAmount)
                      .HasColumnType("decimal(18,2)");
                      
                // Enum to string conversion for Status
                entity.Property(e => e.Status)
                      .HasConversion<string>();
            });
        }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    }
}