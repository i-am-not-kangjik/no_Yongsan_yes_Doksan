package kjkim.kjkimspring.jwt;

import org.springframework.security.core.AuthenticationException;

// JWT 인증 중에 발생한 예외를 정의합니다.
public class JwtAuthenticationException extends AuthenticationException {
    public JwtAuthenticationException(String msg, Throwable t) {
        super(msg, t);
    }

    public JwtAuthenticationException(String msg) {
        super(msg);
    }
}