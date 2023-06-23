package kjkim.kjkimspring.message;

import kjkim.kjkimspring.user.User;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User sender;

    @ManyToOne
    private User receiver;

    @Column(nullable = false)
    private String content;

    @Column
    private boolean isRead = false;

    @Column
    private boolean isDeletedBySender = false;

    @Column
    private boolean isDeletedByReceiver = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void setIsDeletedBySender(boolean isDeletedBySender) {
        this.isDeletedBySender = isDeletedBySender;
    }

    public void setIsDeletedByReceiver(boolean isDeletedByReceiver) {
        this.isDeletedByReceiver = isDeletedByReceiver;
    }
}
