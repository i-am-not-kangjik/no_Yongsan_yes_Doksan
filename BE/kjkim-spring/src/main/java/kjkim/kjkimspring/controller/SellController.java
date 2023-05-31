package kjkim.kjkimspring.controller;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class SellController {

    private final SellRepository sellRepository;

    @GetMapping("/sell")
    public String sell(Model model) {
        List<Sell> sellList = this.sellRepository.findAll();
        model.addAttribute("sellList", sellList);
        return "sell_list";
    }
}
