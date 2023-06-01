using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(string buyerEmail, int delieveryMethod, string basketId, Address shippingAddress, string PaymentMethod);
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
        Task<Order> GetOrderByIdAsync(int id, string buyerEmail);
        Task<Order> GetOrderByEmailAsync(string buyerEmail);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
       Task<IReadOnlyList<Order>> GetOrdersAsync();
    }
}