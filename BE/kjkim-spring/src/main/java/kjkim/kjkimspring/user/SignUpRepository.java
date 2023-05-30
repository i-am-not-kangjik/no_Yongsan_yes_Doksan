package kjkim.kjkimspring.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SignUpRepository extends JpaRepository<SignUp, Long> {
    Optional<SignUp> findByUsername(String username);
    SignUp findByUsernameAndEmail(String username, String email);
    List<SignUp> findByEmailLike(String email);
}
