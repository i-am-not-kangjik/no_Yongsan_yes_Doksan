package kjkim.kjkimspring.restcontroller;

import kjkim.kjkimspring.dto.UserDto;
import kjkim.kjkimspring.service.UserService;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.user.UserCreateForm;
import kjkim.kjkimspring.service.JwtService;

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

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserRestController {
    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<UserDto> signup(@RequestBody UserCreateForm userCreateForm) {
        User user = userService.create(userCreateForm.getUsername(), userCreateForm.getEmail(), userCreateForm.getPassword1());
        return new ResponseEntity<>(new UserDto(user), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserCreateForm userCreateForm) {
        UserDetails userDetails;
        try {
            userDetails = userDetailsService.loadUserByUsername(userCreateForm.getUsername());
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }

        String rawPassword = userCreateForm.getPassword1();
        if (rawPassword == null || !passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
            return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        // At this point, the user has been successfully authenticated.
        // Here you should generate and return a token (for example, JWT) to the user.
        String token = jwtService.generateToken(userDetails);

        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    // 추가적인 API 구현...
}
