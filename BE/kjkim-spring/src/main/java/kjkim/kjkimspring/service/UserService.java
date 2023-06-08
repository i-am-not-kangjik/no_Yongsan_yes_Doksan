package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.user.UserRepository;
import kjkim.kjkimspring.userlikessell.UserLikesSell;
import kjkim.kjkimspring.userlikessell.UserLikesSellRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SellRepository sellRepository;
    private final UserLikesSellRepository userLikesSellRepository;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, SellRepository sellRepository, UserLikesSellRepository userLikesSellRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sellRepository = sellRepository;
        this.userLikesSellRepository = userLikesSellRepository;
    }

    public User create(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        this.userRepository.save(user);
        return user;
    }

    public User getUser(String username) {
        Optional<User> user = this.userRepository.findByUsername(username);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new DataNotFoundException("user is not found");
        }
    }

    public void addLike(User user, Sell sell) {
        UserLikesSell userLikesSell = new UserLikesSell();
        userLikesSell.setUser(user);
        userLikesSell.setSell(sell);
        userLikesSellRepository.save(userLikesSell);
    }

//    public void likeSell(User user, Sell sell) {
//        addLike(user, sell);
//        sell.setLikeCount(sell.getLikeCount() + 1);
//        sellRepository.save(sell); // 변경 내용 저장
//    }
//
//    public void removeLike(User user, Sell sell) {
//        userLikesSellRepository.deleteByUserAndSell(user, sell);
//        sell.setLikeCount(sell.getLikeCount() - 1);
//        sellRepository.save(sell); // 변경 내용 저장
//    }

}
