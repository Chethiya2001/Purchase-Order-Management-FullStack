using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PurchaseOrderManagement.Application.DTOs;
using PurchaseOrderManagement.Application.Interfaces;
using PurchaseOrderManagement.Domain.Entities;

namespace PurchaseOrderManagement.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/purchase-orders")]
    public class PurchaseOrdersController(IPurchaseOrderRepository purchaseOrderRepository) : ControllerBase
    {
        private readonly IPurchaseOrderRepository _purchaseOrderRepository = purchaseOrderRepository;

        [HttpGet]
        public async Task<IActionResult> GetAllPurchaseOrders()
        {
            var purchaseOrders = await _purchaseOrderRepository.GetAllAsync();
            return Ok(purchaseOrders);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPurchaseOrderById(int id)
        {
            var purchaseOrder = await _purchaseOrderRepository.GetByIdAsync(id);
            if (purchaseOrder == null)
            {
                return NotFound();
            }
            return Ok(purchaseOrder);
        }
        [HttpPost]
        public async Task<IActionResult> CreatePurchaseOrder([FromBody] PurchaseOrderCreateDto purchaseOrderCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newPurchaseOrder = new PurchaseOrder
            {
                PONumber = purchaseOrderCreateDto.PONumber,
                SupplierName = purchaseOrderCreateDto.SupplierName,
                OrderDate = DateTime.UtcNow,
                Description = purchaseOrderCreateDto.Description,
                TotalAmount = purchaseOrderCreateDto.TotalAmount,
                Status = purchaseOrderCreateDto.Status
            };

            var createdPurchaseOrder = await _purchaseOrderRepository.AddAsync(newPurchaseOrder);
            return CreatedAtAction(nameof(GetPurchaseOrderById), new { id = createdPurchaseOrder.Id }, createdPurchaseOrder);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePurchaseOrder(int id, [FromBody] PurchaseOrderUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingOrder = await _purchaseOrderRepository.GetByIdAsync(id);
            if (existingOrder == null)
            {
                return NotFound();
            }

            existingOrder.Description = updateDto.Description;
            existingOrder.SupplierName = updateDto.SupplierName;
            existingOrder.OrderDate = updateDto.OrderDate;
            existingOrder.TotalAmount = updateDto.TotalAmount;
            existingOrder.Status = updateDto.Status;

            var updatedOrder = await _purchaseOrderRepository.UpdateAsync(existingOrder);
            return Ok(updatedOrder);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePurchaseOrder(int id)
        {
            var existingOrder = await _purchaseOrderRepository.GetByIdAsync(id);
            if (existingOrder == null)
            {
                return NotFound();
            }

            await _purchaseOrderRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}