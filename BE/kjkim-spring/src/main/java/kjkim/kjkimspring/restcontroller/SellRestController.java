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
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/sell")
@RequiredArgsConstructor
public class SellRestController {

    private final SellService sellService;
    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<Page<SellDTO>> getSellList(@RequestParam(value = "page", defaultValue = "0") int page) {
        Page<SellDTO> sellList = sellService.getList(page).map(sell -> sellService.convertToDTO(sell));
        return ResponseEntity.ok(sellList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SellDTO> getSellDetail(@PathVariable("id") Integer id, CommentForm commentForm) {
        Sell sell = sellService.getSell(id);
        sell.increaseViewCount(); // Increase view count
        sellService.saveSell(sell); // Save the updated Sell object

        Sell updatedSell = sellService.getSell(id); // Get the updated Sell object

        SellDTO sellDTO = sellService.convertToDTO(updatedSell);
        return ResponseEntity.ok(sellDTO);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create")
    public ResponseEntity<Void> createSell(@Valid SellForm sellForm,
                                           Principal principal,
                                           @RequestParam("file") MultipartFile upload) throws IOException {
        User user = userService.getUser(principal.getName());
        sellService.create(sellForm.getTitle(), sellForm.getContent(), sellForm.getPrice(), sellForm.getRegion(),
                sellForm.getCategory(), user, upload);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

//    @PreAuthorize("isAuthenticated()")
//    @PutMapping("/{id}")
//    public ResponseEntity<Void> updateSell(@Valid SellForm sellForm,
//                                           @PathVariable("id") Integer id,
//                                           Principal principal,
//                                           @RequestParam("file") MultipartFile upload) throws IOException {
//        Sell sell = sellService.getSell(id);
//        if (!sell.getAuthor().getUsername().equals(principal.getName())) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정 권한이 없는 사용자입니다.");
//        } else {
//            sellService.modify(sell, sellForm.getTitle(), sellForm.getContent(), sellForm.getPrice(),
//                    sellForm.getRegion(), sellForm.getCategory(), upload);
//            return ResponseEntity.ok().build();
//        }
//    }

//    @PreAuthorize("isAuthenticated()")
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteSell(@PathVariable("id") Integer id, Principal principal) {
//        Sell sell = sellService.getSell(id);
//        if (!sell.getAuthor().getUsername().equals(principal.getName())) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "삭제 권한이 없는 사용자입니다.");
//        } else {
//            sellService.delete(sell);
//            return ResponseEntity.ok().build();
//        }
//    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeSell(@PathVariable("id") Integer id, Principal principal) {
        Sell sell = sellService.getSell(id);
        User user = userService.getUser(principal.getName());

        // 좋아요 상태를 토글합니다.
        sellService.toggleLike(sell, user);

        return ResponseEntity.ok().build();
    }

    // 기타 엔드포인트 구현...

}
