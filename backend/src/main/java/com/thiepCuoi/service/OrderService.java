package com.thiepCuoi.service;

import com.thiepCuoi.model.dto.OrderDTO;
import com.thiepCuoi.repository.entity.Order;
import java.util.List;

public interface OrderService {
    OrderDTO createOrder(String username, OrderDTO orderDTO);
    List<OrderDTO> getUserOrders(String username);
    OrderDTO getOrderById(Long id, String username);
    OrderDTO getOrderByCode(String orderCode);
    OrderDTO updateOrderStatus(Long id, Order.OrderStatus status);
    List<OrderDTO> getOrdersByStatus(Order.OrderStatus status);
    List<OrderDTO> getAllOrders();
}