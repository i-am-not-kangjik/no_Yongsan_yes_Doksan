package kjkim.kjkimspring.repository;

import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.user.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testJpa() {
        User user1 = new User();
        user1.setUsername("user1");
        user1.setPassword("user1user1");
        user1.setEmail("user1@user1.com");
        this.userRepository.save(user1);

        User user2 = new User();
        user2.setUsername("user2");
        user2.setPassword("user2user2");
        user2.setEmail("user2@user2.com");
        this.userRepository.save(user2);
    }

    @Test
    void testJpa_2() {
        List<User> all = this.userRepository.findAll();
        Assertions.assertEquals(2, all.size());

        User user = all.get(0);
        Assertions.assertEquals("user1", user.getUsername());
    }

    @Test
    void testJpa_3() {
        Optional<User> up = this.userRepository.findById(11L);
        if(up.isPresent()) {
            User user = up.get();
            Assertions.assertEquals("user1", user.getUsername());
        }
    }

    @Test
    void testJpa_4() {
        Optional<User> up = this.userRepository.findByUsername("user1");
        if(up.isPresent()){
            User user = up.get();
            Assertions.assertEquals(11, user.getId());
        }

//        User user = this.userRepository.findByUsername("user1");
//        Assertions.assertEquals(11, user.getId());
    }

    @Test
    void testJpa_5() {
        User user = this.userRepository.findByUsernameAndEmail(
                "user1", "user1@user1.com"
        );
        Assertions.assertEquals(11, user.getId());
    }

    @Test
    void testJpa_6() {
        List<User> userlist = this.userRepository.findByEmailLike("%com");
        User user = userlist.get(1);
        Assertions.assertEquals("user2@user2.com", user.getEmail());
    }

    @Test
    void testJpa_7() {
        Optional<User> user = this.userRepository.findById(12L);
        Assertions.assertTrue(user.isPresent());
        User u = user.get();
        u.setEmail("user2@naver.com");
        this.userRepository.save(u);
    }

    @Test
    void testJpa_8() {
        Assertions.assertEquals(2, this.userRepository.count());
        Optional<User> user = this.userRepository.findById(11L);
        Assertions.assertTrue(user.isPresent());
        User u = user.get();
        this.userRepository.delete(u);
        Assertions.assertEquals(1, this.userRepository.count());
    }
}
