package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.dto.SellDTO;
import kjkim.kjkimspring.sell.*;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.userlikessell.UserLikesSell;
import kjkim.kjkimspring.userlikessell.UserLikesSellRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    // 필요한 레포지토리와 S3 클라이언트를 주입받습니다.
    private final SellRepository sellRepository;
    private final UserLikesSellRepository userLikesSellRepository;
    private final S3Client s3Client;
    private final String bucketName = "no-yongsan-yes-doksan";
    private final ImageRepository imageRepository;

    // 모든 판매 목록을 'createdAt' 기준 내림차순으로 가져옵니다.
    public List<Sell> getList() {
        Sort sort = Sort.by("createdAt").descending();
        return this.sellRepository.findAll(sort);
    }

    // 특정 판매 아이템을 ID로 가져옵니다. 없다면 예외를 발생시킵니다.
    public Sell getSell(Integer id) {
        Optional<Sell> sell = this.sellRepository.findById(id);
        if (sell.isPresent()) {
           return sell.get();
        } else {
            throw new DataNotFoundException("sell is not found");
        }
    }

    // 새 판매 아이템을 생성합니다. 이 과정에서 S3에 이미지를 업로드합니다.
    @Transactional
    public void create(String title, String content, Integer price, String region, String category, User user, List<MultipartFile> uploads) throws IOException {
        Sell sell = new Sell();
        sell.setTitle(title);
        sell.setContent(content);
        sell.setPrice(price);
        sell.setRegion(region);
        sell.setCategory(category);
        sell.setAuthor(user);
        sell.setViewCount(0);
        sell.setSellState(SellState.SELLING);

        List<Image> images = uploadImages(uploads, sell);
        sell.setImageList(images);

        sellRepository.save(sell);
    }

    @Transactional
    public void modify(Sell sell, String title, String content, Integer price, String region, String category, List<MultipartFile> uploads) throws IOException {
        sell.setTitle(title);
        sell.setContent(content);
        sell.setPrice(price);
        sell.setRegion(region);
        sell.setCategory(category);

        deleteImages(sell);
        List<Image> images = uploadImages(uploads, sell);
        sell.getImageList().addAll(images);

        this.sellRepository.save(sell);
    }



    // 특정 판매 아이템을 삭제합니다. 이 과정에서 연결된 이미지도 S3에서 삭제합니다.
    @Transactional
    public void delete(Sell sell) {
        deleteImages(sell);
        this.sellRepository.delete(sell);
    }

    // 이미지를 업로드합니다. 게시글 등록, 수정에 사용됩니다.
    private List<Image> uploadImages(List<MultipartFile> uploads, Sell sell) throws IOException {
        List<Image> images = new ArrayList<>();
        if (uploads != null && !uploads.isEmpty()) {
            for (MultipartFile upload : uploads) {
                if (!upload.isEmpty()) {
                    String originalFilename = upload.getOriginalFilename();
                    String objectKey = "sell-image/" + UUID.randomUUID() + "_" + originalFilename;
                    String imageURL = "https://" + bucketName + ".s3.amazonaws.com/" + objectKey;

                    s3Client.putObject(PutObjectRequest.builder()
                                    .bucket(bucketName)
                                    .key(objectKey)
                                    .build(),
                            RequestBody.fromBytes(upload.getBytes()));

                    Image image = new Image();
                    image.setImgName(objectKey);
                    image.setImgPath(imageURL);
                    image.setOriName(objectKey);
                    image.setSell(sell);

                    // Image 객체를 저장합니다.
                    imageRepository.save(image);

                    images.add(image);
                }
            }
        }
        return images;
    }

    // 이미지를 삭제합니다. 게시글 수정, 삭제에 사용됩니다.
    private void deleteImages(Sell sell) {
        if (sell.getImageList() != null && !sell.getImageList().isEmpty()) {
            for (Image oldImage : sell.getImageList()) {
                String deleteKey = oldImage.getImgName();
                s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucketName).key(deleteKey).build());
            }
            sell.getImageList().clear();
        }
    }

    // 판매 아이템을 저장하고 저장된 객체를 반환합니다.
    public Sell saveSell(Sell sell) {
        return sellRepository.save(sell);
    }

    // 특정 판매 아이템에 대해 좋아요/좋아요 취소를 수행합니다.
    @Transactional
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


    // UserLikesSell 객체를 저장합니다.
    public void saveUserLikesSell(UserLikesSell userLikesSell) {
        this.userLikesSellRepository.save(userLikesSell);
    }

    // 특정 판매 아이템에 좋아요를 누른 모든 사용자를 반환합니다.
    public List<User> getLikedUsers(Integer id) {
        // 판매 아이템의 ID로 해당 아이템에 좋아요를 누른 UserLikesSell 객체들을 모두 가져옵니다.
        List<UserLikesSell> userLikesSells = this.userLikesSellRepository.findAllBySell_Id(id);

        // UserLikesSell 객체들에서 User 객체들만 추출하여 List에 저장합니다.
        List<User> likedUsers = userLikesSells.stream()
                .map(UserLikesSell::getUser)
                .collect(Collectors.toList());

        return likedUsers;
    }

    // 특정 사용자가 좋아요를 누른 모든 판매 아이템을 반환합니다.
    public List<Sell> getLikedSellsByUser(Long userId) {
        List<UserLikesSell> userLikes = userLikesSellRepository.findAllByUser_Id(userId);
        return userLikes.stream()
                .map(UserLikesSell::getSell)
                .collect(Collectors.toList());
    }

    // 판매 상태를 변경하고 변경된 판매 아이템을 저장합니다.
    public void changeSellStatus(Sell sell, String status) {
        SellState state = SellState.fromString(status);
        sell.setSellState(state);
        this.sellRepository.save(sell);
    }

    // Sell 객체를 SellDTO로 변환하여 반환합니다.
    public SellDTO convertToDTO(Sell sell) {
        SellDTO sellDTO = new SellDTO();

        sellDTO.setId(sell.getId());
        sellDTO.setTitle(sell.getTitle());
        sellDTO.setContent(sell.getContent());
        sellDTO.setCreatedAt(sell.getCreatedAt());
        // convert list of Image objects to list of image names and paths
        sellDTO.setImgNames(sell.getImageList().stream().map(Image::getImgName).collect(Collectors.toList()));
        sellDTO.setImgPaths(sell.getImageList().stream().map(Image::getImgPath).collect(Collectors.toList()));
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
