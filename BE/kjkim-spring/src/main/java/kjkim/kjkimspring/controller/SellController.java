package kjkim.kjkimspring.controller;

import kjkim.kjkimspring.buy.BuyForm;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellForm;
import kjkim.kjkimspring.service.SellService;
import kjkim.kjkimspring.service.UserService;
import kjkim.kjkimspring.user.SignUp;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class SellController {

    private final SellService sellService;
    private final UserService userService;

    @GetMapping("/sell")
    public String sell(Model model) {
        List<Sell> sellList = this.sellService.getList();
        model.addAttribute("sellList", sellList);
        return "sell_list";
    }

    @GetMapping(value = "/sell/{id}")
    public String detail(Model model, @PathVariable("id") Integer id, BuyForm buyForm) {
        Sell sell = this.sellService.getSell(id);
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
    public String sellCreate(@Valid SellForm sellForm, BindingResult bindingResult, Principal principal) {
        if (bindingResult.hasErrors()) {
            return "sell_form";
        }
        SignUp signUp = this.userService.getUser(principal.getName());
        this.sellService.create(sellForm.getSubject(), sellForm.getContent(), sellForm.getPrice(),signUp);
        return "redirect:/sell";
    }
}
