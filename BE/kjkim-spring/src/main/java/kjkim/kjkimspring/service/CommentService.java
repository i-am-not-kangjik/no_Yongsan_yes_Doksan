//package kjkim.kjkimspring.service;
//
//import kjkim.kjkimspring.DataNotFoundException;
//import kjkim.kjkimspring.comment.Comment;
//import kjkim.kjkimspring.comment.CommentRepository;
//import kjkim.kjkimspring.sell.Sell;
//import kjkim.kjkimspring.user.User;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//public class CommentService {
//    private final CommentRepository commentRepository;
//
//    public void create(Sell sell, String content, User author) {
//        Comment comment = new Comment();
//        comment.setContent(content);
//        comment.setSell(sell);
//        comment.setAuthor(author);
//        this.commentRepository.save(comment);
//    }
//
//    public Comment getComment(Integer id) {
//        Optional<Comment> answer = this.commentRepository.findById(id);
//        if (answer.isPresent()) {
//            return answer.get();
//        } else {
//            throw new DataNotFoundException("answer not found");
//        }
//    }
//
//    public void modify(Comment comment, String content) {
//        comment.setContent(content);
//        this.commentRepository.save(comment);
//    }
//
//    public void delete(Comment comment) {
//        this.commentRepository.delete(comment);
//    }
//}
