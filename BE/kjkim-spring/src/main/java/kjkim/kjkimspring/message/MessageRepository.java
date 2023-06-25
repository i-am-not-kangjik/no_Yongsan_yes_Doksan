package kjkim.kjkimspring.message;

import kjkim.kjkimspring.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiver(User receiver);
    List<Message> findBySender(User sender);
    Optional<Message> findById(Long id);
}


