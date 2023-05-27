package kjkim.kjkimspring.repository;

import kjkim.kjkimspring.user.SignUp;
import kjkim.kjkimspring.user.SignUpRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SignUpRepositoryTest {

    @Autowired
    private SignUpRepository signUpRepository;

    @Test
    void testJpa() {
        SignUp user1 = new SignUp();
        user1.setUsername("user1");
        user1.setPassword("user1user1");
        user1.setEmail("user1@user1.com");
        this.signUpRepository.save(user1);

        SignUp user2 = new SignUp();
        user2.setUsername("user2");
        user2.setPassword("user2user2");
        user2.setEmail("user2@user2.com");
        this.signUpRepository.save(user2);
    }
}
