package com.thiepCuoi.api.v1.controller;

import com.thiepCuoi.model.dto.*;
import com.thiepCuoi.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Xác thực", description = "API quản lý đăng nhập và đăng ký")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Operation(summary = "Đăng nhập")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Đăng nhập thành công"),
        @ApiResponse(responseCode = "401", description = "Thông tin đăng nhập không chính xác")
    })
    @PostMapping("/dang_nhap")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        AuthResponseDTO response = authService.login(loginDTO);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Đăng ký tài khoản mới")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Đăng ký thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc tài khoản đã tồn tại")
    })
    @PostMapping("/dang_ky")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterDTO registerDTO) {
        UserResponseDTO response = authService.register(registerDTO);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Lấy thông tin người dùng hiện tại")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @GetMapping("/thong_tin_ca_nhan")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {
        UserResponseDTO response = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(response);
    }
}