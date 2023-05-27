package kjkim.kjkimspring.repository;

import kjkim.kjkimspring.user.SignUp;
import kjkim.kjkimspring.user.SignUpRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

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

    @Test
    void testJpa_2() {
        List<SignUp> all = this.signUpRepository.findAll();
        Assertions.assertEquals(2, all.size());

        SignUp user = all.get(0);
        Assertions.assertEquals("user1", user.getUsername());
    }

    @Test
    void testJpa_3() {
        Optional<SignUp> up = this.signUpRepository.findById(11L);
        if(up.isPresent()) {
            SignUp user = up.get();
            Assertions.assertEquals("user1", user.getUsername());
        }
    }

    @Test
    void testJpa_4() {
        SignUp user = this.signUpRepository.findByUsername("user1");
        Assertions.assertEquals(11, user.getId());
    }

    @Test
    void testJpa_5() {
        SignUp user = this.signUpRepository.findByUsernameAndEmail(
                "user1", "user1@user1.com"
        );
        Assertions.assertEquals(11, user.getId());
    }

    @Test
    void testJpa_6() {
        List<SignUp> userlist = this.signUpRepository.findByEmailLike("%com");
        SignUp user = userlist.get(1);
        Assertions.assertEquals("user2@user2.com", user.getEmail());
    }

    @Test
    void testJpa_7() {
        Optional<SignUp> user = this.signUpRepository.findById(12L);
        Assertions.assertTrue(user.isPresent());
        SignUp u = user.get();
        u.setEmail("user2@naver.com");
        this.signUpRepository.save(u);
    }
}
