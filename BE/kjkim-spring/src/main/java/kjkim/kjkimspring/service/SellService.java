package kjkim.kjkimspring.service;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SellService {

    private final SellRepository sellRepository;

    public List<Sell> getList() {
        return this.sellRepository.findAll();
    }
}
