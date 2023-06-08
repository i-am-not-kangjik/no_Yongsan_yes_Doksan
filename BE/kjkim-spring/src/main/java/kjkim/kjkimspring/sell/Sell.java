package kjkim.kjkimspring.sell;

import kjkim.kjkimspring.comment.Comment;
import kjkim.kjkimspring.user.User;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class Sell {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "sell", cascade = CascadeType.REMOVE)
    private List<Comment> commentList;

    private String imgName;

    private String imgPath;

    private String oriImgName;

    @NotNull
    private Integer price;

    @ManyToOne
    private User author;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer viewCount;

    @Column(length = 20)
    private String region;

//    @Column(nullable = false, columnDefinition = "integer default 0")
//    private Integer likeCount;

    @ManyToMany
    Set<User> likedUser;

    public void increaseViewCount() {
        viewCount = viewCount == null ? 1 : viewCount + 1;
    }
}
