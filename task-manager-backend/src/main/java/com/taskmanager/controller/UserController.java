package com.taskmanager.controller;

import com.taskmanager.dto.UserDropdownResponse;
import com.taskmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/dropdown")
    public List<UserDropdownResponse> getDropdown() {

        return userService.getAssignableUsers();

    }

}