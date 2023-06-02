package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.user.SignUp;
import kjkim.kjkimspring.user.SignUpRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final SignUpRepository signUpRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(SignUpRepository signUpRepository, PasswordEncoder passwordEncoder) {
        this.signUpRepository = signUpRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public SignUp create(String username, String email, String password) {
        SignUp user = new SignUp();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        this.signUpRepository.save(user);
        return user;
    }

    public SignUp getUser(String username) {
        Optional<SignUp> signUp = this.signUpRepository.findByUsername(username);
        if (signUp.isPresent()) {
            return signUp.get();
        } else {
            throw new DataNotFoundException("user is not found");
        }
    }
}
