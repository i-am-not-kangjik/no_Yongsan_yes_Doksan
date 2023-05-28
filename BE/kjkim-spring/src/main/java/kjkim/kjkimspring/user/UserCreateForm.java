package kjkim.kjkimspring.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Getter
@Setter
public class UserCreateForm {
    @Size(min = 3, max = 20)
    @NotEmpty(message = "사용자 ID는 필수항목!")
    private String username;

    @NotEmpty(message = "비밀번호는 필수항목!")
    private String password1;

    @NotEmpty(message = "비밀번호 재확인은 필수항목!")
    private String password2;

    @Email
    @NotEmpty(message = "이메일은 필수항목!")
    private String email;
}
