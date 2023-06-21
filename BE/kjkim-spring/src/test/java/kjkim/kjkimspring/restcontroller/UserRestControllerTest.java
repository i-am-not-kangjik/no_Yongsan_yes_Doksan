package kjkim.kjkimspring.restcontroller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import kjkim.kjkimspring.dto.UserCreateDto;
import kjkim.kjkimspring.user.UserLoginForm;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
        dto.setUsername("user5");
        dto.setEmail("user5@naver.com");
        dto.setPassword1("user5user5");
        dto.setPassword2("user5user5");
        dto.setPhoneNumber("01055555555");
        dto.setFullName("유저오");

        mockMvc.perform(post("/api/user/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());
    }

    @Test
    public void testSignups() throws Exception {
        String[] usernames = {"user1", "user2", "user3"};
        String[] emails = {"user1@naver.com", "user2@naver.com", "user3@naver.com"};
        String[] passwords = {"user1user1", "user2user2", "user3user3"};
        String[] phoneNumbers = {"01011111111", "01022222222", "01033333333"};
        String[] fullNames = {"유저일", "유저이", "유저삼"};

        for (int i = 0; i < usernames.length; i++) {
            UserCreateDto dto = new UserCreateDto();
            dto.setUsername(usernames[i]);
            dto.setEmail(emails[i]);
            dto.setPassword1(passwords[i]);
            dto.setPassword2(passwords[i]);
            dto.setPhoneNumber(phoneNumbers[i]);
            dto.setFullName(fullNames[i]);

            mockMvc.perform(post("/api/user/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isCreated());
        }
    }




    @Test
    public void testLogin() throws Exception {
        UserLoginForm form = new UserLoginForm();
        form.setEmail("user4@naver.com");
        form.setPassword("user4user4");

        MvcResult result = mockMvc.perform(post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user4"))
                .andExpect(jsonPath("$.token").isString())
                .andReturn();

        // Print the response body
        System.out.println(result.getResponse().getContentAsString());
    }




    @Test
    public void testGetLikedSells() throws Exception {
        // Step 1: login and get the token
        UserLoginForm userLoginForm = new UserLoginForm();
        userLoginForm.setEmail("user3@naver.com");
        userLoginForm.setPassword("user3user3");

        MvcResult loginResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userLoginForm))
        ).andReturn();

        String loginResponse = loginResult.getResponse().getContentAsString();
        Map<String, String> loginResponseMap = objectMapper.readValue(loginResponse, new TypeReference<Map<String, String>>() {});
        String token = loginResponseMap.get("token");

        // Step 2: Send a GET request to get liked sells
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/user/3/liked-sells")
                                .header("Authorization", "Bearer " + token)
                ).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andDo(print()); // Print the response body
    }





    // 추가적인 테스트 구현...
}
