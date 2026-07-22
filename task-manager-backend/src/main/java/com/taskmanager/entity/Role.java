package com.taskmanager.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Master list of roles (e.g. ROLE_ADMIN, ROLE_USER).
 * Linked to User via the UserRole join entity - keeps roles reusable
 * and makes it trivial to assign multiple roles to a user.
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name; // e.g. ROLE_ADMIN, ROLE_USER
}
