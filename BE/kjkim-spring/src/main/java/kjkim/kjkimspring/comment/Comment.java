//package kjkim.kjkimspring.comment;
//
//import kjkim.kjkimspring.sell.Sell;
//import kjkim.kjkimspring.user.User;
//import lombok.Getter;
//import lombok.Setter;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//
//import javax.persistence.*;
//import java.time.LocalDateTime;
//
//@Getter
//@Setter
//@Entity
//
//public class Comment {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//
//    @Column(columnDefinition = "TEXT")
//    private String content;
//
//    @CreationTimestamp
//    @Column
//    private LocalDateTime createdAt;
//
//    @UpdateTimestamp
//    @Column
//    private LocalDateTime updatedAt;
//
//    @ManyToOne
//    private Sell sell;
//
//    @ManyToOne
//    private User author;
//}
