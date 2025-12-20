package com.example.taskflow.service;

import com.example.taskflow.model.User;
import com.example.taskflow.repository.UserRepository;
import com.example.taskflow.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    // --- REGISTER TESTS ---

    @Test
    void register_shouldHashPassword_andReturnToken_whenSuccess() {
        // 1. ARRANGE
        User user = new User();
        user.setUsername("newuser");
        user.setPassword("plaintext123");

        // Mock: User does not exist yet
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());

        // Mock: Password encoding
        when(passwordEncoder.encode("plaintext123")).thenReturn("hashed_secret");

        // Mock: Token generation
        when(jwtUtil.generateToken("newuser")).thenReturn("fake-jwt-token");

        // 2. ACT
        Map<String, String> result = authService.register(user);

        // 3. ASSERT
        assertEquals("fake-jwt-token", result.get("token")); // Check if token is returned
        assertEquals("hashed_secret", user.getPassword());   // Verify password was hashed!

        // Verify we saved the user to DB exactly once
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void register_shouldThrowError_whenUserAlreadyExists() {
        // 1. ARRANGE
        User user = new User();
        user.setUsername("existingUser");

        // Mock: User already exists
        when(userRepository.findByUsername("existingUser")).thenReturn(Optional.of(new User()));

        // 2. ACT & ASSERT
        // We expect it to fail with a specific error message
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.register(user);
        });

        assertEquals("Username already exists", exception.getMessage());

        // CRITICAL: Ensure we never saved the duplicate user
        verify(userRepository, never()).save(any(User.class));
    }

    // --- LOGIN TESTS ---

    @Test
    void login_shouldReturnToken_whenCredentialsCorrect() {
        // 1. ARRANGE
        String username = "validUser";
        String rawPassword = "password123";
        String encodedPassword = "hashed_password123";

        User foundUser = new User();
        foundUser.setUsername(username);
        foundUser.setPassword(encodedPassword);

        // Mock finding the user
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(foundUser));

        // Mock password check (It matches!)
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);

        // Mock token generation
        when(jwtUtil.generateToken(username)).thenReturn("access-token-123");

        // 2. ACT
        Map<String, String> result = authService.login(username, rawPassword);

        // 3. ASSERT
        assertNotNull(result);
        assertEquals("access-token-123", result.get("token"));
    }

    @Test
    void login_shouldThrowError_whenPasswordIsWrong() {
        // 1. ARRANGE
        String username = "validUser";
        String wrongPassword = "wrongPassword";
        String realHash = "real_hash";

        User foundUser = new User();
        foundUser.setUsername(username);
        foundUser.setPassword(realHash);

        // Mock finding user
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(foundUser));

        // Mock password check (It FAILS!)
        when(passwordEncoder.matches(wrongPassword, realHash)).thenReturn(false);

        // 2. ACT & ASSERT
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.login(username, wrongPassword);
        });

        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    void login_shouldThrowError_whenUserNotFound() {
        // 1. ARRANGE
        String username = "ghostUser";

        // Mock finding user (Returns Empty)
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // 2. ACT & ASSERT
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.login(username, "anyPassword");
        });

        assertEquals("User not found", exception.getMessage());
    }
}