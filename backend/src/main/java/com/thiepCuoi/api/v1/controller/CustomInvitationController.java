package com.thiepCuoi.api.v1.controller;

import com.thiepCuoi.model.dto.CustomInvitationDTO;
import com.thiepCuoi.service.CustomInvitationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/custom-invitations")
@Tag(name = "Thiệp tùy chỉnh", description = "API quản lý thiệp cưới tùy chỉnh")
public class CustomInvitationController {
    
    @Autowired
    private CustomInvitationService customInvitationService;
    
    @Operation(summary = "Tạo thiệp tùy chỉnh mới")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tạo thiệp thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @PostMapping
    public ResponseEntity<CustomInvitationDTO> createCustomInvitation(
            @Valid @RequestBody CustomInvitationDTO invitationDTO,
            Authentication authentication) {
        CustomInvitationDTO createdInvitation = customInvitationService
                .createCustomInvitation(authentication.getName(), invitationDTO);
        return ResponseEntity.ok(createdInvitation);
    }
    
    @Operation(summary = "Lấy danh sách thiệp tùy chỉnh của người dùng")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @GetMapping
    public ResponseEntity<List<CustomInvitationDTO>> getUserInvitations(Authentication authentication) {
        List<CustomInvitationDTO> invitations = customInvitationService
                .getUserInvitations(authentication.getName());
        return ResponseEntity.ok(invitations);
    }
    
    @Operation(summary = "Lấy danh sách thiệp đã lưu của người dùng")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @GetMapping("/da_luu")
    public ResponseEntity<List<CustomInvitationDTO>> getUserSavedInvitations(Authentication authentication) {
        List<CustomInvitationDTO> invitations = customInvitationService
                .getUserSavedInvitations(authentication.getName());
        return ResponseEntity.ok(invitations);
    }
    
    @Operation(summary = "Lấy thông tin thiệp tùy chỉnh theo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy thiệp")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CustomInvitationDTO> getCustomInvitationById(
            @Parameter(description = "ID của thiệp tùy chỉnh") @PathVariable Long id,
            Authentication authentication) {
        CustomInvitationDTO invitation = customInvitationService
                .getCustomInvitationById(id, authentication.getName());
        return ResponseEntity.ok(invitation);
    }
    
    @Operation(summary = "Cập nhật thiệp tùy chỉnh")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy thiệp")
    })
    @PutMapping("/{id}")
    public ResponseEntity<CustomInvitationDTO> updateCustomInvitation(
            @Parameter(description = "ID của thiệp tùy chỉnh") @PathVariable Long id,
            @Valid @RequestBody CustomInvitationDTO invitationDTO,
            Authentication authentication) {
        CustomInvitationDTO updatedInvitation = customInvitationService
                .updateCustomInvitation(id, invitationDTO, authentication.getName());
        return ResponseEntity.ok(updatedInvitation);
    }
    
    @Operation(summary = "Lưu thiệp tùy chỉnh")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lưu thiệp thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy thiệp")
    })
    @PutMapping("/{id}/luu")
    public ResponseEntity<CustomInvitationDTO> saveCustomInvitation(
            @Parameter(description = "ID của thiệp tùy chỉnh") @PathVariable Long id,
            Authentication authentication) {
        CustomInvitationDTO savedInvitation = customInvitationService
                .saveCustomInvitation(id, authentication.getName());
        return ResponseEntity.ok(savedInvitation);
    }
    
    @Operation(summary = "Xóa thiệp tùy chỉnh")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Xóa thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy thiệp")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomInvitation(
            @Parameter(description = "ID của thiệp tùy chỉnh") @PathVariable Long id,
            Authentication authentication) {
        customInvitationService.deleteCustomInvitation(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}