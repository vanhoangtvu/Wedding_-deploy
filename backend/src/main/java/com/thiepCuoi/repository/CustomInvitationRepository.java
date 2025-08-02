package com.thiepCuoi.repository;

import com.thiepCuoi.repository.entity.CustomInvitation;
import com.thiepCuoi.repository.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomInvitationRepository extends JpaRepository<CustomInvitation, Long> {
    List<CustomInvitation> findByUser(User user);
    List<CustomInvitation> findByUserAndIsSavedTrue(User user);
    List<CustomInvitation> findByUser_Id(Long userId);
    List<CustomInvitation> findByUser_IdAndIsSavedTrue(Long userId);
}