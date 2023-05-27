package kjkim.kjkimspring.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SignUpRepository extends JpaRepository<SignUp, Long> {
    SignUp findByUsername(String username);
}
