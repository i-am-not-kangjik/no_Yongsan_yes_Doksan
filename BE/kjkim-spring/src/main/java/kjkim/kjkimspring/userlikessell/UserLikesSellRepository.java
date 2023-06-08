package kjkim.kjkimspring.userlikessell;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserLikesSellRepository extends JpaRepository<UserLikesSell, Long> {
    Optional<UserLikesSell> findBySellAndUser(Sell sell, User user);
    List<UserLikesSell> findAllBySell_Id(Integer sellId);
}
