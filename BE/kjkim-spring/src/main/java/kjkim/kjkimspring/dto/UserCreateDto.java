package kjkim.kjkimspring.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

@Data
public class UserCreateDto {
    @NotNull
    @Size(min = 1, max = 50)
    private String username;

    @NotNull
    @Email
    private String email;

    @NotNull
    @Size(min = 8, max = 100)
    private String password1;

    @NotNull
    @Size(min = 8, max = 100)
    private String password2;

    @NotNull
    @Size(min = 1, max = 50)
    private String phoneNumber;

    @NotNull
    @Size(min = 1, max = 100)
    private String fullName;
}
