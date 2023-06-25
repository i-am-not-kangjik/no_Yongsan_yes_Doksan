package kjkim.kjkimspring.service;

import kjkim.kjkimspring.dto.MessageDto;
import kjkim.kjkimspring.message.Message;
import kjkim.kjkimspring.message.MessageRepository;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    public void sendMessage(String senderUsername, String receiverUsername, String content) {
        Optional<User> sender = userRepository.findByUsername(senderUsername);
        Optional<User> receiver = userRepository.findByUsername(receiverUsername);

        if (sender.isPresent() && receiver.isPresent()) {
            Message message = new Message();
            message.setSender(sender.get());
            message.setReceiver(receiver.get());
            message.setContent(content);

            messageRepository.save(message);
        } else {
            // handle the case when sender or receiver does not exist
        }
    }

    public MessageDto getMessageById(Long messageId, String username) {
        Optional<Message> optionalMessage = messageRepository.findById(messageId);
        if (optionalMessage.isPresent()) {
            Message message = optionalMessage.get();
            if (message.getSender().getUsername().equals(username) || message.getReceiver().getUsername().equals(username)) {
                return new MessageDto(message);
            } else {
                throw new AccessDeniedException("Access is denied.");
            }
        } else {
            // handle the case when message does not exist
            return null;
        }
    }


    public List<MessageDto> getReceivedMessages(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return messageRepository.findByReceiver(user)
                .stream()
                .map(MessageDto::new)
                .collect(Collectors.toList());
    }

    public List<MessageDto> getSentMessages(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return messageRepository.findBySender(user)
                .stream()
                .map(MessageDto::new)
                .collect(Collectors.toList());
    }

}

