package com.thiepCuoi.api.v1.controller;

import com.thiepCuoi.model.dto.TemplateDTO;
import com.thiepCuoi.service.TemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/templates")
@Tag(name = "Mẫu thiệp", description = "API quản lý mẫu thiệp cưới")
public class TemplateController {
    
    @Autowired
    private TemplateService templateService;
    
    @Operation(summary = "Lấy danh sách tất cả mẫu thiệp đang hoạt động")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công")
    })
    @GetMapping
    public ResponseEntity<List<TemplateDTO>> getAllActiveTemplates() {
        List<TemplateDTO> templates = templateService.getAllActiveTemplates();
        return ResponseEntity.ok(templates);
    }
    
    @Operation(summary = "Lấy mẫu thiệp theo danh mục")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công")
    })
    @GetMapping("/danh_muc/{categoryId}")
    public ResponseEntity<List<TemplateDTO>> getTemplatesByCategory(
            @Parameter(description = "ID của danh mục") @PathVariable Long categoryId) {
        List<TemplateDTO> templates = templateService.getTemplatesByCategory(categoryId);
        return ResponseEntity.ok(templates);
    }
    
    @Operation(summary = "Tìm kiếm mẫu thiệp theo từ khóa")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tìm kiếm thành công")
    })
    @GetMapping("/tim_kiem")
    public ResponseEntity<List<TemplateDTO>> searchTemplates(
            @Parameter(description = "Từ khóa tìm kiếm") @RequestParam String keyword) {
        List<TemplateDTO> templates = templateService.searchTemplates(keyword);
        return ResponseEntity.ok(templates);
    }
    
    @Operation(summary = "Lấy thông tin mẫu thiệp theo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy mẫu thiệp")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TemplateDTO> getTemplateById(
            @Parameter(description = "ID của mẫu thiệp") @PathVariable Long id) {
        TemplateDTO template = templateService.getTemplateById(id);
        return ResponseEntity.ok(template);
    }
    
    @Operation(summary = "Tạo mẫu thiệp mới")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tạo mẫu thiệp thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TemplateDTO> createTemplate(@Valid @RequestBody TemplateDTO templateDTO) {
        TemplateDTO createdTemplate = templateService.createTemplate(templateDTO);
        return ResponseEntity.ok(createdTemplate);
    }
    
    @Operation(summary = "Cập nhật mẫu thiệp")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy mẫu thiệp")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TemplateDTO> updateTemplate(
            @Parameter(description = "ID của mẫu thiệp") @PathVariable Long id,
            @Valid @RequestBody TemplateDTO templateDTO) {
        TemplateDTO updatedTemplate = templateService.updateTemplate(id, templateDTO);
        return ResponseEntity.ok(updatedTemplate);
    }
    
    @Operation(summary = "Xóa mẫu thiệp (đánh dấu không hoạt động)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Xóa thành công"),
        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy mẫu thiệp")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTemplate(
            @Parameter(description = "ID của mẫu thiệp") @PathVariable Long id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.ok().build();
    }
}