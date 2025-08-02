package com.thiepCuoi.service.impl;

import com.thiepCuoi.model.dto.TemplateDTO;
import com.thiepCuoi.repository.CategoryRepository;
import com.thiepCuoi.repository.TemplateRepository;
import com.thiepCuoi.repository.entity.Category;
import com.thiepCuoi.repository.entity.Template;
import com.thiepCuoi.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateServiceImpl implements TemplateService {
    
    @Autowired
    private TemplateRepository templateRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Override
    public List<TemplateDTO> getAllActiveTemplates() {
        return templateRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TemplateDTO> getTemplatesByCategory(Long categoryId) {
        return templateRepository.findByCategory_IdAndIsActiveTrue(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TemplateDTO> searchTemplates(String keyword) {
        return templateRepository.searchByKeyword(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public TemplateDTO getTemplateById(Long id) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiệp"));
        return convertToDTO(template);
    }
    
    @Override
    public TemplateDTO createTemplate(TemplateDTO templateDTO) {
        Category category = categoryRepository.findById(templateDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
        
        Template template = new Template();
        template.setName(templateDTO.getName());
        template.setDescription(templateDTO.getDescription());
        template.setCategory(category);
        template.setImageUrl(templateDTO.getImageUrl());
        template.setPreviewUrl(templateDTO.getPreviewUrl());
        template.setPrice(templateDTO.getPrice());
        template.setIsActive(true);
        
        Template savedTemplate = templateRepository.save(template);
        return convertToDTO(savedTemplate);
    }
    
    @Override
    public TemplateDTO updateTemplate(Long id, TemplateDTO templateDTO) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiệp"));
        
        Category category = categoryRepository.findById(templateDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
        
        template.setName(templateDTO.getName());
        template.setDescription(templateDTO.getDescription());
        template.setCategory(category);
        template.setImageUrl(templateDTO.getImageUrl());
        template.setPreviewUrl(templateDTO.getPreviewUrl());
        template.setPrice(templateDTO.getPrice());
        template.setIsActive(templateDTO.getIsActive());
        
        Template updatedTemplate = templateRepository.save(template);
        return convertToDTO(updatedTemplate);
    }
    
    @Override
    public void deleteTemplate(Long id) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiệp"));
        template.setIsActive(false);
        templateRepository.save(template);
    }
    
    private TemplateDTO convertToDTO(Template template) {
        TemplateDTO dto = new TemplateDTO();
        dto.setId(template.getId());
        dto.setName(template.getName());
        dto.setDescription(template.getDescription());
        dto.setCategoryId(template.getCategory().getId());
        dto.setCategoryName(template.getCategory().getName());
        dto.setImageUrl(template.getImageUrl());
        dto.setPreviewUrl(template.getPreviewUrl());
        dto.setPrice(template.getPrice());
        dto.setIsActive(template.getIsActive());
        return dto;
    }
}