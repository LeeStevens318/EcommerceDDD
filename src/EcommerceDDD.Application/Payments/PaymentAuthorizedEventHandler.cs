﻿using MediatR;
using System.Threading;
using System.Threading.Tasks;
using EcommerceDDD.Domain.Payments.Events;
using System.IO;
using EcommerceDDD.Domain;
using System.Linq;
using EcommerceDDD.Domain.Orders;

namespace EcommerceDDD.Application.Orders.PlaceOrder
{
    public class PaymentAuthorizedEventHandler : INotificationHandler<PaymentAuthorizedEvent>
    {
        private readonly IEcommerceUnitOfWork _unitOfWork;
        private readonly IOrderStatusWorkflow _orderStatusWorkflow;
        private readonly IOrderStatusBroadcaster _orderStatusBroadcaster;

        public PaymentAuthorizedEventHandler(
            IEcommerceUnitOfWork unitOfWork,
            IOrderStatusWorkflow orderStatusWorkflow,
            IOrderStatusBroadcaster orderStatusBroadcaster)
        {
            _unitOfWork = unitOfWork;
            _orderStatusWorkflow = orderStatusWorkflow;
            _orderStatusBroadcaster = orderStatusBroadcaster;
        }

        public async Task Handle(PaymentAuthorizedEvent paymentAuthorizedEvent, 
            CancellationToken cancellationToken)
        {
            var payment = await _unitOfWork.Payments
                .GetById(paymentAuthorizedEvent.PaymentId, cancellationToken);

            var order = await _unitOfWork.Orders
                .GetById(payment.OrderId, cancellationToken);

            if (payment == null)
                throw new InvalidDataException("Payment not found.");

            if (order == null)
                throw new InvalidDataException("Order not found.");

            // Changing order status
            _orderStatusWorkflow.CalculateOrderStatus(order, payment);
            await _unitOfWork.CommitAsync(cancellationToken);

            // Broadcasting order update
            await _orderStatusBroadcaster.BroadcastOrderStatus(
                order.CustomerId, 
                order.Id, 
                order.Status
            );
        }
    }
}