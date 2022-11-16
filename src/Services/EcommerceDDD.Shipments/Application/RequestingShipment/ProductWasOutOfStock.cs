﻿using EcommerceDDD.Core.EventBus;

namespace EcommerceDDD.Shipments.Application.RequestingShipment;

public class ProductWasOutOfStock : IntegrationEvent
{
    public Guid OrderId { get; private set; }
    public DateTime CheckedAt { get; private set; }

    public ProductWasOutOfStock(Guid orderId)
    {
        OrderId = orderId;
        CheckedAt = DateTime.UtcNow;
    }
}