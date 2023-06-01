package kjkim.kjkimspring.controller;

import kjkim.kjkimspring.buy.BuyForm;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.service.BuyService;
import kjkim.kjkimspring.service.SellService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;

@Controller
@RequiredArgsConstructor
public class BuyController {
    private final SellService sellService;
    private final BuyService buyService;

    @PostMapping(value = "/buy/{id}")
    public String buy(Model model, @PathVariable("id") Integer id, @Valid BuyForm buyForm, BindingResult bindingResult) {
        Sell sell = this.sellService.getSell(id);
        if (bindingResult.hasErrors()) {
            model.addAttribute("sell", sell);
            return "sell_detail";
        }

        this.buyService.create(sell, buyForm.getContent());
        return String.format("redirect:/sell/%s", id);
    }
}
