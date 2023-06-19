package kjkim.kjkimspring.sell;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import kjkim.kjkimspring.comment.Comment;
import kjkim.kjkimspring.user.User;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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

    @NotNull
    private Integer price;

    @ManyToOne
    private User author;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer viewCount;

    @Column(length = 20)
    private String region;

    @ManyToMany
    @JoinTable(
            name = "user_likes_sell",
            joinColumns = @JoinColumn(name = "sell_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIdentityReference(alwaysAsId = true) // otherwise first ref as POJO, others as id
    private Set<User> likedUser;

    @Column(length = 50)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, columnDefinition = "varchar(20) default 'SELLING'")
    private SellState sellState;

    @OneToMany(mappedBy = "sell", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> imageList = new ArrayList<>();

    public List<Image> getImages() {
        return imageList;
    }

    public void addImage(Image image) {
        imageList.add(image);
        image.setSell(this);
    }

    public void removeImage(Image image) {
        imageList.remove(image);
        image.setSell(null);
    }


    public void increaseViewCount() {
        viewCount = viewCount == null ? 1 : viewCount + 1;
    }
}