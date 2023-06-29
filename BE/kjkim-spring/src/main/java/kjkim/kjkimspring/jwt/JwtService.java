package kjkim.kjkimspring.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;

// JWT 관련 서비스를 제공하는 클래스입니다.
@Service
public class JwtService {
    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final long EXPIRATION_TIME = 60 * 60 * 1000L; // 1 hour

    private final Key secretKey;

    public JwtService() {
        // HS256 알고리즘을 사용하는 비밀키를 생성합니다.
        this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    // UserDetails로부터 JWT 토큰을 생성합니다.
    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(secretKey)
                .compact();
    }

    // HTTP 요청에서 JWT 토큰을 추출합니다.
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTH_HEADER);
        if (bearerToken != null && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    // JWT 토큰의 유효성을 검사합니다.
    public boolean validateToken(String token) {
        try {
            Jws<Claims> claimsJws = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            if (claimsJws.getBody().getExpiration().before(new Date())) {
                return false;
            }
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Expired or invalid JWT token");
        }
    }

    // JWT 토큰으로부터 인증 객체를 생성합니다.
    public Authentication getAuthentication(String token) {
        UserDetails userDetails = this.getUserDetails(token);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // JWT 토큰으로부터 사용자의 정보를 가져옵니다.
    public UserDetails getUserDetails(String token) {
        String username = getUsername(token);

        return User.withUsername(username)
                .password("") // Password is not needed as we are dealing with JWT
                .authorities(new SimpleGrantedAuthority("ROLE_USER")) // Assuming all authenticated users have USER role
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }

    // JWT 토큰으로부터 사용자 이름을 가져옵니다.
    public String getUsername(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}

