package kjkim.kjkimspring.controller;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.service.BuyService;
import kjkim.kjkimspring.service.SellService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class BuyController {
    private final SellService sellService;
    private final BuyService buyService;

    @PostMapping(value = "/buy/{id}")
    public String buy(Model model, @PathVariable("id") Integer id, @RequestParam String content) {
        Sell sell = this.sellService.getSell(id);
        this.buyService.create(sell, content);
        return String.format("redirect:/sell/%s", id);
    }
}
