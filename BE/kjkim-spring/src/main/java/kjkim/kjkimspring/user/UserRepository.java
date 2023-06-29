package kjkim.kjkimspring.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    User findByUsernameAndEmail(String username, String email);
    List<User> findByEmailLike(String email);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    boolean existsByPhoneNumber(String phoneNumber);
}
