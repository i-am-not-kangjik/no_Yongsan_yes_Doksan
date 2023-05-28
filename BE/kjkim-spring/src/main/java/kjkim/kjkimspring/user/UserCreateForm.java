package kjkim.kjkimspring.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword1() {
        return password1;
    }

    public void setPassword1(String password1) {
        this.password1 = password1;
    }

    public String getPassword2() {
        return password2;
    }

    public void setPassword2(String password2) {
        this.password2 = password2;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
