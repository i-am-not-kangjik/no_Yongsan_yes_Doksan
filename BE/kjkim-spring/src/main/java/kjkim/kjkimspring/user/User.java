package kjkim.kjkimspring.user;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import kjkim.kjkimspring.message.Message;
import kjkim.kjkimspring.userlikessell.UserLikesSell;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@Entity
@Table(name = "\"member\"")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 255)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 20, nullable = false, unique = true)
    private String phoneNumber;

    @Column(length = 20)
    private String oauthProvider;

    @Column(length = 255)
    private String oauthId;

    @Column(length = 20)
    private String fullName;

    @CreationTimestamp
    @Column
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<UserLikesSell> likedSells;

    @OneToMany(mappedBy = "sender")
    private List<Message> sentMessages;

    @OneToMany(mappedBy = "receiver")
    private List<Message> receivedMessages;
}