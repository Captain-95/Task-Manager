package com.taskmanager.config;

import com.taskmanager.entity.Role;
import com.taskmanager.entity.User;
import com.taskmanager.entity.UserRole;
import com.taskmanager.repository.RoleRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the roles table and two default users on startup so the app is
 * usable immediately without a separate signup step:
 *   admin / admin123  -> ROLE_ADMIN + ROLE_USER
 *   user  / user123   -> ROLE_USER
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_USER").build()));

        if (!userRepository.existsByUsername("admin")) {
            User admin = userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .enabled(true)
                    .build());
            userRoleRepository.save(UserRole.builder().user(admin).role(adminRole).build());
            userRoleRepository.save(UserRole.builder().user(admin).role(userRole).build());
        }

        if (!userRepository.existsByUsername("user")) {
            User user = userRepository.save(User.builder()
                    .username("user")
                    .password(passwordEncoder.encode("user123"))
                    .enabled(true)
                    .build());
            userRoleRepository.save(UserRole.builder().user(user).role(userRole).build());
        }
    }
}
