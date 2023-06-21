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

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().and()  // Add this line
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/user/signup", "/api/user/login").permitAll()
                .antMatchers(HttpMethod.GET, "/api/sell", "/api/sell/**").permitAll() // "/api/sell"와 "/api/sell/{id}"에 대해서 인가 없이 접근 허용
                .antMatchers(HttpMethod.POST, "/api/sell/**").authenticated() // "/api/sell"와 "/api/sell/{id}"에 대한 POST 요청에 대해서는 인증된 사용자만 접근 가능
                .antMatchers(HttpMethod.PUT, "/api/sell/**").authenticated() // "/api/sell/{id}"에 대한 PUT 요청에 대해서는 인증된 사용자만 접근 가능
                .antMatchers(HttpMethod.DELETE, "/api/sell/**").authenticated() // "/api/sell/{id}"에 대한 DELETE 요청에 대해서는 인증된 사용자만 접근 가능
                .antMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
                .and()
                .addFilterBefore(new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class)
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(new JwtAuthenticationProvider(jwtService));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}


