package kjkim.kjkimspring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDto {
    private String senderUsername;
    private String receiverUsername;
    private String content;

}
