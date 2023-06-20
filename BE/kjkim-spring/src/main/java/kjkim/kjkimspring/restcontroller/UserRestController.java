package kjkim.kjkimspring.restcontroller;

import kjkim.kjkimspring.dto.SellDTO;
import kjkim.kjkimspring.dto.UserCreateDto;
import kjkim.kjkimspring.dto.UserDto;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.service.SellService;
import kjkim.kjkimspring.service.UserService;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.jwt.JwtService;

import kjkim.kjkimspring.user.UserLoginForm;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserRestController {
    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SellService sellService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserCreateDto userCreateDto) {
        try {
            // 필수 정보 누락 여부 확인
            if (userCreateDto.getUsername() == null ||
                    userCreateDto.getPassword1() == null ||
                    userCreateDto.getPassword2() == null ||
                    userCreateDto.getEmail() == null ||
                    userCreateDto.getPhoneNumber() == null ||
                    userCreateDto.getFullName() == null) {
                return ResponseEntity.badRequest().body("Required information is missing");
            }

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
            User user = userService.create(userCreateDto.getUsername(), userCreateDto.getEmail(), userCreateDto.getPassword1(), userCreateDto.getPhoneNumber(), userCreateDto.getFullName());
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

    @GetMapping("/{userId}/liked-sells")
    public ResponseEntity<List<SellDTO>> getLikedSellsByUser(@PathVariable("userId") Long userId) {
        List<Sell> likedSells = sellService.getLikedSellsByUser(userId);
        List<SellDTO> likedSellsDTO = likedSells.stream().map(sell -> sellService.convertToDTO(sell)).collect(Collectors.toList());
        return ResponseEntity.ok(likedSellsDTO);
    }

    // 추가적인 API 구현...
}
