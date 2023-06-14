package kjkim.kjkimspring.dto;

import kjkim.kjkimspring.user.User;

public class UserDto {
    private String username;
//    private String email;
    private String password;

    public UserDto(User user) {
        this.username = user.getUsername();
//        this.email = user.getEmail();
        this.password = user.getPassword();
    }

    // getter, setter, etc...

}
