package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import kjkim.kjkimspring.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SellService {

    private final SellRepository sellRepository;

    public Page<Sell> getList(int page) {
        Sort sort = Sort.by("updatedAt").descending();
        Pageable pageable = PageRequest.of(page, 9, sort);
        return this.sellRepository.findAll(pageable);
    }

    public Sell getSell(Integer id) {
        Optional<Sell> sell = this.sellRepository.findById(id);
        if (sell.isPresent()) {
           return sell.get();
        } else {
            throw new DataNotFoundException("sell is not found");
        }
    }

    public void create(String title, String content, Integer price, User user, MultipartFile upload) throws IOException {
        Sell s = new Sell();
        s.setTitle(title);
        s.setContent(content);
        s.setPrice(price);
        s.setAuthor(user);
        s.setViewCount(0);

        String originalImgName = upload.getOriginalFilename();
        String projectPath = System.getProperty("user.dir") + "/src/main/resources/static/images/";

        UUID uuid = UUID.randomUUID();
        String imgName = uuid + "_" + originalImgName;

        if(imgName.contains(".")) {
            File saveFile = new File(projectPath, imgName);

            upload.transferTo(saveFile);

            s.setImgName(imgName);
            s.setImgPath("/images/" + imgName);
            this.sellRepository.save(s);
        }
        else {
            this.sellRepository.save(s);
        }
    }

    public void modify(Sell sell, String title, String content, Integer price, MultipartFile upload) throws IOException {
        sell.setTitle(title);
        sell.setContent(content);
        sell.setPrice(price);

        String originalImgName = upload.getOriginalFilename();
        String projectPath = System.getProperty("user.dir") + "/src/main/resources/static/images/";

        UUID uuid = UUID.randomUUID();
        String imgName = uuid + "_" + originalImgName;

        if (imgName.contains(".")) {
            File saveFile = new File(projectPath, imgName);

            upload.transferTo(saveFile);

            sell.setOriImgName(originalImgName);
            sell.setImgName(imgName);
            sell.setImgPath("/images/" + imgName);

            this.sellRepository.save(sell);
        } else {
            this.sellRepository.save(sell);
        }
    }

    public void delete(Sell sell) {
        this.sellRepository.delete(sell);
    }

    public Sell saveSell(Sell sell) {
        return sellRepository.save(sell);
    }
}
