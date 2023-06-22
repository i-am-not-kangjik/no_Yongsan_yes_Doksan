package kjkim.kjkimspring.dto;

import groovyjarjarantlr4.v4.runtime.misc.NotNull;
import kjkim.kjkimspring.user.User;
import lombok.Data;

import javax.validation.constraints.Email;

@Data
public class UserDto {
    @NotNull
    @Email
    private String email;

    public UserDto(User user) {
        this.email = user.getEmail();
    }
}