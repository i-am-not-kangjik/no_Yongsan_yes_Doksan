package kjkim.kjkimspring.restcontroller;

import kjkim.kjkimspring.comment.CommentForm;
import kjkim.kjkimspring.dto.SellDTO;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.service.SellService;
import kjkim.kjkimspring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SellRestController {

    private final SellService sellService;
    private final UserService userService;

    @GetMapping("/sell")
    public Page<SellDTO> sell(@RequestParam(value = "page", defaultValue = "0") int page) {
        return this.sellService.getList(page).map(sell -> sellService.convertToDTO(sell));
    }

    @Transactional
    @GetMapping(value = "/sell/{id}")
    public SellDTO detail(@PathVariable("id") Integer id, CommentForm commentForm) {
        Sell sell = this.sellService.getSell(id);
        sell.increaseViewCount(); // Increase view count
        this.sellService.saveSell(sell); // Save the updated Sell object

        Sell updatedSell = this.sellService.getSell(id); // Get the updated Sell object

        return sellService.convertToDTO(updatedSell);
    }
}
