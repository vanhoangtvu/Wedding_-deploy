package com.thiepCuoi.repository;

import com.thiepCuoi.repository.entity.Template;
import com.thiepCuoi.repository.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    List<Template> findByIsActiveTrue();
    List<Template> findByCategoryAndIsActiveTrue(Category category);
    List<Template> findByCategory_IdAndIsActiveTrue(Long categoryId);
    
    @Query("SELECT t FROM Template t WHERE t.isActive = true AND t.name LIKE %:keyword%")
    List<Template> searchByKeyword(@Param("keyword") String keyword);
}