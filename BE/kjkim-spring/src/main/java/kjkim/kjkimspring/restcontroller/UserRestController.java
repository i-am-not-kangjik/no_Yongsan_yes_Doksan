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

            // 비밀번호 확인
            if (!userCreateDto.getPassword1().equals(userCreateDto.getPassword2())) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }

            // 회원가입 처리
            User user = userService.create(userCreateDto.getUsername(), userCreateDto.getEmail(), userCreateDto.getPassword1());
            return ResponseEntity.status(HttpStatus.CREATED).body(new UserDto(user).toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }





    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginForm userLoginForm) {
        User user;
        try {
            user = userService.findByEmail(userLoginForm.getEmail());
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }

        String rawPassword = userLoginForm.getPassword();
        if (rawPassword == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        // At this point, the user has been successfully authenticated.
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);

        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    // 추가적인 API 구현...
}
