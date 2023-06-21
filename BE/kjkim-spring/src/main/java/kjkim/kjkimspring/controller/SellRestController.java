package kjkim.kjkimspring.controller;

//import kjkim.kjkimspring.comment.CommentForm;

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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sell")
@RequiredArgsConstructor
public class SellRestController {

    private final SellService sellService;
    private final UserService userService;

    // 인증되지 않은 사용자에게 반환할 메시지
    private static final String UNAUTHORIZED_USER_MESSAGE = "수정 권한이 없는 사용자입니다.";

    /**
     * 인증된 사용자가 판매 항목을 조작할 권한이 있는지 확인합니다.
     * 권한이 있다면, 판매 항목을 반환합니다.
     * 권한이 없다면, ResponseStatusException을 발생시킵니다.
     *
     * @param id        판매 항목의 ID입니다.
     * @param principal 보안 주체(principal)입니다.
     * @return 판매 항목입니다.
     */
    private Sell getSellAndCheckAuth(Integer id, Principal principal) {
        User user = getAuthenticatedUser(principal);
        Sell sell = sellService.getSell(id);
        if (!sell.getAuthor().equals(user)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, UNAUTHORIZED_USER_MESSAGE);
        }
        return sell;
    }

    /**
     * 주어진 Principal에 기반하여 인증된 사용자를 반환합니다.
     *
     * @param principal 보안 주체(principal)입니다.
     * @return 인증된 사용자 객체입니다.
     */
    private User getAuthenticatedUser(Principal principal) {
        return userService.getUser(principal.getName());
    }


    /**
     * HTTP GET 요청을 처리하여 판매 항목 리스트를 반환합니다.
     *
     * @return 판매 항목 리스트를 담은 응답 엔티티입니다.
     */
    @GetMapping("")
    public ResponseEntity<List<SellDTO>> getSellList() {
        // 판매 목록을 가져와서 DTO로 변환한 후 리스트로 만듭니다.
        List<SellDTO> sellList = sellService.getList().stream()
                .map(sell -> sellService.convertToDTO(sell))
                .collect(Collectors.toList());
        return ResponseEntity.ok(sellList);
    }


    @GetMapping("/{id}")
    public ResponseEntity<SellDTO> getSellDetail(@PathVariable("id") Integer id) {
        Sell sell = sellService.getSell(id);
        sell.increaseViewCount(); // Increase view count
        sellService.saveSell(sell); // Save the updated Sell object

        Sell updatedSell = sellService.getSell(id); // Get the updated Sell object

        SellDTO sellDTO = sellService.convertToDTO(updatedSell);
        return ResponseEntity.ok(sellDTO);
    }



    @PreAuthorize("isAuthenticated()")
    @PostMapping("")
    public ResponseEntity<Void> createSell(@Valid SellForm sellForm,
                                           Principal principal,
                                           @RequestParam("files") List<MultipartFile> uploads) throws IOException {
        User user = getAuthenticatedUser(principal);
        sellService.create(sellForm.getTitle(), sellForm.getContent(), sellForm.getPrice(),
                sellForm.getRegion(), sellForm.getCategory(), user, uploads);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    /**
     * HTTP PUT 요청을 처리하여 기존의 판매 항목을 수정합니다.
     * 이 작업은 사용자가 인증되어 있으며 해당 판매 항목의 작성자인 경우에만 가능합니다.
     *
     * @param sellForm  폼 데이터입니다.
     * @param id        판매 항목의 ID입니다.
     * @param principal 보안 주체(principal)입니다.
     * @param uploads   업로드된 파일들의 목록입니다.
     * @return 응답 엔티티입니다.
     * @throws IOException 입출력 오류가 발생한 경우.
     */
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSell(@Valid SellForm sellForm,
                                           @PathVariable("id") Integer id,
                                           Principal principal,
                                           @RequestParam("files") List<MultipartFile> uploads) throws IOException {
        Sell sell = getSellAndCheckAuth(id, principal);  // Method reused
        sellService.modify(sell, sellForm.getTitle(), sellForm.getContent(), sellForm.getPrice(),
                sellForm.getRegion(), sellForm.getCategory(), uploads);
        return ResponseEntity.ok().build();
    }




    /**
     * HTTP DELETE 요청을 처리하여 기존의 판매 항목을 삭제합니다.
     * 이 작업은 사용자가 인증되어 있으며 해당 판매 항목의 작성자인 경우에만 가능합니다.
     *
     * @param id        판매 항목의 ID입니다.
     * @param principal 보안 주체(principal)입니다.
     * @return 응답 엔티티입니다.
     */

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSell(@PathVariable("id") Integer id, Principal principal) {
        Sell sell = getSellAndCheckAuth(id, principal);  // Method reused
        sellService.delete(sell);
        return ResponseEntity.ok().build();
    }


    // 판매 항목에 좋아요를 토글하는 API
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeSell(@PathVariable("id") Integer id, Principal principal) {
        Sell sell = sellService.getSell(id);
        User user = getAuthenticatedUser(principal); // Applied here

        // 좋아요 상태를 토글합니다.
        sellService.toggleLike(sell, user);

        return ResponseEntity.ok().build();
    }

    /**
     * HTTP PUT 요청을 처리하여 판매 항목의 상태를 변경합니다.
     * 이 작업은 사용자가 인증되어 있으며 해당 판매 항목의 작성자인 경우에만 가능합니다.
     *
     * @param id        판매 항목의 ID입니다.
     * @param status    새로운 상태입니다.
     * @param principal 보안 주체(principal)입니다.
     * @return 응답 엔티티입니다.
     */
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<Void> changeSellStatus(@PathVariable("id") Integer id,
                                                 @PathVariable("status") String status,
                                                 Principal principal) {
        Sell sell = getSellAndCheckAuth(id, principal);
        sellService.changeSellStatus(sell, status);
        return ResponseEntity.ok().build();
    }




}
