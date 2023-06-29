package kjkim.kjkimspring.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Cross-Origin Resource Sharing (CORS) 설정
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // "/api/**" 경로에 대해 CORS 설정 적용
                .allowedOrigins("http://localhost:3000", "http://13.124.46.240:3000")// 허용된 출처는 "http://localhost:3000"
                .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS") // 허용된 HTTP 메소드는 "GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"
                .allowedHeaders("*") // 모든 요청 헤더 허용
                .allowCredentials(true); // 인증정보를 포함한 요청 허용
    }
}
