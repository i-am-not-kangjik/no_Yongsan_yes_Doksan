package kjkim.kjkimspring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateDto {
    private String username;
    private String email;
    private String password1;
    private String password2;
    private String phoneNumber;
    private String fullName;

    // getters and setters
}