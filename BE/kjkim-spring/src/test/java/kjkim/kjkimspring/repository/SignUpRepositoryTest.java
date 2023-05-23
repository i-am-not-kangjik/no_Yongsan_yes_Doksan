package kjkim.kjkimspring.repository;

import kjkim.kjkimspring.members.SignUp;
import kjkim.kjkimspring.members.SignUpRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class SignUpRepositoryTest {

    @Autowired
    private SignUpRepository signUpRepository;

    @Test
    void testJpa(){
        SignUp user1 = new SignUp();
        user1.setEmail("aaaaa@bbb.ccc");
        user1.setPasswordHash("1234");
        user1.setName("username");
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
}
