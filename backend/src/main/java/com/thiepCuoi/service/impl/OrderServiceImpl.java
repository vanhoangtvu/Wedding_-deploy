package com.thiepCuoi.service.impl;

import com.thiepCuoi.model.dto.OrderDTO;
import com.thiepCuoi.model.dto.OrderItemDTO;
import com.thiepCuoi.repository.CustomInvitationRepository;
import com.thiepCuoi.repository.OrderRepository;
import com.thiepCuoi.repository.UserRepository;
import com.thiepCuoi.repository.entity.CustomInvitation;
import com.thiepCuoi.repository.entity.Order;
import com.thiepCuoi.repository.entity.OrderItem;
import com.thiepCuoi.repository.entity.User;
import com.thiepCuoi.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CustomInvitationRepository customInvitationRepository;
    
    @Override
    @Transactional
    public OrderDTO createOrder(String username, OrderDTO orderDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        // Tạo mã đơn hàng
        String orderCode = generateOrderCode();
        
        Order order = new Order();
        order.setUser(user);
        order.setOrderCode(orderCode);
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setPhone(orderDTO.getPhone());
        order.setNotes(orderDTO.getNotes());
        order.setStatus(Order.OrderStatus.PENDING);
        
        // Tính tổng tiền và tạo order items
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (OrderItemDTO itemDTO : orderDTO.getOrderItems()) {
            CustomInvitation invitation = customInvitationRepository.findById(itemDTO.getCustomInvitationId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thiệp tùy chỉnh"));
            
            // Kiểm tra quyền sở hữu
            if (!invitation.getUser().getUsername().equals(username)) {
                throw new RuntimeException("Không có quyền đặt hàng thiệp này");
            }
            
            BigDecimal unitPrice = invitation.getTemplate().getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setCustomInvitation(invitation);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setSubtotal(subtotal);
            
            order.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(subtotal);
        }
        
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);
        
        return convertToDTO(savedOrder);
    }
    
    @Override
    public List<OrderDTO> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        return orderRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public OrderDTO getOrderById(Long id, String username) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
        if (!order.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Không có quyền xem đơn hàng này");
        }
        
        return convertToDTO(order);
    }
    
    @Override
    public OrderDTO getOrderByCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
        return convertToDTO(order);
    }
    
    @Override
    public OrderDTO updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }
    
    @Override
    public List<OrderDTO> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private String generateOrderCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "TC" + timestamp;
    }
    
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderCode(order.getOrderCode());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPhone(order.getPhone());
        dto.setNotes(order.getNotes());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().name());
        
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());
        dto.setOrderItems(itemDTOs);
        
        return dto;
    }
    
    private OrderItemDTO convertItemToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setCustomInvitationId(item.getCustomInvitation().getId());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setSubtotal(item.getSubtotal());
        dto.setGroomName(item.getCustomInvitation().getGroomName());
        dto.setBrideName(item.getCustomInvitation().getBrideName());
        dto.setTemplateName(item.getCustomInvitation().getTemplate().getName());
        return dto;
    }
    
    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}