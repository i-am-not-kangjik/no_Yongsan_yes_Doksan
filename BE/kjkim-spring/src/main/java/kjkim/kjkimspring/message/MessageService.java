package kjkim.kjkimspring.message;

import kjkim.kjkimspring.dto.MessageDto;
import kjkim.kjkimspring.user.User;
import kjkim.kjkimspring.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

//    public List<MessageDto> getUnreadMessages(String username) {
//        Optional<User> user = userRepository.findByUsername(username);
//        if (user.isPresent()) {
//            List<Message> messages = messageRepository.findByReceiverAndIsReadAndIsDeletedByReceiver(user.get(), false, false);
//            return messages.stream().map(MessageDto::new).collect(Collectors.toList());
//        } else {
//            // handle the case when user does not exist
//            return new ArrayList<>();
//        }
//    }


    public List<MessageDto> getReceivedMessages(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            List<Message> messages = messageRepository.findByReceiverAndIsDeletedByReceiver(user.get(), false);
            return messages.stream().map(MessageDto::new).collect(Collectors.toList());
        } else {
            // handle the case when user does not exist
            return new ArrayList<>();
        }
    }

    public List<MessageDto> getSentMessages(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            List<Message> messages = messageRepository.findBySenderAndIsDeletedBySender(user.get(), false);
            return messages.stream().map(MessageDto::new).collect(Collectors.toList());
        } else {
            // handle the case when user does not exist
            return new ArrayList<>();
        }
    }


//    @Transactional
//    public void deleteReceivedMessage(Long messageId, String username) {
//        Optional<Message> messageOptional = messageRepository.findById(messageId);
//        if (messageOptional.isPresent()) {
//            Message message = messageOptional.get();
//            if (message.getReceiver().getUsername().equals(username)) {
//                message.setIsDeletedByReceiver(true);
//                messageRepository.save(message);
//                messageRepository.flush();
//            } else {
//                // handle the case when user is not the receiver of the message
//            }
//        } else {
//            // handle the case when message does not exist
//        }
//    }



//    public void deleteSentMessage(Long messageId, String username) {
//        Optional<Message> optionalMessage = messageRepository.findById(messageId);
//        if (optionalMessage.isPresent()) {
//            Message message = optionalMessage.get();
//            Optional<User> user = userRepository.findByUsername(username);
//            if (user.isPresent() && message.getSender().getId().equals(user.get().getId())) {
//                message.setIsDeletedBySender(true);
//                messageRepository.save(message);
//            }
//        }
//    }
}

