package com.thiepCuoi.service.impl;

import com.thiepCuoi.repository.UserRepository;
import com.thiepCuoi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public Long getUserCount() {
        return userRepository.count();
    }
}