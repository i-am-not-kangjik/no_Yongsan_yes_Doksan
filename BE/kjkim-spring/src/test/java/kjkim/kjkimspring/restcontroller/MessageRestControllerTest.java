package kjkim.kjkimspring.restcontroller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import kjkim.kjkimspring.dto.MessageDto;
import kjkim.kjkimspring.user.UserLoginForm;
import kjkim.kjkimspring.service.MessageService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Collections;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MessageRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MessageService messageService;

    @Autowired
    private ObjectMapper objectMapper;

    private MessageDto messageDto;

    @BeforeEach
    public void setUp() {
        messageDto = new MessageDto();
        messageDto.setSenderUsername("user1");
        messageDto.setReceiverUsername("user2");
        messageDto.setContent("Hello, user2!");
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        UserLoginForm userLoginForm = new UserLoginForm();
        userLoginForm.setEmail(email);
        userLoginForm.setPassword(password);

        MvcResult loginResult = mockMvc.perform(
                post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userLoginForm))
        ).andReturn();

        String loginResponse = loginResult.getResponse().getContentAsString();
        Map<String, String> loginResponseMap = objectMapper.readValue(loginResponse, new TypeReference<Map<String, String>>() {});
        return loginResponseMap.get("token");
    }

    @Test
    public void testSendMessage() throws Exception {
        String token = loginAndGetToken("user1@naver.com", "user1user1");

        mockMvc.perform(post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content("{\"senderUsername\": \"user1\", \"receiverUsername\": \"user2\", \"content\": \"Hello, user2!\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetReceivedMessages() throws Exception {
        String token = loginAndGetToken("user2@naver.com", "user2user2");

        MvcResult mvcResult = mockMvc.perform(get("/api/messages/received/user2")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();

        System.out.println(mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testGetSentMessages() throws Exception {
        String token = loginAndGetToken("user1@naver.com", "user1user1");

        MvcResult mvcResult = mockMvc.perform(get("/api/messages/sent/user1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();

        System.out.println(mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void testGetMessage() throws Exception {
        String token = loginAndGetToken("user1@naver.com", "user1user1");

        MvcResult mvcResult = mockMvc.perform(get("/api/messages/user1/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();

        System.out.println(mvcResult.getResponse().getContentAsString());
    }
}
