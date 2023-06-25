package kjkim.kjkimspring.dto;

import kjkim.kjkimspring.message.Message;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor  // Lombok이 기본 생성자를 자동으로 추가
@AllArgsConstructor // 모든 필드를 매개변수로 갖는 생성자를 추가
public class MessageDto {
    private Long id;
    private String senderUsername;
    private String receiverUsername;
    private String content;
    private boolean isRead;
    private boolean isDeletedBySender;
    private boolean isDeletedByReceiver;

    public MessageDto(Message message) {
        this.id = message.getId();
        this.senderUsername = message.getSender().getUsername();
        this.receiverUsername = message.getReceiver().getUsername();
        this.content = message.getContent();
        this.isRead = message.isRead();
        this.isDeletedBySender = message.isDeletedBySender();
        this.isDeletedByReceiver = message.isDeletedByReceiver();
    }
}
