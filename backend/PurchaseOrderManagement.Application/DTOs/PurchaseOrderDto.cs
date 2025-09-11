using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PurchaseOrderManagement.Domain.Entities;

namespace PurchaseOrderManagement.Application.DTOs
{
    public record PurchaseOrderDto
    {
        public int Id { get; set; }
        public string PONumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
    }
    public record PurchaseOrderCreateDto
    {
        public string PONumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; } = 0;
        public string Status { get; set; } = "Draft";
    }
    public record PurchaseOrderUpdateDto
    {
        public string Description { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; } = 0;
        public string Status { get; set; } = "Draft";
    }
}