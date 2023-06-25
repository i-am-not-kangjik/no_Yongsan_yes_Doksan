package kjkim.kjkimspring.message;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import kjkim.kjkimspring.user.User;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Setter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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

//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        Message message = (Message) o;
//        return Objects.equals(id, message.id);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(id);
//    }
}
