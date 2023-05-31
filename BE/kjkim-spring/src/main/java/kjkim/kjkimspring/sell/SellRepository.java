package kjkim.kjkimspring.sell;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SellRepository extends JpaRepository<Sell, Integer> {
    Sell findBySubject(String subject);
}
