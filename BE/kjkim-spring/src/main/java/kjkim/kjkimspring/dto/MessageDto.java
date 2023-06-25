package kjkim.kjkimspring.dto;

import kjkim.kjkimspring.message.Message;
import lombok.Data;

@Data
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
