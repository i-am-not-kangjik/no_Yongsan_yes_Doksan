package kjkim.kjkimspring.service;

import kjkim.kjkimspring.members.SignUp;
import kjkim.kjkimspring.members.SignUpRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final SignUpRepository signUpRepository;

    public UserService(SignUpRepository signUpRepository) {
        this.signUpRepository = signUpRepository;
    }

    public SignUp create(String name, String email, String password) {
        SignUp user = new SignUp();
        user.setName(name);
        user.setEmail(email);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPasswordHash(passwordEncoder.encode(password));
        this.signUpRepository.save(user);
        return user;
    }
}
