package com.thiepCuoi.api.v1.controller;

import com.thiepCuoi.model.dto.OrderDTO;
import com.thiepCuoi.repository.entity.Order;
import com.thiepCuoi.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Đơn hàng", description = "API quản lý đơn hàng thiệp cưới")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Operation(summary = "Tạo đơn hàng mới")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tạo đơn hàng thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(
            @Valid @RequestBody OrderDTO orderDTO,
            Authentication authentication) {
        OrderDTO createdOrder = orderService.createOrder(authentication.getName(), orderDTO);
        return ResponseEntity.ok(createdOrder);
    }
    
    @Operation(summary = "Lấy danh sách đơn hàng của người dùng")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getUserOrders(Authentication authentication) {
        List<OrderDTO> orders = orderService.getUserOrders(authentication.getName());
        return ResponseEntity.ok(orders);
    }
    
    @Operation(summary = "Lấy thông tin đơn hàng theo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn hàng")
    })
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(
            @Parameter(description = "ID của đơn hàng") @PathVariable Long id,
            Authentication authentication) {
        OrderDTO order = orderService.getOrderById(id, authentication.getName());
        return ResponseEntity.ok(order);
    }
    
    @Operation(summary = "Tra cứu đơn hàng theo mã")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tra cứu thành công"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn hàng")
    })
    @GetMapping("/ma_don_hang/{orderCode}")
    public ResponseEntity<OrderDTO> getOrderByCode(
            @Parameter(description = "Mã đơn hàng") @PathVariable String orderCode) {
        OrderDTO order = orderService.getOrderByCode(orderCode);
        return ResponseEntity.ok(order);
    }
    
    @Operation(summary = "Cập nhật trạng thái đơn hàng")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
        @ApiResponse(responseCode = "400", description = "Trạng thái không hợp lệ"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn hàng")
    })
    @PutMapping("/{id}/trang_thai")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @Parameter(description = "ID của đơn hàng") @PathVariable Long id,
            @Parameter(description = "Trạng thái mới") @RequestParam Order.OrderStatus status) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
    
    @Operation(summary = "Lấy danh sách đơn hàng theo trạng thái")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    @GetMapping("/theo_trang_thai")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(
            @Parameter(description = "Trạng thái đơn hàng") @RequestParam Order.OrderStatus status) {
        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    
    @Operation(summary = "Lấy tất cả đơn hàng (Admin)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách đơn hàng thành công"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
}