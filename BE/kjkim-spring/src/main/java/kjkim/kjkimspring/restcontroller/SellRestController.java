package kjkim.kjkimspring.restcontroller;

import kjkim.kjkimspring.comment.CommentForm;
import kjkim.kjkimspring.dto.SellDTO;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellForm;
import kjkim.kjkimspring.service.SellService;
import kjkim.kjkimspring.service.UserService;
import kjkim.kjkimspring.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.io.IOException;
import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sell")
public class SellRestController {

    private final SellService sellService;
    private final UserService userService;

    @GetMapping("/")
    public Page<SellDTO> sell(@RequestParam(value = "page", defaultValue = "0") int page) {
        return this.sellService.getList(page).map(sell -> sellService.convertToDTO(sell));
    }

    @Transactional
    @GetMapping(value = "/{id}")
    public SellDTO detail(@PathVariable("id") Integer id, CommentForm commentForm) {
        Sell sell = this.sellService.getSell(id);
        sell.increaseViewCount(); // Increase view count
        this.sellService.saveSell(sell); // Save the updated Sell object

        Sell updatedSell = this.sellService.getSell(id); // Get the updated Sell object

        return sellService.convertToDTO(updatedSell);
    }
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create")
    public ResponseEntity<?> sellCreate(@RequestBody @Valid SellForm sellForm,
                                        Principal principal, MultipartFile upload) {
        try {
            User user = this.userService.getUser(principal.getName());
            this.sellService.create(sellForm.getTitle(),
                    sellForm.getContent(),
                    sellForm.getPrice(),
                    sellForm.getRegion(),
                    sellForm.getCategory(),
                    user,
                    upload);
            return new ResponseEntity<>("Sell post successfully created", HttpStatus.CREATED);
        } catch (IOException e) {
            // Return a 500 Internal Server Error HTTP status code and a message
            return new ResponseEntity<>("Could not save file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Return a 400 Bad Request HTTP status code and a message
            return new ResponseEntity<>("Could not create sell: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
