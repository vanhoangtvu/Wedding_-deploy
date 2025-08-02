package com.thiepCuoi.repository;

import com.thiepCuoi.repository.entity.OrderItem;
import com.thiepCuoi.repository.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
    List<OrderItem> findByOrder_Id(Long orderId);
}