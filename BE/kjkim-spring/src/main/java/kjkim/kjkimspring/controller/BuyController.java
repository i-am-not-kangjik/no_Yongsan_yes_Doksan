package kjkim.kjkimspring.controller;

import kjkim.kjkimspring.buy.BuyForm;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.service.BuyService;
import kjkim.kjkimspring.service.SellService;
import kjkim.kjkimspring.service.UserService;
import kjkim.kjkimspring.user.SignUp;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class BuyController {
    private final SellService sellService;
    private final BuyService buyService;
    private final UserService userService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = "/buy/{id}")
    public String buy(Model model, @PathVariable("id") Integer id, @Valid BuyForm buyForm, BindingResult bindingResult, Principal principal) {
        Sell sell = this.sellService.getSell(id);
        SignUp signUp = this.userService.getUser(principal.getName());
        if (bindingResult.hasErrors()) {
            model.addAttribute("sell", sell);
            return "sell_detail";
        }

        this.buyService.create(sell, buyForm.getContent(), signUp);
        return String.format("redirect:/sell/%s", id);
    }
}
