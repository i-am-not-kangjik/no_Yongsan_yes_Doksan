package kjkim.kjkimspring.sell;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
public class SellForm {
    @NotEmpty(message = "제목은 필수항목입니다.")
    @Size(max = 200)
    private String title;

    @NotEmpty(message = "카테고리는 필수항목입니다.")
    private String category;

    @NotEmpty(message = "지역은 필수항목입니다.")
    private String region;

    @NotEmpty(message = "내용은 필수항목입니다.")
    private String content;

    @NotNull(message = "가격은 필수항목 입니다.")
    private Integer price;

    private List<MultipartFile> images;
}

