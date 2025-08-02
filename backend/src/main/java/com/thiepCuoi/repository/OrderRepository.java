package com.thiepCuoi.repository;

import com.thiepCuoi.repository.entity.Order;
import com.thiepCuoi.repository.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUser_Id(Long userId);
    Optional<Order> findByOrderCode(String orderCode);
    List<Order> findByStatusOrderByCreatedAtDesc(Order.OrderStatus status);
}