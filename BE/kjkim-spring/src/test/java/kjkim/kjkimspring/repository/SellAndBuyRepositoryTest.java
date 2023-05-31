package kjkim.kjkimspring.repository;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SellAndBuyRepositoryTest {

    @Autowired
    private SellRepository sellRepository;

    @Test
    void testJpa_1() {
        Sell s1 = new Sell();
        s1.setSubject("자전거 판매합니다.");
        s1.setContent("자전거 급매로 내놓습니다.");
        this.sellRepository.save(s1);

        Sell s2 = new Sell();
        s2.setSubject("갤럭시 S22 판매합니다.");
        s2.setContent("갤럭시 S22 급매로 내놓습니다. 얼른 구입하세요!");
        this.sellRepository.save(s2);
    }
}
