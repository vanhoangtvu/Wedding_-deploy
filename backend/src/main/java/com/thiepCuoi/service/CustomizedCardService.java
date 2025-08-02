package com.thiepCuoi.service;

import com.thiepCuoi.model.dto.CustomizedCardDTO;
import com.thiepCuoi.model.dto.RenderTemplateRequestDTO;
import java.util.List;

public interface CustomizedCardService {
    CustomizedCardDTO renderTemplate(RenderTemplateRequestDTO request, String username);
    CustomizedCardDTO saveCustomizedCard(Long id, String username);
    List<CustomizedCardDTO> getUserCustomizedCards(String username);
    List<CustomizedCardDTO> getUserSavedCards(String username);
    CustomizedCardDTO getCustomizedCardById(Long id, String username);
    CustomizedCardDTO updateCustomizedCard(Long id, RenderTemplateRequestDTO request, String username);
    void deleteCustomizedCard(Long id, String username);
    
    // Utility methods
    String generatePreviewImage(String htmlContent, String cssContent);
    String generatePdfDocument(String htmlContent, String cssContent);
}