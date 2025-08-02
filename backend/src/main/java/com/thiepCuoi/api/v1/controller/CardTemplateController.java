package com.thiepCuoi.api.v1.controller;

import com.thiepCuoi.model.dto.CardTemplateDTO;
import com.thiepCuoi.service.CardTemplateService;
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
@RequestMapping("/api/v1/card-templates")
@Tag(name = "Mẫu thiệp HTML", description = "API quản lý mẫu thiệp HTML cho Admin")
public class CardTemplateController {
    
    @Autowired
    private CardTemplateService cardTemplateService;
    
    @Operation(summary = "Lấy tất cả mẫu thiệp HTML đang hoạt động")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công")
    })
    @GetMapping
    public ResponseEntity<List<CardTemplateDTO>> getAllActiveCardTemplates() {
        List<CardTemplateDTO> cardTemplates = cardTemplateService.getAllActiveCardTemplates();
        return ResponseEntity.ok(cardTemplates);
    }
    
    @Operation(summary = "Lấy mẫu thiệp HTML theo template ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công")
    })
    @GetMapping("/template/{templateId}")
    public ResponseEntity<List<CardTemplateDTO>> getCardTemplatesByTemplateId(
            @Parameter(description = "ID của template") @PathVariable Long templateId) {
        List<CardTemplateDTO> cardTemplates = cardTemplateService.getCardTemplatesByTemplateId(templateId);
        return ResponseEntity.ok(cardTemplates);
    }
    
    @Operation(summary = "Lấy mẫu thiệp HTML theo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy mẫu thiệp HTML")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CardTemplateDTO> getCardTemplateById(
            @Parameter(description = "ID của mẫu thiệp HTML") @PathVariable Long id) {
        CardTemplateDTO cardTemplate = cardTemplateService.getCardTemplateById(id);
        return ResponseEntity.ok(cardTemplate);
    }
    
    @Operation(summary = "Tạo mẫu thiệp HTML mới")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tạo mẫu thiệp HTML thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CardTemplateDTO> createCardTemplate(
            @Valid @RequestBody CardTemplateDTO cardTemplateDTO,
            Authentication authentication) {
        CardTemplateDTO createdCardTemplate = cardTemplateService.createCardTemplate(cardTemplateDTO, authentication.getName());
        return ResponseEntity.ok(createdCardTemplate);
    }
    
    @Operation(summary = "Cập nhật mẫu thiệp HTML")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy mẫu thiệp HTML")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CardTemplateDTO> updateCardTemplate(
            @Parameter(description = "ID của mẫu thiệp HTML") @PathVariable Long id,
            @Valid @RequestBody CardTemplateDTO cardTemplateDTO,
            Authentication authentication) {
        CardTemplateDTO updatedCardTemplate = cardTemplateService.updateCardTemplate(id, cardTemplateDTO, authentication.getName());
        return ResponseEntity.ok(updatedCardTemplate);
    }
    
    @Operation(summary = "Xóa mẫu thiệp HTML")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Xóa thành công"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy mẫu thiệp HTML")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCardTemplate(
            @Parameter(description = "ID của mẫu thiệp HTML") @PathVariable Long id,
            Authentication authentication) {
        cardTemplateService.deleteCardTemplate(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "Lấy mẫu thiệp HTML do tôi tạo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    @GetMapping("/my-templates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CardTemplateDTO>> getMyCardTemplates(Authentication authentication) {
        List<CardTemplateDTO> cardTemplates = cardTemplateService.getCardTemplatesByCreator(authentication.getName());
        return ResponseEntity.ok(cardTemplates);
    }
}