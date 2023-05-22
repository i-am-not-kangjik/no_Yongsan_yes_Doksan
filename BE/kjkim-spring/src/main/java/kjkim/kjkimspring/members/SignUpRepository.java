package kjkim.kjkimspring.members;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SignUpRepository extends JpaRepository<SignUp, Long> {
    Optional<SignUp> findByEmail(String email);
}
