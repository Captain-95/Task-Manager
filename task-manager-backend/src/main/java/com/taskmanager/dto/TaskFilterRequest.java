package com.taskmanager.dto;

import lombok.Data;

@Data
public class TaskFilterRequest {

    private String search;
    private Long assignedUserId;
    private Long createdByUserId;
    private String status;

}