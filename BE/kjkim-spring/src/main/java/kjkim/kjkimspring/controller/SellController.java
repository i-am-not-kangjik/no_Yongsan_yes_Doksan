package kjkim.kjkimspring.controller;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.service.SellService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class SellController {

    private final SellService sellService;

    @GetMapping("/sell")
    public String sell(Model model) {
        List<Sell> sellList = this.sellService.getList();
        model.addAttribute("sellList", sellList);
        return "sell_list";
    }
}
