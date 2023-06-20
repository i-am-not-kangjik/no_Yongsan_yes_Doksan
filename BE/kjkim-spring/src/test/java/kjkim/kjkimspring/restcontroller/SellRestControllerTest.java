package kjkim.kjkimspring.restcontroller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import kjkim.kjkimspring.sell.SellForm;
import kjkim.kjkimspring.service.SellService;
import kjkim.kjkimspring.service.UserService;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.user.UserLoginForm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.mock.http.server.reactive.MockServerHttpRequest.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SellRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;  // for converting objects to/from JSON

    @Test
    public void testGetSellList() throws Exception {
        // GET /api/sell 요청을 보냅니다.
        ResultActions resultActions = mockMvc.perform(get("/api/sell")
                .contentType(MediaType.APPLICATION_JSON));

        // HTTP 상태 코드 200 (OK)인지 확인합니다.
        resultActions.andExpect(status().isOk());

        // 응답 본문이 JSON 배열인지 확인하고, JSON 내용을 출력합니다.
        resultActions.andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andDo(print());

        // 여기서 필요한 추가적인 검증 작업을 수행합니다.
        // 예를 들어, JSON 배열의 길이를 확인하거나, 특정 필드 값을 확인할 수 있습니다.
    }



    @Test
    public void testCreateSell() throws Exception {
        // Step 1: login and get the token
        UserLoginForm userLoginForm = new UserLoginForm();
        userLoginForm.setEmail("user2@naver.com");
        userLoginForm.setPassword("user2user2");

        MvcResult loginResult = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userLoginForm))
        ).andReturn();

        String loginResponse = loginResult.getResponse().getContentAsString();
        Map<String, String> loginResponseMap = objectMapper.readValue(loginResponse, new TypeReference<Map<String, String>>() {});
        String token = loginResponseMap.get("token");

        // Step 2: create a sell post
        byte[] imageBytes1 = Files.readAllBytes(Paths.get("/Users/kangjik/Desktop/laptop5.jpg"));
        MockMultipartFile file1 = new MockMultipartFile("files", "laptop5.jpg", "image/jpg", imageBytes1);

        byte[] imageBytes2 = Files.readAllBytes(Paths.get("/Users/kangjik/Desktop/laptop4.jpg"));
        MockMultipartFile file2 = new MockMultipartFile("files", "laptop4.jpg", "image/jpg", imageBytes2);

        mockMvc.perform(
                multipart("/api/sell/create")
                        .file(file1)
                        .file(file2)
                        .param("title", "title")
                        .param("content", "content")
                        .param("price", "1000")
                        .param("region", "Seoul")
                        .param("category", "category")
                        .header("Authorization", "Bearer " + token)
        ).andExpect(status().isCreated());
    }


    @Test
    public void testCreateMultipleSells() throws Exception {
        // 사용자 정보와 게시글 정보를 리스트로 생성합니다.
        List<String> emails = Arrays.asList("user1@naver.com", "user2@naver.com", "user3@naver.com");
        List<String> passwords = Arrays.asList("user1user1", "user2user2", "user3user3");
        List<String> titles = Arrays.asList("테스트 게시글1", "테스트 게시글2", "테스트 게시글3");
        List<Integer> prices = Arrays.asList(1000, 2000, 3000);

        for (int i = 0; i < 3; i++) {
            // Step 1: 로그인하고 토큰을 받아옵니다.
            UserLoginForm userLoginForm = new UserLoginForm();
            userLoginForm.setEmail(emails.get(i));
            userLoginForm.setPassword(passwords.get(i));

            MvcResult loginResult = mockMvc.perform(
                    MockMvcRequestBuilders.post("/api/user/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(userLoginForm))
            ).andReturn();

            String loginResponse = loginResult.getResponse().getContentAsString();
            Map<String, String> loginResponseMap = objectMapper.readValue(loginResponse, new TypeReference<Map<String, String>>() {});
            String token = loginResponseMap.get("token");

            // Step 2: 게시글 작성
            byte[] imageBytes = Files.readAllBytes(Paths.get("/Users/kangjik/Desktop/laptop4.jpg"));
            MockMultipartFile file = new MockMultipartFile("file", "laptop4.jpg", "image/jpg", imageBytes);

            mockMvc.perform(
                    multipart("/api/sell/create")
                            .file(file)
                            .param("title", titles.get(i))
                            .param("content", "content")
                            .param("price", String.valueOf(prices.get(i)))
                            .param("region", "Seoul")
                            .param("category", "category")
                            .header("Authorization", "Bearer " + token)
            ).andExpect(status().isCreated());
        }
    }


}
