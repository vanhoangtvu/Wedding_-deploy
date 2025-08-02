package com.thiepCuoi.service;

import com.thiepCuoi.model.dto.TemplateDTO;
import java.util.List;

public interface TemplateService {
    List<TemplateDTO> getAllActiveTemplates();
    List<TemplateDTO> getTemplatesByCategory(Long categoryId);
    List<TemplateDTO> searchTemplates(String keyword);
    TemplateDTO getTemplateById(Long id);
    TemplateDTO createTemplate(TemplateDTO templateDTO);
    TemplateDTO updateTemplate(Long id, TemplateDTO templateDTO);
    void deleteTemplate(Long id);
}