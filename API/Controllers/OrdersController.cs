using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _mapper = mapper;
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();

            var address = _mapper.Map<AddressDto, Address>(orderDto.ShipToAddress);

            var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address, orderDto.PaymentMethod);

            if (order == null) return BadRequest(new ApiResponse(400, "Problem creating order"));

            return Ok(order);
        }
/*      [HttpGet("all")]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrders()
        {
            var orders = await _orderService.GetOrdersAsync();
            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        } */
 

[HttpGet("allorders")]
public async Task<ActionResult<IEnumerable<OrderToReturnDto>>> GetOrdersAllUsers(int pageIndex = 0, int pageSize = 10, string searchTerm = "")
{
    var orders = await _orderService.GetOrdersAsync();

    // Apply search filter if a search term is provided
    if (!string.IsNullOrEmpty(searchTerm))
    {
        if (DateTime.TryParse(searchTerm, out var searchDate))
        {
            orders = orders.Where(o => o.BuyerEmail.Contains(searchTerm) || o.OrderDate.Date == searchDate.Date).ToList();
        }
        else
        {
            orders = orders.Where(o => o.BuyerEmail.Contains(searchTerm)).ToList();
        }
    }

    var totalCount = orders.Count;
    var pagedOrders = orders.Skip(pageIndex * pageSize).Take(pageSize).ToList();

    var orderDtos = _mapper.Map<List<OrderToReturnDto>>(pagedOrders);

    return Ok(new { orders = orderDtos, totalCount, totalPages = (int)Math.Ceiling((double)totalCount / pageSize) });
}

//https://localhost:5001/api/orders/email/admin@test.com
        [HttpGet("email/{email}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByEmailForUser(string email)
        {
            

            var order = await _orderService.GetOrderByEmailAsync(email);

            if (order == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<OrderToReturnDto>(order);
        }
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser()
        {
            var email = User.RetrieveEmailFromPrincipal();

            var orders = await _orderService.GetOrdersForUserAsync(email);

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {
            var email = User.RetrieveEmailFromPrincipal();

            var order = await _orderService.GetOrderByIdAsync(id, email);

            if (order == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<OrderToReturnDto>(order);
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }
    }
}