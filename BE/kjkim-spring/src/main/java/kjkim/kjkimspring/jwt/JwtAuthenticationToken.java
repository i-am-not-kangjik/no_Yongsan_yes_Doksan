package kjkim.kjkimspring.jwt;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

// JWT 인증 토큰을 나타내는 클래스입니다. 사용자 이름과 비밀번호 대신 JWT 토큰을 가지고 있습니다.
public class JwtAuthenticationToken extends UsernamePasswordAuthenticationToken {
    private String token;

    public JwtAuthenticationToken(String token) {
        super(null, null);
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }
}


