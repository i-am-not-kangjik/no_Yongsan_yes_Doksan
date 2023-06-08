package kjkim.kjkimspring.repository;

import kjkim.kjkimspring.comment.Comment;
import kjkim.kjkimspring.comment.CommentRepository;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class SellAndCommentRepositoryTest {

    @Autowired
    private SellRepository sellRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Test
    void testJpa_1() {
        Sell s1 = new Sell();
        s1.setTitle("자전거 판매합니다.");
        s1.setContent("자전거 급매로 내놓습니다.");
        this.sellRepository.save(s1);

        Sell s2 = new Sell();
        s2.setTitle("갤럭시 S22 판매합니다.");
        s2.setContent("갤럭시 S22 급매로 내놓습니다. 얼른 구입하세요!");
        this.sellRepository.save(s2);
    }

    @Test
    void testJpa_2() {
        List<Sell> all = this.sellRepository.findAll();
        assertEquals(12, all.size());

        Sell s = all.get(0);
        assertEquals("자전거 판매합니다.", s.getTitle());
    }

    @Test
    void testJpa_3() {
        Optional<Sell> os = this.sellRepository.findById(1);
        if(os.isPresent()) {
            Sell s = os.get();
            assertEquals("자전거 급매로 내놓습니다.", s.getContent());
        }
    }

    @Test
    void testJpa_4() {
        Sell s = this.sellRepository.findByTitle("갤럭시 S22 판매합니다.");
        assertEquals(16, s.getId());
    }

    @Test
    void testJpa_5() {
        Optional<Sell> os = this.sellRepository.findById(17);
        assertTrue(os.isPresent());
        Sell s = os.get();
        s.setTitle("자전거 초초초초초초초초 급처합니다. 가격 다운!");
        this.sellRepository.save(s);
    }

    @Test
    void testJpa_6() {
        assertEquals(2, this.sellRepository.count());
        Optional<Sell> os = this.sellRepository.findById(17);
        assertTrue(os.isPresent());
        Sell s = os.get();
        this.sellRepository.delete(s);
        assertEquals(1, this.sellRepository.count());
    }

    @Test
    void testJpa_7() {
        Optional<Sell> os = this.sellRepository.findById(18);
        assertTrue(os.isPresent());
        Sell s = os.get();

        Comment b = new Comment();
        b.setContent("10만원도 비싼데 제가 5만원에 살게요");
        b.setSell(s);
        this.commentRepository.save(b);
    }

    @Test
    void testJpa_8() {
        Optional<Comment> ob = this.commentRepository.findById(1);
        assertTrue(ob.isPresent());
        Comment b = ob.get();
        assertEquals(18, b.getSell().getId());
    }

    @Test
    void testJpa_9() {
        for (int i = 1; i <= 100; i++) {
            Sell s = new Sell();
            s.setTitle(String.format("테스트 판매글 [%03d]", i));
            s.setContent("내용 없음");
            s.setPrice(5000);
            this.sellRepository.save(s);
        }
    }

    @Test
    void testJpa_10() {
        for (int i = 101; i <= 200; i++) {
            Sell s = new Sell();
            s.setTitle(String.format("테스트 판매글 [%03d]", i));
            s.setContent("내용 음슴");
            s.setPrice(5000);
            this.sellRepository.save(s);
        }
    }
}
