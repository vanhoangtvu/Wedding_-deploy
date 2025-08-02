package com.thiepCuoi.api.v1.controller;

import com.thiepCuoi.model.dto.CustomizedCardDTO;
import com.thiepCuoi.model.dto.RenderTemplateRequestDTO;
import com.thiepCuoi.service.CustomizedCardService;
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
@RequestMapping("/api/v1/customized-cards")
@Tag(name = "Thiệp tùy chỉnh HTML", description = "API tạo và quản lý thiệp đã render HTML")
public class CustomizedCardController {
    
    @Autowired
    private CustomizedCardService customizedCardService;
    
    @Operation(summary = "Render template HTML với dữ liệu tùy chỉnh")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Render thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @PostMapping("/render")
    public ResponseEntity<CustomizedCardDTO> renderTemplate(
            @Valid @RequestBody RenderTemplateRequestDTO request,
            Authentication authentication) {
        CustomizedCardDTO customizedCard = customizedCardService.renderTemplate(request, authentication.getName());
        return ResponseEntity.ok(customizedCard);
    }
    
    @Operation(summary = "Lấy danh sách thiệp tùy chỉnh của người dùng")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @GetMapping
    public ResponseEntity<List<CustomizedCardDTO>> getUserCustomizedCards(Authentication authentication) {
        List<CustomizedCardDTO> customizedCards = customizedCardService.getUserCustomizedCards(authentication.getName());
        return ResponseEntity.ok(customizedCards);
    }
    
    @Operation(summary = "Lấy danh sách thiệp đã lưu của người dùng")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @GetMapping("/saved")
    public ResponseEntity<List<CustomizedCardDTO>> getUserSavedCards(Authentication authentication) {
        List<CustomizedCardDTO> savedCards = customizedCardService.getUserSavedCards(authentication.getName());
        return ResponseEntity.ok(savedCards);
    }
    
    @Operation(summary = "Lấy thông tin thiệp tùy chỉnh theo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy thiệp")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CustomizedCardDTO> getCustomizedCardById(
            @Parameter(description = "ID của thiệp tùy chỉnh") @PathVariable Long id,
            Authentication authentication) {
        CustomizedCardDTO customizedCard = customizedCardService.getCustomizedCardById(id, authentication.getName());
        return ResponseEntity.ok(customizedCard);
    }
    
    @Operation(summary = "Lưu thiệp tùy chỉnh")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lưu thiệp thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy thiệp")
    })
    @PutMapping("/{id}/save")
    public ResponseEntity<CustomizedCardDTO> saveCustomizedCard(
            @Parameter(description = "ID của thiệp tùy chỉnh") @PathVariable Long id,
            Authentication authentication) {
        CustomizedCardDTO savedCard = customizedCardService.saveCustomizedCard(id, authentication.getName());
        return ResponseEntity.ok(savedCard);
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
    public ResponseEntity<CustomizedCardDTO> updateCustomizedCard(
            @Parameter(description = "ID của thiệp tùy chỉnh") @PathVariable Long id,
            @Valid @RequestBody RenderTemplateRequestDTO request,
            Authentication authentication) {
        CustomizedCardDTO updatedCard = customizedCardService.updateCustomizedCard(id, request, authentication.getName());
        return ResponseEntity.ok(updatedCard);
    }
    
    @Operation(summary = "Xóa thiệp tùy chỉnh")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Xóa thành công"),
        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy thiệp")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomizedCard(
            @Parameter(description = "ID của thiệp tùy chỉnh") @PathVariable Long id,
            Authentication authentication) {
        customizedCardService.deleteCustomizedCard(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}