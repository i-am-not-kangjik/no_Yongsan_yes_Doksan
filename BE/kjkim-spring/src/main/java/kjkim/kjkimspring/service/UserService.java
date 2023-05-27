//package kjkim.kjkimspring.service;
//
//import kjkim.kjkimspring.members.SignUp;
//import kjkim.kjkimspring.members.SignUpRepository;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserService {
//    private final SignUpRepository signUpRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public UserService(SignUpRepository signUpRepository, PasswordEncoder passwordEncoder) {
//        this.signUpRepository = signUpRepository;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    public SignUp create(String email, String name, String password) {
//        SignUp user = new SignUp();
//        user.setEmail(email);
//        user.setName(name);
//        user.setPasswordHash(passwordEncoder.encode(password));
//        this.signUpRepository.save(user);
//        return user;
//    }
//}
