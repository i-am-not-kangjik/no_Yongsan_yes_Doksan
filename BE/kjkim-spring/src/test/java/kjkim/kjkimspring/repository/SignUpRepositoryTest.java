package kjkim.kjkimspring.repository;

import kjkim.kjkimspring.members.SignUp;
import kjkim.kjkimspring.members.SignUpRepository;
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
    void testJpa(){
        SignUp user1 = new SignUp();
        user1.setEmail("aaaaaa@bbb.ccc");
        user1.setPasswordHash("1234");
        user1.setName("username2");
        user1.setPhoneNumber("12312341234");
        this.signUpRepository.save(user1);
    }

    @Test
    void testJpa_2() {
        List<SignUp> all = this.signUpRepository.findAll();
        Assertions.assertEquals(3, all.size());

        SignUp user = all.get(0);
        Assertions.assertEquals("username", user.getName());
//        Assertions.assertEquals("에러가 발생하나요?!", user.getName());
    }

    @Test
    void testJpa_3() {
        Optional<SignUp> up = this.signUpRepository.findById(1L);
        if(up.isPresent()) {
            SignUp user = up.get();
            Assertions.assertEquals("username", user.getName());
        }
    }

    @Test
    void testJpa_4() {
        SignUp user = this.signUpRepository.findByName("username2");
        Assertions.assertEquals(5, user.getUserId());
    }

    @Test
    void testJpa_5() {
        SignUp user = this.signUpRepository.findByNameAndEmail(
          "username", "aaa@bbb.ccc"
        );
        Assertions.assertEquals(1, user.getUserId());
    }

    @Test
    void testJpa_6(){
        List<SignUp> userlist = this.signUpRepository.findByEmailLike("%ccc");
        SignUp user = userlist.get(1);
        Assertions.assertEquals("aaaa@bbb.ccc", user.getEmail());
    }

    @Test
    void testJpa_7() {
        Optional<SignUp> user = this.signUpRepository.findById(5L);
        Assertions.assertTrue(user.isPresent());
        SignUp u = user.get();
        u.setName("username5");
        this.signUpRepository.save(u);
    }
}
