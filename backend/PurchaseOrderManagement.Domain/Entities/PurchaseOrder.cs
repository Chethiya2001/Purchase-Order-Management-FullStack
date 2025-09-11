using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PurchaseOrderManagement.Domain.Entities
{
    public class PurchaseOrder
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "PO Number is required.")]
        [StringLength(20, ErrorMessage = "PO Number cannot exceed 20 characters.")]
        public string PONumber { get; set; } = string.Empty;

        [StringLength(250, ErrorMessage = "Description cannot exceed 250 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Supplier Name is required.")]
        [StringLength(100, ErrorMessage = "Supplier Name cannot exceed 100 characters.")]
        public string SupplierName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Order Date is required.")]
        public DateTime OrderDate { get; set; } 

        [Required(ErrorMessage = "Total Amount is required.")]
        [Range(0, 100000000, ErrorMessage = "Total Amount must be positive.")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        public POStatus Status { get; set; }
    }
    
}