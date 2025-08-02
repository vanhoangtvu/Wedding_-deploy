package com.thiepCuoi.service.impl;

import com.thiepCuoi.model.dto.CustomInvitationDTO;
import com.thiepCuoi.repository.CustomInvitationRepository;
import com.thiepCuoi.repository.TemplateRepository;
import com.thiepCuoi.repository.UserRepository;
import com.thiepCuoi.repository.entity.CustomInvitation;
import com.thiepCuoi.repository.entity.Template;
import com.thiepCuoi.repository.entity.User;
import com.thiepCuoi.service.CustomInvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomInvitationServiceImpl implements CustomInvitationService {
    
    @Autowired
    private CustomInvitationRepository customInvitationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TemplateRepository templateRepository;
    
    @Override
    public CustomInvitationDTO createCustomInvitation(String username, CustomInvitationDTO invitationDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        Template template = templateRepository.findById(invitationDTO.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiệp"));
        
        CustomInvitation invitation = new CustomInvitation();
        invitation.setUser(user);
        invitation.setTemplate(template);
        invitation.setGroomName(invitationDTO.getGroomName());
        invitation.setBrideName(invitationDTO.getBrideName());
        invitation.setWeddingDate(invitationDTO.getWeddingDate());
        invitation.setWeddingTime(invitationDTO.getWeddingTime());
        invitation.setWeddingVenue(invitationDTO.getWeddingVenue());
        invitation.setCustomMessage(invitationDTO.getCustomMessage());
        invitation.setIsSaved(false);
        
        CustomInvitation savedInvitation = customInvitationRepository.save(invitation);
        return convertToDTO(savedInvitation);
    }
    
    @Override
    public CustomInvitationDTO updateCustomInvitation(Long id, CustomInvitationDTO invitationDTO, String username) {
        CustomInvitation invitation = customInvitationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiệp tùy chỉnh"));
        
        if (!invitation.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Không có quyền chỉnh sửa thiệp này");
        }
        
        invitation.setGroomName(invitationDTO.getGroomName());
        invitation.setBrideName(invitationDTO.getBrideName());
        invitation.setWeddingDate(invitationDTO.getWeddingDate());
        invitation.setWeddingTime(invitationDTO.getWeddingTime());
        invitation.setWeddingVenue(invitationDTO.getWeddingVenue());
        invitation.setCustomMessage(invitationDTO.getCustomMessage());
        
        CustomInvitation updatedInvitation = customInvitationRepository.save(invitation);
        return convertToDTO(updatedInvitation);
    }
    
    @Override
    public CustomInvitationDTO saveCustomInvitation(Long id, String username) {
        CustomInvitation invitation = customInvitationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiệp tùy chỉnh"));
        
        if (!invitation.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Không có quyền lưu thiệp này");
        }
        
        invitation.setIsSaved(true);
        CustomInvitation savedInvitation = customInvitationRepository.save(invitation);
        return convertToDTO(savedInvitation);
    }
    
    @Override
    public List<CustomInvitationDTO> getUserInvitations(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        return customInvitationRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CustomInvitationDTO> getUserSavedInvitations(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        return customInvitationRepository.findByUserAndIsSavedTrue(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public CustomInvitationDTO getCustomInvitationById(Long id, String username) {
        CustomInvitation invitation = customInvitationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiệp tùy chỉnh"));
        
        if (!invitation.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Không có quyền xem thiệp này");
        }
        
        return convertToDTO(invitation);
    }
    
    @Override
    public void deleteCustomInvitation(Long id, String username) {
        CustomInvitation invitation = customInvitationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiệp tùy chỉnh"));
        
        if (!invitation.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Không có quyền xóa thiệp này");
        }
        
        customInvitationRepository.delete(invitation);
    }
    
    private CustomInvitationDTO convertToDTO(CustomInvitation invitation) {
        CustomInvitationDTO dto = new CustomInvitationDTO();
        dto.setId(invitation.getId());
        dto.setTemplateId(invitation.getTemplate().getId());
        dto.setTemplateName(invitation.getTemplate().getName());
        dto.setGroomName(invitation.getGroomName());
        dto.setBrideName(invitation.getBrideName());
        dto.setWeddingDate(invitation.getWeddingDate());
        dto.setWeddingTime(invitation.getWeddingTime());
        dto.setWeddingVenue(invitation.getWeddingVenue());
        dto.setCustomMessage(invitation.getCustomMessage());
        dto.setGeneratedImageUrl(invitation.getGeneratedImageUrl());
        dto.setIsSaved(invitation.getIsSaved());
        return dto;
    }
}