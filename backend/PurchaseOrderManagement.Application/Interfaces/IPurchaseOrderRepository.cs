using PurchaseOrderManagement.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PurchaseOrderManagement.Application.Interfaces
{
    public interface IPurchaseOrderRepository
    {
        Task<IEnumerable<PurchaseOrder>> GetAllAsync();
        Task<PurchaseOrder?> GetByIdAsync(int id);
        Task<PurchaseOrder> AddAsync(PurchaseOrder po);      
        Task<PurchaseOrder> UpdateAsync(PurchaseOrder po);   
        Task DeleteAsync(int id);                             
    }
}
