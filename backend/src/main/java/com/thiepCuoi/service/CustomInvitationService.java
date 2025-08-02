package com.thiepCuoi.service;

import com.thiepCuoi.model.dto.CustomInvitationDTO;
import java.util.List;

public interface CustomInvitationService {
    CustomInvitationDTO createCustomInvitation(String username, CustomInvitationDTO invitationDTO);
    CustomInvitationDTO updateCustomInvitation(Long id, CustomInvitationDTO invitationDTO, String username);
    CustomInvitationDTO saveCustomInvitation(Long id, String username);
    List<CustomInvitationDTO> getUserInvitations(String username);
    List<CustomInvitationDTO> getUserSavedInvitations(String username);
    CustomInvitationDTO getCustomInvitationById(Long id, String username);
    void deleteCustomInvitation(Long id, String username);
}