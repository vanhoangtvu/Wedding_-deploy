package com.thiepCuoi.service;

import com.thiepCuoi.model.dto.CardTemplateDTO;
import java.util.List;

public interface CardTemplateService {
    List<CardTemplateDTO> getAllActiveCardTemplates();
    List<CardTemplateDTO> getCardTemplatesByTemplateId(Long templateId);
    CardTemplateDTO getCardTemplateById(Long id);
    CardTemplateDTO createCardTemplate(CardTemplateDTO cardTemplateDTO, String username);
    CardTemplateDTO updateCardTemplate(Long id, CardTemplateDTO cardTemplateDTO, String username);
    void deleteCardTemplate(Long id, String username);
    List<CardTemplateDTO> getCardTemplatesByCreator(String username);
}