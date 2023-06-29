package kjkim.kjkimspring.jwt;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

// JWT를 사용하여 인증된 사용자의 프로필 정보를 저장합니다.
public class JwtAuthenticatedProfile extends UsernamePasswordAuthenticationToken {
    public JwtAuthenticatedProfile(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }
}