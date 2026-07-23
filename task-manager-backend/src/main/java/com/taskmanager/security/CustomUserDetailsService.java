package com.taskmanager.security;

import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<GrantedAuthority> authorities = user.getUserRoles().stream()
                .map(userRole -> new SimpleGrantedAuthority(userRole.getRole().getName()))
                .collect(java.util.stream.Collectors.toList());

        System.out.println("================================");
        System.out.println("Username : " + user.getUsername());

        System.out.println("User Roles Size : " + user.getUserRoles().size());

        user.getUserRoles().forEach(r ->
                System.out.println("Role -> " + r.getRole().getName()));

        System.out.println("Authorities : " + authorities);
        System.out.println("================================");



        return new UserPrincipal(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.isEnabled(),
                authorities
        );

    }
}
