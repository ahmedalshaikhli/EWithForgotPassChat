using System.ComponentModel.DataAnnotations;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order()
        {
        }
        public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail, Address shipToAddress, 
            DeliveryMethod deliveryMethod, decimal subtotal,string paymentMethod, string paymentIntentId = null)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
            PaymentMethod = paymentMethod;
            PaymentIntentId = paymentIntentId;
        }

        public string BuyerEmail { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        [Required]
        public Address ShipToAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public string PaymentMethod { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string PaymentIntentId { get; set; }

        public decimal GetTotal()
        {
            return Subtotal + DeliveryMethod.Price;
        }
    }
}