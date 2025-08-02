package com.thiepCuoi.api.v1.controller;

import com.thiepCuoi.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Người dùng", description = "API quản lý thông tin người dùng")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Operation(summary = "Lấy số lượng người dùng (Admin)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy số lượng thành công"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getUserCount() {
        Long count = userService.getUserCount();
        return ResponseEntity.ok(count);
    }
}