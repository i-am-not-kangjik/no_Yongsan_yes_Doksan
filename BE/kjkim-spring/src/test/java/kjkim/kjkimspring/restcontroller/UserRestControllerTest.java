package kjkim.kjkimspring.restcontroller;

import com.fasterxml.jackson.databind.ObjectMapper;
import kjkim.kjkimspring.dto.UserCreateDto;
import kjkim.kjkimspring.user.UserCreateForm;
import kjkim.kjkimspring.user.UserLoginForm;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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
        UserCreateDto dto = new UserCreateDto();
        dto.setUsername("user4");
        dto.setEmail("user4@naver.com");
        dto.setPassword1("user4user4");
        dto.setPassword2("user4user4");
        dto.setPhoneNumber("01044444444");
        dto.setFullName("유저사");

        mockMvc.perform(post("/api/user/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());
    }



    @Test
    public void testLogin() throws Exception {
        UserLoginForm form = new UserLoginForm();
        form.setEmail("user1@naver.com");
        form.setPassword("user1user1");

        MvcResult result = mockMvc.perform(post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user1"))
                .andExpect(jsonPath("$.token").isString())
                .andReturn();

        // Print the response body
        System.out.println(result.getResponse().getContentAsString());
    }



    // 추가적인 테스트 구현...
}
