package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.dto.SellDTO;
import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.sell.SellRepository;
import kjkim.kjkimspring.sell.SellState;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.userlikessell.UserLikesSell;
import kjkim.kjkimspring.userlikessell.UserLikesSellRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellService {

    private final SellRepository sellRepository;
    private final UserLikesSellRepository userLikesSellRepository;
    private final S3Client s3Client;
    private final String bucketName = "no-yongsan-yes-doksan";


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

    public void create(String title, String content, Integer price, String region, String category, User user, MultipartFile upload) throws IOException {
        Sell s = new Sell();
        s.setTitle(title);
        s.setContent(content);
        s.setPrice(price);
        s.setRegion(region);
        s.setCategory(category);
        s.setAuthor(user);
        s.setViewCount(0);
        s.setSellState(SellState.SELLING);

        String originalImgName = upload.getOriginalFilename();

        UUID uuid = UUID.randomUUID();
        String imgName = "sell-image/" + uuid + "_" + originalImgName;

        if (originalImgName != null && !originalImgName.isEmpty()) {
            // S3에 업로드
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(imgName)
                            .build(),
                    RequestBody.fromBytes(upload.getBytes()));
            s.setImgName(imgName);
            s.setImgPath("https://" + bucketName + ".s3.amazonaws.com/" + imgName); // S3 URL
            this.sellRepository.save(s);
        } else {
            this.sellRepository.save(s);
        }
    }


    public void modify(Sell sell, String title, String content, Integer price, String region, String category, MultipartFile upload) throws IOException {
        sell.setTitle(title);
        sell.setContent(content);
        sell.setPrice(price);
        sell.setRegion(region);
        sell.setCategory(category);

        String originalImgName = upload.getOriginalFilename();

        UUID uuid = UUID.randomUUID();
        String imgName = "sell-image/" + uuid + "_" + originalImgName;

        if (originalImgName != null && !originalImgName.isEmpty()) {
            // 이전 이미지 삭제
            if (sell.getImgName() != null) {
                String deleteKey = sell.getImgName();
                s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucketName).key(deleteKey).build());
            }

            // 새 이미지 S3에 업로드
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(imgName)
                            .build(),
                    RequestBody.fromBytes(upload.getBytes()));
            sell.setImgName(imgName);
            sell.setImgPath("https://" + bucketName + ".s3.amazonaws.com/" + imgName); // S3 URL

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

    public void toggleLike(Sell sell, User user) {
        Optional<UserLikesSell> userLikesSell = this.userLikesSellRepository.findBySellAndUser(sell, user);
        if (userLikesSell.isPresent()) {
            // 좋아요가 이미 있으므로, 좋아요를 취소(삭제)합니다.
            this.userLikesSellRepository.delete(userLikesSell.get());
        } else {
            // 좋아요가 아직 없으므로, 좋아요를 추가합니다.
            UserLikesSell newUserLikesSell = new UserLikesSell();
            newUserLikesSell.setUser(user);
            newUserLikesSell.setSell(sell);
            this.userLikesSellRepository.save(newUserLikesSell);
        }
    }



    public void saveUserLikesSell(UserLikesSell userLikesSell) {
        this.userLikesSellRepository.save(userLikesSell);
    }

    public List<User> getLikedUsers(Integer id) {
        // 판매 아이템의 ID로 해당 아이템에 좋아요를 누른 UserLikesSell 객체들을 모두 가져옵니다.
        List<UserLikesSell> userLikesSells = this.userLikesSellRepository.findAllBySell_Id(id);

        // UserLikesSell 객체들에서 User 객체들만 추출하여 List에 저장합니다.
        List<User> likedUsers = userLikesSells.stream()
                .map(UserLikesSell::getUser)
                .collect(Collectors.toList());

        return likedUsers;
    }


    public List<Sell> getLikedSellsByUser(Long userId) {
        List<UserLikesSell> userLikes = userLikesSellRepository.findAllByUser_Id(userId);
        return userLikes.stream()
                .map(UserLikesSell::getSell)
                .collect(Collectors.toList());
    }


    public void changeSellStateToSelling(Sell sell) {
        sell.setSellState(SellState.SELLING);
        this.sellRepository.save(sell);
    }

    public void changeSellStateToReserved(Sell sell) {
        sell.setSellState(SellState.RESERVED);
        this.sellRepository.save(sell);
    }

    public void changeSellStateToCompleted(Sell sell) {
        sell.setSellState(SellState.SOLD_OUT);
        this.sellRepository.save(sell);
    }

    public SellDTO convertToDTO(Sell sell) {
        SellDTO sellDTO = new SellDTO();

        sellDTO.setId(sell.getId());
        sellDTO.setTitle(sell.getTitle());
        sellDTO.setContent(sell.getContent());
        sellDTO.setCreatedAt(sell.getCreatedAt());
        sellDTO.setUpdatedAt(sell.getUpdatedAt());
        sellDTO.setImgName(sell.getImgName());
        sellDTO.setImgPath(sell.getImgPath());
        sellDTO.setPrice(sell.getPrice());
        sellDTO.setAuthorUsername(sell.getAuthor().getUsername());
        sellDTO.setViewCount(sell.getViewCount());
        sellDTO.setRegion(sell.getRegion());

        Set<String> likedUsernames = sell.getLikedUser().stream()
                .map(User::getUsername)
                .collect(Collectors.toSet());
        sellDTO.setLikedUsernames(likedUsernames);

        sellDTO.setCategory(sell.getCategory());
        sellDTO.setSellState(sell.getSellState());

        return sellDTO;
    }
}
