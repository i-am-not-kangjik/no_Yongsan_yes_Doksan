package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.buy.Buy;
import kjkim.kjkimspring.buy.BuyRepository;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.user.SignUp;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public Buy getBuy(Integer id) {
        Optional<Buy> answer = this.buyRepository.findById(id);
        if (answer.isPresent()) {
            return answer.get();
        } else {
            throw new DataNotFoundException("answer not found");
        }
    }

    public void modify(Buy buy, String content) {
        buy.setContent(content);
        this.buyRepository.save(buy);
    }

    public void delete(Buy buy) {
        this.buyRepository.delete(buy);
    }
}
