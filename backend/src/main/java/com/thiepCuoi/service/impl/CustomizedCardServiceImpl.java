package com.thiepCuoi.service.impl;

import com.thiepCuoi.model.dto.CustomizedCardDTO;
import com.thiepCuoi.model.dto.RenderTemplateRequestDTO;
import com.thiepCuoi.repository.CardTemplateRepository;
import com.thiepCuoi.repository.CustomizedCardRepository;
import com.thiepCuoi.repository.UserRepository;
import com.thiepCuoi.repository.entity.CardTemplate;
import com.thiepCuoi.repository.entity.CustomizedCard;
import com.thiepCuoi.repository.entity.User;
import com.thiepCuoi.service.CustomizedCardService;
import com.thiepCuoi.service.TemplateRenderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CustomizedCardServiceImpl implements CustomizedCardService {
    
    @Autowired
    private CustomizedCardRepository customizedCardRepository;
    
    @Autowired
    private CardTemplateRepository cardTemplateRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TemplateRenderService templateRenderService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public CustomizedCardDTO renderTemplate(RenderTemplateRequestDTO request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        CardTemplate cardTemplate = cardTemplateRepository.findByIdAndIsActiveTrue(request.getCardTemplateId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiệp HTML"));
        
        // Validate template data
        try {
            String customDataJson = objectMapper.writeValueAsString(request.getCustomData());
            
            if (!templateRenderService.validateTemplateData(cardTemplate.getTemplateVariables(), request.getCustomData())) {
                throw new RuntimeException("Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc");
            }
            
            // Render HTML và CSS
            String renderedHtml = templateRenderService.renderHtml(cardTemplate.getHtmlContent(), request.getCustomData());
            String renderedCss = templateRenderService.renderCss(cardTemplate.getCssContent(), request.getCustomData());
            
            // Tạo CustomizedCard entity
            CustomizedCard customizedCard = new CustomizedCard();
            customizedCard.setUser(user);
            customizedCard.setCardTemplate(cardTemplate);
            customizedCard.setTemplate(cardTemplate.getTemplate());
            customizedCard.setRenderedHtml(renderedHtml);
            customizedCard.setRenderedCss(renderedCss);
            customizedCard.setCustomData(customDataJson);
            customizedCard.setIsSaved(request.getSaveCard());
            
            // Save nếu được yêu cầu
            if (request.getSaveCard()) {
                customizedCard = customizedCardRepository.save(customizedCard);
            }
            
            return convertToDTO(customizedCard);
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi render template: " + e.getMessage());
        }
    }
    
    @Override
    public CustomizedCardDTO saveCustomizedCard(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        CustomizedCard customizedCard = customizedCardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiệp tùy chỉnh"));
        
        if (!customizedCard.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Không có quyền lưu thiệp này");
        }
        
        customizedCard.setIsSaved(true);
        customizedCard.setUpdatedAt(LocalDateTime.now());
        
        CustomizedCard savedCard = customizedCardRepository.save(customizedCard);
        return convertToDTO(savedCard);
    }
    
    @Override
    public List<CustomizedCardDTO> getUserCustomizedCards(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        return customizedCardRepository.findByUser_IdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CustomizedCardDTO> getUserSavedCards(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        return customizedCardRepository.findByUser_IdAndIsSavedTrue(user.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public CustomizedCardDTO getCustomizedCardById(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        CustomizedCard customizedCard = customizedCardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiệp tùy chỉnh"));
        
        if (!customizedCard.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Không có quyền xem thiệp này");
        }
        
        return convertToDTO(customizedCard);
    }
    
    @Override
    public CustomizedCardDTO updateCustomizedCard(Long id, RenderTemplateRequestDTO request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        CustomizedCard customizedCard = customizedCardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiệp tùy chỉnh"));
        
        if (!customizedCard.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Không có quyền cập nhật thiệp này");
        }
        
        // Re-render với dữ liệu mới
        try {
            String customDataJson = objectMapper.writeValueAsString(request.getCustomData());
            
            if (!templateRenderService.validateTemplateData(customizedCard.getCardTemplate().getTemplateVariables(), request.getCustomData())) {
                throw new RuntimeException("Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc");
            }
            
            String renderedHtml = templateRenderService.renderHtml(customizedCard.getCardTemplate().getHtmlContent(), request.getCustomData());
            String renderedCss = templateRenderService.renderCss(customizedCard.getCardTemplate().getCssContent(), request.getCustomData());
            
            customizedCard.setRenderedHtml(renderedHtml);
            customizedCard.setRenderedCss(renderedCss);
            customizedCard.setCustomData(customDataJson);
            customizedCard.setUpdatedAt(LocalDateTime.now());
            
            CustomizedCard updatedCard = customizedCardRepository.save(customizedCard);
            return convertToDTO(updatedCard);
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật thiệp: " + e.getMessage());
        }
    }
    
    @Override
    public void deleteCustomizedCard(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        CustomizedCard customizedCard = customizedCardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiệp tùy chỉnh"));
        
        if (!customizedCard.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Không có quyền xóa thiệp này");
        }
        
        customizedCardRepository.delete(customizedCard);
    }
    
    @Override
    public String generatePreviewImage(String htmlContent, String cssContent) {
        // TODO: Implement image generation từ HTML/CSS
        // Có thể dùng libraries như wkhtmltopdf, puppeteer, hay selenium
        // Tạm thời return placeholder
        return "/api/v1/preview/placeholder.jpg";
    }
    
    @Override
    public String generatePdfDocument(String htmlContent, String cssContent) {
        // TODO: Implement PDF generation từ HTML/CSS
        // Có thể dùng libraries như wkhtmltopdf, iText, hay flying-saucer
        // Tạm thời return placeholder
        return "/api/v1/pdf/placeholder.pdf";
    }
    
    private CustomizedCardDTO convertToDTO(CustomizedCard customizedCard) {
        CustomizedCardDTO dto = new CustomizedCardDTO();
        dto.setId(customizedCard.getId());
        dto.setCardTemplateId(customizedCard.getCardTemplate().getId());
        dto.setTemplateId(customizedCard.getTemplate().getId());
        dto.setTemplateName(customizedCard.getTemplate().getName());
        dto.setCardTemplateName(customizedCard.getCardTemplate().getTemplateName());
        dto.setCustomData(customizedCard.getCustomData());
        dto.setRenderedHtml(customizedCard.getRenderedHtml());
        dto.setRenderedCss(customizedCard.getRenderedCss());
        dto.setGeneratedImageUrl(customizedCard.getGeneratedImageUrl());
        dto.setGeneratedPdfUrl(customizedCard.getGeneratedPdfUrl());
        dto.setPreviewUrl(customizedCard.getPreviewUrl());
        dto.setIsSaved(customizedCard.getIsSaved());
        
        // Parse custom data để fill các fields riêng lẻ
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> customDataMap = objectMapper.readValue(customizedCard.getCustomData(), Map.class);
            dto.setGroomName(customDataMap.get("groom_name"));
            dto.setBrideName(customDataMap.get("bride_name"));
            dto.setWeddingDate(customDataMap.get("wedding_date"));
            dto.setWeddingTime(customDataMap.get("wedding_time"));
            dto.setWeddingVenue(customDataMap.get("wedding_venue"));
            dto.setCustomMessage(customDataMap.get("custom_message"));
        } catch (Exception e) {
            // Ignore parsing errors
        }
        
        return dto;
    }
}