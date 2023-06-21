package kjkim.kjkimspring.service;

import kjkim.kjkimspring.DataNotFoundException;
import kjkim.kjkimspring.dto.SellDTO;
import kjkim.kjkimspring.sell.*;
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
    private final ImageRepository imageRepository;

    public List<Sell> getList() {
        Sort sort = Sort.by("createdAt").descending();
        return this.sellRepository.findAll(sort);
    }

    public Sell getSell(Integer id) {
        Optional<Sell> sell = this.sellRepository.findById(id);
        if (sell.isPresent()) {
           return sell.get();
        } else {
            throw new DataNotFoundException("sell is not found");
        }
    }

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

        List<Image> images = new ArrayList<>();
        if (uploads != null && !uploads.isEmpty()) {
            for (MultipartFile upload : uploads) {
                if (!upload.isEmpty()) {
                    // 이미지를 S3에 업로드하는 코드
                    String originalFilename = upload.getOriginalFilename();
                    String objectKey = "sell-image/" + UUID.randomUUID() + "_" + originalFilename;
                    String imageURL = "https://" + bucketName + ".s3.amazonaws.com/" + objectKey;

                    s3Client.putObject(PutObjectRequest.builder()
                                    .bucket(bucketName)
                                    .key(objectKey)
                                    .build(),
                            RequestBody.fromBytes(upload.getBytes()));

                    // 이미지 정보를 Image 객체에 저장하고 Sell과 Image를 연결
                    Image image = new Image();
                    image.setImgName(objectKey);
                    image.setImgPath(imageURL);
                    image.setOriName(objectKey);
                    image.setSell(sell);
                    images.add(image);

                    // Sell과 Image 연결
                    sell.addImage(image);
                }
            }
        }

        sell.setImageList(images);
        sellRepository.save(sell); // 모든 이미지가 리스트에 추가된 후에 Sell 객체를 저장합니다.
    }




    public void modify(Sell sell, String title, String content, Integer price, String region, String category, List<MultipartFile> uploads) throws IOException {
        sell.setTitle(title);
        sell.setContent(content);
        sell.setPrice(price);
        sell.setRegion(region);
        sell.setCategory(category);

        if (uploads != null && !uploads.isEmpty()) {
            // 이전 이미지 삭제
            if (sell.getImageList() != null && !sell.getImageList().isEmpty()) {
                for (Image oldImage : sell.getImageList()) {
                    String deleteKey = oldImage.getImgName();
                    s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucketName).key(deleteKey).build());
                }
                sell.getImageList().clear(); // clear the old images
            }

            List<Image> images = new ArrayList<>();
            for (MultipartFile upload : uploads) {
                if (!upload.isEmpty()) {
                    String originalImgName = upload.getOriginalFilename();
                    UUID uuid = UUID.randomUUID();
                    String imgName = "sell-image/" + uuid + "_" + originalImgName;

                    // 새 이미지 S3에 업로드
                    s3Client.putObject(PutObjectRequest.builder()
                                    .bucket(bucketName)
                                    .key(imgName)
                                    .build(),
                            RequestBody.fromBytes(upload.getBytes()));

                    Image image = new Image();
                    image.setImgName(imgName);
                    image.setImgPath("https://" + bucketName + ".s3.amazonaws.com/" + imgName); // S3 URL
                    image.setOriName(imgName); // Set the original file name
                    image.setSell(sell); // link image with the Sell
                    images.add(image);
                }
            }

            if (!images.isEmpty()) {
                for (Image image : images) {
                    sell.addImage(image);
                }
            } else {
                sell.getImageList().clear();
            }

            this.sellRepository.save(sell);
        } else {
            this.sellRepository.save(sell);
        }
    }







    public void delete(Sell sell) {
        // 해당 Sell 객체와 연결된 이미지들을 S3에서 먼저 삭제합니다.
        if (sell.getImageList() != null && !sell.getImageList().isEmpty()) {
            for (Image image : sell.getImageList()) {
                String deleteKey = image.getImgName();
                s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucketName).key(deleteKey).build());
            }
        }
        this.sellRepository.delete(sell);  // 마지막으로 Sell 객체를 삭제합니다.
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


    public void changeSellStatus(Sell sell, String status) {
        SellState state = SellState.fromString(status);
        sell.setSellState(state);
        this.sellRepository.save(sell);
    }

    public SellDTO convertToDTO(Sell sell) {
        SellDTO sellDTO = new SellDTO();

        sellDTO.setId(sell.getId());
        sellDTO.setTitle(sell.getTitle());
        sellDTO.setContent(sell.getContent());
        sellDTO.setCreatedAt(sell.getCreatedAt());
        sellDTO.setUpdatedAt(sell.getUpdatedAt());
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
