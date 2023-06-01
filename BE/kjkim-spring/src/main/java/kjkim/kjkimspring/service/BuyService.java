package kjkim.kjkimspring.service;

import kjkim.kjkimspring.buy.Buy;
import kjkim.kjkimspring.buy.BuyRepository;
import kjkim.kjkimspring.sell.Sell;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuyService {
    private final BuyRepository buyRepository;

    public void create(Sell sell, String content) {
        Buy buy = new Buy();
        buy.setContent(content);
        buy.setSell(sell);
        this.buyRepository.save(buy);
    }
}
