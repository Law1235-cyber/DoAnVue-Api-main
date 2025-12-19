package adiadas_backedn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String name;
    private String email;
    // Đổi từ boolean -> Boolean để tránh NullPointerException
    private Boolean isAdmin;
    private Integer sta;
    private Date createdAt;
}
