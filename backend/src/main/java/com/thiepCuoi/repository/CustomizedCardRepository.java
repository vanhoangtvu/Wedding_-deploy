package com.thiepCuoi.repository;

import com.thiepCuoi.repository.entity.CustomizedCard;
import com.thiepCuoi.repository.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomizedCardRepository extends JpaRepository<CustomizedCard, Long> {
    List<CustomizedCard> findByUser(User user);
    List<CustomizedCard> findByUserAndIsSavedTrue(User user);
    List<CustomizedCard> findByUser_Id(Long userId);
    List<CustomizedCard> findByUser_IdAndIsSavedTrue(Long userId);
    List<CustomizedCard> findByUser_IdOrderByCreatedAtDesc(Long userId);
}