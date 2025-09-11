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

            modelBuilder.Entity<PurchaseOrder>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.PONumber).IsUnique(); 

                entity.Property(e => e.TotalAmount)
                      .HasColumnType("decimal(18,2)");
            });
        }

        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    }
}