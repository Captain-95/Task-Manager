package com.taskmanager.service;

import com.taskmanager.dto.UserDropdownResponse;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.SecurityUtils;
import com.taskmanager.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserDropdownResponse> getAssignableUsers() {

        UserPrincipal currentUser = SecurityUtils.getCurrentUser();

        boolean isAdmin = currentUser.getAuthorities()
                .stream()
                .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {

            return userRepository.findAll()
                    .stream()
                    .map(user -> UserDropdownResponse.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .build())
                    .toList();

        }

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return List.of(

                UserDropdownResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .build()

        );

    }

}