package kjkim.kjkimspring.controller;

import kjkim.kjkimspring.comment.CommentForm;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellForm;
import kjkim.kjkimspring.service.SellService;
import kjkim.kjkimspring.service.UserService;
import kjkim.kjkimspring.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.io.IOException;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class SellController {

    private final SellService sellService;
    private final UserService userService;

    @GetMapping("/sell")
    public String sell(Model model, @RequestParam(value = "page", defaultValue = "0") int page) {
        Page<Sell> sellList = this.sellService.getList(page);
        model.addAttribute("sellList", sellList);
        return "sell_list";
    }

    @GetMapping(value = "/sell/{id}")
    public String detail(Model model, @PathVariable("id") Integer id, CommentForm commentForm) {
        Sell sell = this.sellService.getSell(id);
        sell.increaseViewCount(); // Increase view count
        this.sellService.saveSell(sell); // Save the updated Sell object
        model.addAttribute("sell", sell);
        return "sell_detail";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/sell/create")
    public String sellCreate(SellForm sellForm) {
        return "sell_form";
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/sell/create")
    public String sellCreate(@Valid SellForm sellForm, BindingResult bindingResult, Principal principal, MultipartFile upload) throws IOException {
        if (bindingResult.hasErrors()) {
            return "sell_form";
        }
        User user = this.userService.getUser(principal.getName());
        this.sellService.create(sellForm.getTitle(), sellForm.getContent(), sellForm.getPrice(), user, upload);
        return "redirect:/sell";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/sell/modify/{id}")
    public String sellModify(Model model, SellForm sellForm, @PathVariable("id") Integer id, Principal principal) {
        Sell sell = this.sellService.getSell(id);
        if (!sell.getAuthor().getUsername().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정 권한이 없는 사용자입니다.");
        } else {
            sellForm.setTitle(sell.getTitle());
            sellForm.setContent(sell.getContent());
            sellForm.setPrice(sell.getPrice());
            String originalFileName = sell.getImgName();
            model.addAttribute("filename", originalFileName);
            return "sell_form";
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/sell/modify/{id}")
    public String sellModify(@Valid SellForm sellForm, BindingResult bindingResult,
                             @PathVariable("id") Integer id, Principal principal, MultipartFile upload) throws IOException {
        if (bindingResult.hasErrors()) {
            return "sell_form";
        }

        Sell sell = this.sellService.getSell(id);
        if (!sell.getAuthor().getUsername().equals(principal.getName())) {
            throw new  ResponseStatusException(HttpStatus.BAD_REQUEST, "수정 권한이 없는 사용자입니다.");
        } else {
            this.sellService.modify(sell, sellForm.getTitle(), sellForm.getContent(), sellForm.getPrice(), upload);
            return String.format("redirect:/sell/%s", id);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/sell/delete/{id}")
    public String sellDelete(Principal principal, @PathVariable("id") Integer id) {
        Sell sell = this.sellService.getSell(id);
        if (!sell.getAuthor().getUsername().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "삭제 권한이 없는 사용자입니다.");
        } else {
            this.sellService.delete(sell);;
            return "redirect:/";
        }
    }
}
