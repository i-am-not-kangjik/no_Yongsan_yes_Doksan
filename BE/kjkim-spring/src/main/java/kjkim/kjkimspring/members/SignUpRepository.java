package kjkim.kjkimspring.members;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SignUpRepository extends JpaRepository<SignUp, Long> {
    SignUp findByName(String name);
    SignUp findByNameAndEmail(String name, String email);
    List<SignUp> findByEmailLike(String email);
}
