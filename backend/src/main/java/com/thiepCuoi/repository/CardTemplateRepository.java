package com.thiepCuoi.repository;

import com.thiepCuoi.repository.entity.CardTemplate;
import com.thiepCuoi.repository.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CardTemplateRepository extends JpaRepository<CardTemplate, Long> {
    List<CardTemplate> findByIsActiveTrue();
    List<CardTemplate> findByTemplateAndIsActiveTrue(Template template);
    List<CardTemplate> findByTemplate_IdAndIsActiveTrue(Long templateId);
    Optional<CardTemplate> findByIdAndIsActiveTrue(Long id);
    List<CardTemplate> findByCreatedBy_IdOrderByCreatedAtDesc(Long userId);
}