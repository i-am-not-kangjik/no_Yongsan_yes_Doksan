package kjkim.kjkimspring.service;

import kjkim.kjkimspring.buy.Buy;
import kjkim.kjkimspring.buy.BuyRepository;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.user.SignUp;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuyService {
    private final BuyRepository buyRepository;

    public void create(Sell sell, String content, SignUp author) {
        Buy buy = new Buy();
        buy.setContent(content);
        buy.setSell(sell);
        buy.setAuthor(author);
        this.buyRepository.save(buy);
    }
}
