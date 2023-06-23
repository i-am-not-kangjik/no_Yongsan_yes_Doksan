package kjkim.kjkimspring.message;

import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    public List<Message> getUnreadMessages(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return messageRepository.findByReceiverAndIsReadAndIsDeletedByReceiver(user.get(), false, false);
        } else {
            // handle the case when user does not exist
            return new ArrayList<>();
        }
    }

    public List<Message> getReceivedMessages(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return messageRepository.findByReceiverAndIsDeletedByReceiver(user.get(), false);
        } else {
            // handle the case when user does not exist
            return new ArrayList<>();
        }
    }

    public List<Message> getSentMessages(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return messageRepository.findBySenderAndIsDeletedBySender(user.get(), false);
        } else {
            // handle the case when user does not exist
            return new ArrayList<>();
        }
    }

    public void deleteReceivedMessage(Long messageId, String username) {
        Optional<Message> optionalMessage = messageRepository.findById(messageId);
        if (optionalMessage.isPresent()) {
            Message message = optionalMessage.get();
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent() && message.getReceiver().getId().equals(user.get().getId())) {
                message.setIsDeletedByReceiver(true);
                messageRepository.save(message);
            }
        }
    }

    public void deleteSentMessage(Long messageId, String username) {
        Optional<Message> optionalMessage = messageRepository.findById(messageId);
        if (optionalMessage.isPresent()) {
            Message message = optionalMessage.get();
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent() && message.getSender().getId().equals(user.get().getId())) {
                message.setIsDeletedBySender(true);
                messageRepository.save(message);
            }
        }
    }
}

