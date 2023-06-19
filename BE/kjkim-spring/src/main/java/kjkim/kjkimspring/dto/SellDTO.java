package kjkim.kjkimspring.dto;

import kjkim.kjkimspring.sell.Sell;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.sell.SellState;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class SellDTO {
    private Integer id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String imgName;
    private String imgPath;
    private Integer price;
    private String authorUsername; // Author's username
    private Integer viewCount;
    private String region;
    private Set<String> likedUsernames; // Set of usernames who liked the sell
    private String category;
    private SellState sellState;
    private List<String> imgNames;
    private List<String> imgPaths;
    private List<String> imageUrls;
}
