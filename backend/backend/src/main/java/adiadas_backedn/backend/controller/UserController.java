package adiadas_backedn.backend.controller;

import adiadas_backedn.backend.dto.UserDTO;
import adiadas_backedn.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Date;
import java.time.ZoneId;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping 
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ API MỚI: Lấy user theo ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        return userService.findById(id)
                .map(user -> {
                    Date createdAtDate = user.getCreatedAt() != null ? Date.from(user.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant()) : null;
                    // Chuyển đổi User entity sang UserDTO
                    return new UserDTO(
                        user.getId(), 
                        user.getName(), 
                        user.getEmail(), 
                        user.getIsAdmin(), 
                        user.getSta(), 
                        createdAtDate
                    );
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable String id, @RequestBody UserDTO userDetails) {
        return userService.updateUser(id, userDetails)
                .map(user -> {
                    Date createdAtDate = user.getCreatedAt() != null ? Date.from(user.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant()) : null;
                    UserDTO userDTO = new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getIsAdmin(), user.getSta(), createdAtDate);
                    return ResponseEntity.ok(userDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
