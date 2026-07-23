package com.taskmanager.exception;

public class UnauthorizedTaskAccessException extends RuntimeException {
    public UnauthorizedTaskAccessException() {
        super("You are not authorized to access this task.");
    }
}
