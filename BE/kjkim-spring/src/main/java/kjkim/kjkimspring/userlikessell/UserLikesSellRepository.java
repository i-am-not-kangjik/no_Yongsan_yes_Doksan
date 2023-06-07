package kjkim.kjkimspring.userlikessell;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserLikesSellRepository extends JpaRepository<UserLikesSell, Long> {
    List<UserLikesSell> findByUser(User user);
    List<UserLikesSell> findBySell(Sell sell);
    void deleteByUserAndSell(User user, Sell sell);

}
