package hu.nyirszikszi.renttech.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageDTO {

    private Long id;

    private String fileName;

    private String contentType;


    private String imageUrl;

    private Long fileSize;

    private LocalDateTime uploadedAt;

    private String description;

    private String uploadedBy;


    public ImageDTO(Long id, String fileName, String contentType, Long fileSize,
                    LocalDateTime uploadedAt, String description, String uploadedBy) {
        this.id = id;
        this.fileName = fileName;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
        this.description = description;
        this.uploadedBy = uploadedBy;
    }
}