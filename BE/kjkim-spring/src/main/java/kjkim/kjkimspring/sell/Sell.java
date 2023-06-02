package kjkim.kjkimspring.sell;

import kjkim.kjkimspring.buy.Buy;
import kjkim.kjkimspring.user.SignUp;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
public class Sell {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "sell", cascade = CascadeType.REMOVE)
    private List<Buy> buyList;

    private String imgName;

    private String imgPath;

    @NotNull
    private Integer price;

    @ManyToOne
    private SignUp author;
}
