package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import kjkim.kjkimspring.user.SignUp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SellService {

    private final SellRepository sellRepository;

    public Page<Sell> getList(int page) {
        Sort sort = Sort.by("createdAt").descending();
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

    public void create(String subject, String content, Integer price, SignUp user, MultipartFile upload) throws IOException {
        Sell s = new Sell();
        s.setSubject(subject);
        s.setContent(content);
        s.setPrice(price);
        s.setAuthor(user);

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
}
