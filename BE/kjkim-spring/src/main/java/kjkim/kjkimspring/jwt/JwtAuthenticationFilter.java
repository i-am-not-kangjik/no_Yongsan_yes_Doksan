package kjkim.kjkimspring.jwt;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;


// HTTP 요청이 들어올 때마다 실행되며, JWT 토큰을 검증하고 인증 정보를 설정합니다.
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String DEFAULT_ROLE = "ROLE_USER";

    private JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // JWT 토큰을 추출하고 검증합니다.
            String token = jwtService.resolveToken(request);
            if (token != null && jwtService.validateToken(token)) {
                // 토큰이 유효하다면 인증 정보를 설정합니다.
                Authentication auth = getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
            // 예외가 발생했다면 인증 정보를 초기화합니다.
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);
    }

    private Authentication getAuthentication(String token) {
        UserDetails userDetails = getUserDetails(token);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    private UserDetails getUserDetails(String token) {
        String username = jwtService.getUsername(token);

        return User.withUsername(username)
                .password("") // Password is not needed as we are dealing with JWT
                .authorities(new SimpleGrantedAuthority(DEFAULT_ROLE)) // Assuming all authenticated users have USER role
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}