package kjkim.kjkimspring.controller;

import kjkim.kjkimspring.dto.MessageDto;
import kjkim.kjkimspring.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageRestController {

    @Autowired
    private MessageService messageService;


    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public void sendMessage(@RequestBody MessageDto messageDto) {
        messageService.sendMessage(messageDto.getSenderUsername(), messageDto.getReceiverUsername(), messageDto.getContent());
    }

    @PreAuthorize("#username == authentication.principal.username")
    @GetMapping("/received/{username}")
    public List<MessageDto> getReceivedMessages(@PathVariable String username) {
        return messageService.getReceivedMessages(username);
    }

    @PreAuthorize("#username == authentication.principal.username")
    @GetMapping("/sent/{username}")
    public List<MessageDto> getSentMessages(@PathVariable String username) {
        return messageService.getSentMessages(username);
    }
    @PreAuthorize("#username == authentication.principal.username")
    @GetMapping("/{username}/{messageId}")
    public MessageDto getMessage(@PathVariable String username, @PathVariable Long messageId) {
        return messageService.getMessageById(messageId, username);
    }

}
