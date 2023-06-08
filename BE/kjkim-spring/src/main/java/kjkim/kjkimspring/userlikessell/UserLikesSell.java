package kjkim.kjkimspring.userlikessell;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.user.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "user_likes_sell")
public class UserLikesSell {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_likes_sell_seq_gen")
    @SequenceGenerator(name = "user_likes_sell_seq_gen", sequenceName = "user_likes_sell_id_seq")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // Specify a unique name for the join column
    private User user;

    @ManyToOne
    @JoinColumn(name = "sell_id") // Specify a unique name for the join column
    private Sell sell;
}
