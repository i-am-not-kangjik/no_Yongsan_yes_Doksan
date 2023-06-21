package kjkim.kjkimspring.jwt;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collections;

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

        if (userDetails != null) {
            JwtAuthenticatedProfile auth = new JwtAuthenticatedProfile(userDetails, token, Collections.singletonList(new SimpleGrantedAuthority(USER_ROLE)));
            return auth;
        }

        throw new JwtAuthenticationException(JWT_EXCEPTION_MESSAGE);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.equals(authentication);
    }
}