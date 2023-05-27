package kjkim.kjkimspring.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SignUpRepository extends JpaRepository<SignUp, Long> {
    SignUp findByUsername(String username);
    SignUp findByUsernameAndEmail(String username, String email);
    List<SignUp> findByEmailLike(String email);
}
