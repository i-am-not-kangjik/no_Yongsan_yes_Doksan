package kjkim.kjkimspring.members;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Getter
@Setter
public class UserCreateForm {
    @NotEmpty(message = "사용자 ID(e-mail)는 필수항목!")
    private String email;

    @Size(min = 3, max = 20)
    @NotEmpty(message = "이름은 필수항목!")
    private String name;

    @NotEmpty(message = "비밀번호는 필수항목!")
    private String password1;

    @NotEmpty(message = "비밀번호 재확인은 필수항목!")
    private String password2;
}
