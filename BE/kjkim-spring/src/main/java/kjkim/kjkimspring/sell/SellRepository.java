package kjkim.kjkimspring.sell;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellRepository extends JpaRepository<Sell, Integer> {
    Sell findByTitle(String title);
    Page<Sell> findAll(Pageable pageable);
}
