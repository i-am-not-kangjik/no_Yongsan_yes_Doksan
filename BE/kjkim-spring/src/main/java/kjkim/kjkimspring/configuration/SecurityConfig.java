package kjkim.kjkimspring.configuration;

import kjkim.kjkimspring.jwt.JwtAuthenticationFilter;
import kjkim.kjkimspring.jwt.JwtAuthenticationProvider;
import kjkim.kjkimspring.jwt.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtService jwtService;

    @Autowired
    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // HTTP 보안 설정
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().and() // Cross-origin resource sharing 설정 활성화
                .csrf().disable() // CSRF 보안 비활성화
                .authorizeRequests() // 요청에 대한 권한 부여
                .antMatchers("/api/user/signup", "/api/user/login").permitAll() // 회원 가입 및 로그인 API는 모두 허용
                .antMatchers(HttpMethod.GET, "/api/sell", "/api/sell/**").permitAll() // 판매 관련 API는 GET 메소드에 대해 모두 허용
                .antMatchers(HttpMethod.POST, "/api/sell/**").authenticated() // 판매 관련 API는 POST 메소드에 대해 인증된 사용자만 허용
                .antMatchers(HttpMethod.PUT, "/api/sell/**").authenticated() // 판매 관련 API는 PUT 메소드에 대해 인증된 사용자만 허용
                .antMatchers(HttpMethod.DELETE, "/api/sell/**").authenticated() // 판매 관련 API는 DELETE 메소드에 대해 인증된 사용자만 허용
                .antMatchers(HttpMethod.POST, "/api/messages").authenticated() // POST /api/messages는 인증된 사용자만 허용
                .antMatchers("/api/**").authenticated() // 그 외 API는 인증된 사용자만 허용
                .anyRequest().permitAll() // 나머지 요청에 대해 모두 허용
                .and()
                .addFilterBefore(new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class) // JWT 필터 추가
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS); // 세션 정책은 STATELESS (비상태)로 설정
    }

    // 인증 제공자 설정
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(new JwtAuthenticationProvider(jwtService));
    }

    // 비밀번호 암호화를 위한 빈 생성
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 인증 관리자 빈 생성
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}


