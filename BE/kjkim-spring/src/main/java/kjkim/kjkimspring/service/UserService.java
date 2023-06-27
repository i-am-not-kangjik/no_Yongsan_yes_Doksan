package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.user.UserRepository;
import kjkim.kjkimspring.userlikessell.UserLikesSell;
import kjkim.kjkimspring.userlikessell.UserLikesSellRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.function.Function;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SellRepository sellRepository;
    private final UserLikesSellRepository userLikesSellRepository;

    public User create(String username, String email, String password, String phonenumber, String fullname) {
        // 사용자 세부 사항 설정
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // 비밀번호는 저장하기 전에 인코딩됩니다.
        user.setPhoneNumber(phonenumber);
        user.setFullName(fullname);
        this.userRepository.save(user); // 사용자 저장소에 사용자를 저장합니다.
        return user;
    }

    public User getUserByUsername(String username) {
        // 사용자명으로 사용자를 검색합니다. 사용자가 없으면 예외를 던집니다.
        return this.userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("User is not found"));
    }

    private User getUserOrElseThrow(String identifier, Function<String, Optional<User>> finder) {
        // 주어진 식별자(사용자명, 이메일)로 사용자를 검색하는 일반적인 메서드
        // 사용자가 없으면 예외를 던집니다.
        return finder.apply(identifier)
                .orElseThrow(() -> new DataNotFoundException("User is not found"));
    }

    public void addLike(User user, Sell sell) {
        // 사용자와 판매 세부 정보 설정
        UserLikesSell userLikesSell = new UserLikesSell();
        userLikesSell.setUser(user);
        userLikesSell.setSell(sell);
        userLikesSellRepository.save(userLikesSell); // 좋아요 관계를 저장소에 저장합니다.
    }
    public User findByEmail(String email) {
        // 이메일로 사용자를 검색합니다. 사용자가 없으면 예외를 던집니다.
        return this.userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("User with email " + email + " not found"));
    }

    public boolean existsByEmail(String email) {
        // 주어진 이메일을 가진 사용자가 있는지 확인합니다.
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        // 주어진 사용자명을 가진 사용자가 있는지 확인합니다.
        return userRepository.existsByUsername(username);
    }

    public boolean existsByPhoneNumber(String phoneNumber) {
        // 주어진 전화번호를 가진 사용자가 있는지 확인합니다.
        return userRepository.existsByPhoneNumber(phoneNumber);
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
