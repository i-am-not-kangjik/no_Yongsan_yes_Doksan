package kjkim.kjkimspring.message;

import kjkim.kjkimspring.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiverAndIsReadAndIsDeletedByReceiver(User receiver, boolean isRead, boolean isDeleted);
    List<Message> findByReceiverAndIsDeletedByReceiver(User receiver, boolean isDeleted);
    List<Message> findBySenderAndIsDeletedBySender(User sender, boolean isDeleted);
}

