package com.thiepCuoi.service;

import com.thiepCuoi.model.dto.*;

public interface AuthService {
    AuthResponseDTO login(LoginDTO loginDTO);
    UserResponseDTO register(RegisterDTO registerDTO);
    UserResponseDTO getCurrentUser(String username);
}