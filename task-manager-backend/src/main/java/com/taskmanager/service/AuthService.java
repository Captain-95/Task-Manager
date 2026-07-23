package com.taskmanager.service;

import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.JwtResponse;
import com.taskmanager.dto.LoginRequest;
import com.taskmanager.dto.RegisterRequest;
import com.taskmanager.entity.Role;
import com.taskmanager.entity.User;
import com.taskmanager.entity.UserRole;
import com.taskmanager.exception.UserAlreadyExistsException;
import com.taskmanager.repository.RoleRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.repository.UserRoleRepository;
import com.taskmanager.security.CustomUserDetailsService;
import com.taskmanager.security.JwtUtil;
import com.taskmanager.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        UserPrincipal user = (UserPrincipal) userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(user);

        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .username(user.getUsername())
                .roles(roles)
                .build();
    }

    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException(request.getUsername());
        }

        User user = userRepository.save(User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .build());

        Set<String> requestedRoles = (request.getRoles() == null || request.getRoles().isEmpty())
                ? Set.of("ROLE_USER")
                : request.getRoles();

        for (String roleName : requestedRoles) {
            Role role = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));
            userRoleRepository.save(UserRole.builder().user(user).role(role).build());
        }

        return ApiResponse.builder()
                .success(true)
                .message("User registered successfully")
                .build();
    }
}
