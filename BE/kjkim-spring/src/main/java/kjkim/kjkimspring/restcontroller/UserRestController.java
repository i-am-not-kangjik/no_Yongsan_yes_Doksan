package kjkim.kjkimspring.restcontroller;

import kjkim.kjkimspring.dto.UserCreateDto;
import kjkim.kjkimspring.dto.UserDto;
import kjkim.kjkimspring.service.UserService;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.user.UserCreateForm;
import kjkim.kjkimspring.service.JwtService;

import kjkim.kjkimspring.user.UserLoginForm;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserRestController {
    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserCreateDto userCreateDto) {
        try {
            // 이메일 중복 검사
            if (userService.existsByEmail(userCreateDto.getEmail())) {
                return ResponseEntity.badRequest().body("Email is already taken");
            }

            // 사용자명 중복 검사
            if (userService.existsByUsername(userCreateDto.getUsername())) {
                return ResponseEntity.badRequest().body("Username is already taken");
            }

            // 전화번호 중복 검사
            if (userService.existsByPhoneNumber(userCreateDto.getPhoneNumber())) {
                return ResponseEntity.badRequest().body("Phone number is already taken");
            }

            // 비밀번호 확인
            if (!userCreateDto.getPassword1().equals(userCreateDto.getPassword2())) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }

            // 회원가입 처리
            User user = userService.create(userCreateDto.getUsername(), userCreateDto.getEmail(), userCreateDto.getPassword1(), userCreateDto.getPhoneNumber());
            return ResponseEntity.status(HttpStatus.CREATED).body(new UserDto(user).toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }






    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginForm userLoginForm) {
        User user;
        try {
            user = userService.findByEmail(userLoginForm.getEmail());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "User not found"));
        }

        String rawPassword = userLoginForm.getPassword();
        if (rawPassword == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Invalid password"));
        }

        // At this point, the user has been successfully authenticated.
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }


    // 추가적인 API 구현...
}
