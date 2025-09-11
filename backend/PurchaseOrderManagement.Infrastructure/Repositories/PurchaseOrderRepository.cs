using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PurchaseOrderManagement.Application.Interfaces;
using PurchaseOrderManagement.Domain.Entities;
using PurchaseOrderManagement.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PurchaseOrderManagement.Infrastructure.Repositories
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<PurchaseOrderRepository> _logger;

        public PurchaseOrderRepository(AppDbContext dbContext, ILogger<PurchaseOrderRepository> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<PurchaseOrder> AddAsync(PurchaseOrder po)
        {
            try
            {
                await _dbContext.PurchaseOrders.AddAsync(po);
                await _dbContext.SaveChangesAsync();
                return po;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding purchase order {@PurchaseOrder}", po);
                throw;
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var entity = await _dbContext.PurchaseOrders.FindAsync(id)
                             ?? throw new KeyNotFoundException($"PurchaseOrder with ID {id} not found.");
                _dbContext.PurchaseOrders.Remove(entity);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting purchase order ID {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAllAsync()
        {
            return await _dbContext.PurchaseOrders.ToListAsync();
        }

        public async Task<PurchaseOrder?> GetByIdAsync(int id)
        {
            return await _dbContext.PurchaseOrders.FindAsync(id);
        }

        public async Task<PurchaseOrder> UpdateAsync(PurchaseOrder po)
        {
            try
            {
                var entity = await _dbContext.PurchaseOrders.FindAsync(po.Id)
                             ?? throw new KeyNotFoundException($"PurchaseOrder with ID {po.Id} not found.");

                entity.PONumber = po.PONumber;
                entity.Description = po.Description;
                entity.SupplierName = po.SupplierName;
                entity.OrderDate = po.OrderDate;
                entity.TotalAmount = po.TotalAmount;
                entity.Status = po.Status;

                _dbContext.PurchaseOrders.Update(entity);
                await _dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating purchase order {@PurchaseOrder}", po);
                throw;
            }
        }
    }
}
