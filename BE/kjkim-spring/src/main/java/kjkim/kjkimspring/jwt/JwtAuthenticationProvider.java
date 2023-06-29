package kjkim.kjkimspring.jwt;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collections;


// JWT 인증 공급자. JWT 토큰으로부터 인증 정보를 생성합니다.
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private static final String USER_ROLE = "USER";
    private static final String JWT_EXCEPTION_MESSAGE = "JWT token is not valid";

    private JwtService jwtService;

    public JwtAuthenticationProvider(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
        String token = jwtAuthenticationToken.getToken();

        UserDetails userDetails = jwtService.getUserDetails(token);

        // 토큰에 해당하는 사용자 정보가 있다면 인증 객체를 생성합니다.
        if (userDetails != null) {
            JwtAuthenticatedProfile auth = new JwtAuthenticatedProfile(userDetails, token, Collections.singletonList(new SimpleGrantedAuthority(USER_ROLE)));
            return auth;
        }

        throw new JwtAuthenticationException(JWT_EXCEPTION_MESSAGE);
    }


    @Override
    public boolean supports(Class<?> authentication) {
        // 이 공급자가 처리할 수 있는 인증 타입을 지정합니다.
        return JwtAuthenticationToken.class.equals(authentication);
    }
}