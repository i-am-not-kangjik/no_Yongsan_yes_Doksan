package kjkim.kjkimspring.restcontroller;

import com.fasterxml.jackson.databind.ObjectMapper;
import kjkim.kjkimspring.user.UserCreateForm;
import kjkim.kjkimspring.user.UserLoginForm;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testSignup() throws Exception {
        UserCreateForm form = new UserCreateForm();
        form.setUsername("user8");
        form.setEmail("user8@naver.com");
        form.setPassword1("user6user6");
        form.setPassword2("user6user6");

        mockMvc.perform(post("/api/user/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isCreated());
    }

    @Test
    public void testLogin() throws Exception {
        UserLoginForm form = new UserLoginForm();
        form.setEmail("user1@naver.com");
        form.setPassword("user1user1");

        mockMvc.perform(post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isOk());
    }

    // 추가적인 테스트 구현...
}
