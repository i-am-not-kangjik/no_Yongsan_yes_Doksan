package kjkim.kjkimspring.user;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
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

    @NotBlank(message = "전화번호를 입력해주세요.")
    @Size(max = 20, message = "전화번호는 최대 20자리까지 입력 가능합니다.")
    private String phoneNumber;

}
