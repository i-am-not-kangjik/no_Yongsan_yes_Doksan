package kjkim.kjkimspring.userlikessell;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.user.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
public class UserLikesSell {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Sell sell;
}
