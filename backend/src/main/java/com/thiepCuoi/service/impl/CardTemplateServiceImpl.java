package com.thiepCuoi.service.impl;

import com.thiepCuoi.model.dto.CardTemplateDTO;
import com.thiepCuoi.repository.CardTemplateRepository;
import com.thiepCuoi.repository.TemplateRepository;
import com.thiepCuoi.repository.UserRepository;
import com.thiepCuoi.repository.entity.CardTemplate;
import com.thiepCuoi.repository.entity.Template;
import com.thiepCuoi.repository.entity.User;
import com.thiepCuoi.service.CardTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardTemplateServiceImpl implements CardTemplateService {
    
    @Autowired
    private CardTemplateRepository cardTemplateRepository;
    
    @Autowired
    private TemplateRepository templateRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public List<CardTemplateDTO> getAllActiveCardTemplates() {
        return cardTemplateRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CardTemplateDTO> getCardTemplatesByTemplateId(Long templateId) {
        return cardTemplateRepository.findByTemplate_IdAndIsActiveTrue(templateId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public CardTemplateDTO getCardTemplateById(Long id) {
        CardTemplate cardTemplate = cardTemplateRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiệp HTML"));
        return convertToDTO(cardTemplate);
    }
    
    @Override
    public CardTemplateDTO createCardTemplate(CardTemplateDTO cardTemplateDTO, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        if (!user.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Chỉ admin mới có thể tạo mẫu thiệp HTML");
        }
        
        Template template = templateRepository.findById(cardTemplateDTO.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy template"));
        
        CardTemplate cardTemplate = new CardTemplate();
        cardTemplate.setTemplate(template);
        cardTemplate.setTemplateName(cardTemplateDTO.getCardTemplateName());
        cardTemplate.setHtmlContent(cardTemplateDTO.getHtmlContent());
        cardTemplate.setCssContent(cardTemplateDTO.getCssContent());
        cardTemplate.setTemplateVariables(cardTemplateDTO.getTemplateVariables());
        cardTemplate.setPreviewImageUrl(cardTemplateDTO.getPreviewImageUrl());
        cardTemplate.setThumbnailUrl(cardTemplateDTO.getThumbnailUrl());
        cardTemplate.setVersion(cardTemplateDTO.getVersion() != null ? cardTemplateDTO.getVersion() : "1.0");
        cardTemplate.setCreatedBy(user);
        
        CardTemplate savedCardTemplate = cardTemplateRepository.save(cardTemplate);
        return convertToDTO(savedCardTemplate);
    }
    
    @Override
    public CardTemplateDTO updateCardTemplate(Long id, CardTemplateDTO cardTemplateDTO, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        if (!user.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Chỉ admin mới có thể cập nhật mẫu thiệp HTML");
        }
        
        CardTemplate cardTemplate = cardTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiệp HTML"));
        
        cardTemplate.setTemplateName(cardTemplateDTO.getCardTemplateName());
        cardTemplate.setHtmlContent(cardTemplateDTO.getHtmlContent());
        cardTemplate.setCssContent(cardTemplateDTO.getCssContent());
        cardTemplate.setTemplateVariables(cardTemplateDTO.getTemplateVariables());
        cardTemplate.setPreviewImageUrl(cardTemplateDTO.getPreviewImageUrl());
        cardTemplate.setThumbnailUrl(cardTemplateDTO.getThumbnailUrl());
        cardTemplate.setVersion(cardTemplateDTO.getVersion());
        
        CardTemplate updatedCardTemplate = cardTemplateRepository.save(cardTemplate);
        return convertToDTO(updatedCardTemplate);
    }
    
    @Override
    public void deleteCardTemplate(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        if (!user.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Chỉ admin mới có thể xóa mẫu thiệp HTML");
        }
        
        CardTemplate cardTemplate = cardTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiệp HTML"));
        
        cardTemplate.setIsActive(false);
        cardTemplateRepository.save(cardTemplate);
    }
    
    @Override
    public List<CardTemplateDTO> getCardTemplatesByCreator(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        return cardTemplateRepository.findByCreatedBy_IdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private CardTemplateDTO convertToDTO(CardTemplate cardTemplate) {
        CardTemplateDTO dto = new CardTemplateDTO();
        dto.setId(cardTemplate.getId());
        dto.setTemplateId(cardTemplate.getTemplate().getId());
        dto.setTemplateName(cardTemplate.getTemplate().getName());
        dto.setCardTemplateName(cardTemplate.getTemplateName());
        dto.setHtmlContent(cardTemplate.getHtmlContent());
        dto.setCssContent(cardTemplate.getCssContent());
        dto.setTemplateVariables(cardTemplate.getTemplateVariables());
        dto.setPreviewImageUrl(cardTemplate.getPreviewImageUrl());
        dto.setThumbnailUrl(cardTemplate.getThumbnailUrl());
        dto.setVersion(cardTemplate.getVersion());
        dto.setIsActive(cardTemplate.getIsActive());
        
        if (cardTemplate.getCreatedBy() != null) {
            dto.setCreatedBy(cardTemplate.getCreatedBy().getId());
            dto.setCreatedByName(cardTemplate.getCreatedBy().getFullName());
        }
        
        return dto;
    }
}