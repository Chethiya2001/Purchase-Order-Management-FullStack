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
    [Route("api/v{version:apiVersion}/purchase-orders")]
    public class PurchaseOrdersController(IPurchaseOrderRepository purchaseOrderRepository) : ControllerBase
    {
        private readonly IPurchaseOrderRepository _purchaseOrderRepository = purchaseOrderRepository;

        [HttpGet("status")]
        public IActionResult GetStatuses()
        {
            var statuses = Enum.GetNames<POStatus>();
            return Ok(statuses);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPurchaseOrders()
        {
            var purchaseOrders = await _purchaseOrderRepository.GetAllAsync();
            var dtos = purchaseOrders.Select(po => new PurchaseOrderDto
            {
                Id = po.Id,
                PONumber = po.PONumber,
                Description = po.Description,
                SupplierName = po.SupplierName,
                OrderDate = po.OrderDate,
                TotalAmount = po.TotalAmount,
                Status = po.Status.ToString()
            });
            return Ok(dtos);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPurchaseOrderById(int id)
        {
            var purchaseOrder = await _purchaseOrderRepository.GetByIdAsync(id);
            if (purchaseOrder == null)
            {
                return NotFound();
            }
            var dto = new PurchaseOrderDto
            {
                Id = purchaseOrder.Id,
                PONumber = purchaseOrder.PONumber,
                Description = purchaseOrder.Description,
                SupplierName = purchaseOrder.SupplierName,
                OrderDate = purchaseOrder.OrderDate,
                TotalAmount = purchaseOrder.TotalAmount,
                Status = purchaseOrder.Status.ToString()
            };
            return Ok(dto);
        }
        [HttpPost]
        public async Task<IActionResult> CreatePurchaseOrder([FromBody] PurchaseOrderCreateDto purchaseOrderCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!Enum.TryParse<POStatus>(purchaseOrderCreateDto.Status, true, out var status))
            {
                return BadRequest($"Invalid status value: {purchaseOrderCreateDto.Status}");
            }
            var newPurchaseOrder = new PurchaseOrder
            {
                PONumber = purchaseOrderCreateDto.PONumber,
                SupplierName = purchaseOrderCreateDto.SupplierName,
                OrderDate = purchaseOrderCreateDto.OrderDate,
                Description = purchaseOrderCreateDto.Description,
                TotalAmount = purchaseOrderCreateDto.TotalAmount,
                Status = status
            };

            var createdPurchaseOrder = await _purchaseOrderRepository.AddAsync(newPurchaseOrder);
            var dto = new PurchaseOrderDto
            {
                Id = createdPurchaseOrder.Id,
                PONumber = createdPurchaseOrder.PONumber,
                Description = createdPurchaseOrder.Description,
                SupplierName = createdPurchaseOrder.SupplierName,
                OrderDate = createdPurchaseOrder.OrderDate,
                TotalAmount = createdPurchaseOrder.TotalAmount,
                Status = createdPurchaseOrder.Status.ToString()
            };
            return CreatedAtAction(nameof(GetPurchaseOrderById), new { id = dto.Id }, dto);
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
            if (!Enum.TryParse<POStatus>(updateDto.Status, true, out var status))
            {
                return BadRequest($"Invalid status value: {updateDto.Status}");
            }
            existingOrder.Description = updateDto.Description;
            existingOrder.SupplierName = updateDto.SupplierName;
            existingOrder.OrderDate = updateDto.OrderDate;
            existingOrder.TotalAmount = updateDto.TotalAmount;
            existingOrder.Status = status;

            var updatedOrder = await _purchaseOrderRepository.UpdateAsync(existingOrder);
            var dto = new PurchaseOrderDto
            {
                Id = updatedOrder.Id,
                PONumber = updatedOrder.PONumber,
                Description = updatedOrder.Description,
                SupplierName = updatedOrder.SupplierName,
                OrderDate = updatedOrder.OrderDate,
                TotalAmount = updatedOrder.TotalAmount,
                Status = updatedOrder.Status.ToString()
            };
            return Ok(dto);
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