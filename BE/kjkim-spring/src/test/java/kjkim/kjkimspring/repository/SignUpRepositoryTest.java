package kjkim.kjkimspring.repository;

import kjkim.kjkimspring.members.SignUp;
import kjkim.kjkimspring.members.SignUpRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

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
}
