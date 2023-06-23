package kjkim.kjkimspring.controller;

import kjkim.kjkimspring.dto.MessageDto;
import kjkim.kjkimspring.message.Message;
import kjkim.kjkimspring.message.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageRestController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public void sendMessage(@RequestBody MessageDto messageDto) {
        messageService.sendMessage(messageDto.getSenderUsername(), messageDto.getReceiverUsername(), messageDto.getContent());
    }

    @GetMapping("/unread/{username}")
    public List<Message> getUnreadMessages(@PathVariable String username) {
        return messageService.getUnreadMessages(username);
    }

    @GetMapping("/received/{username}")
    public List<Message> getReceivedMessages(@PathVariable String username) {
        return messageService.getReceivedMessages(username);
    }

    @GetMapping("/sent/{username}")
    public List<Message> getSentMessages(@PathVariable String username) {
        return messageService.getSentMessages(username);
    }

    @DeleteMapping("/received/{username}/{messageId}")
    public void deleteReceivedMessage(@PathVariable Long messageId, @PathVariable String username) {
        messageService.deleteReceivedMessage(messageId, username);
    }

    @DeleteMapping("/sent/{username}/{messageId}")
    public void deleteSentMessage(@PathVariable Long messageId, @PathVariable String username) {
        messageService.deleteSentMessage(messageId, username);
    }
}
