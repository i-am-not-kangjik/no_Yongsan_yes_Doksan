package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import kjkim.kjkimspring.user.SignUp;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SellService {

    private final SellRepository sellRepository;

    public List<Sell> getList() {
        return this.sellRepository.findAll();
    }

    public Sell getSell(Integer id) {
        Optional<Sell> sell = this.sellRepository.findById(id);
        if (sell.isPresent()) {
           return sell.get();
        } else {
            throw new DataNotFoundException("sell is not found");
        }
    }

    public void create(String subject, String content, SignUp user) {
        Sell s = new Sell();
        s.setSubject(subject);
        s.setContent(content);
        s.setAuthor(user);
        this.sellRepository.save(s);
    }
}
