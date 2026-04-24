package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.model.Image;
import hu.nyirszikszi.renttech.dto.ImageDTO;
import hu.nyirszikszi.renttech.service.ImageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import hu.nyirszikszi.renttech.exception.BadRequestException;
import hu.nyirszikszi.renttech.exception.ConflictException;
import hu.nyirszikszi.renttech.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ImageController {

    @Autowired
    private ImageService imageService;


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy) {

        try {

            String uploader = uploadedBy != null && !uploadedBy.isEmpty() ? uploadedBy : "anonymous";

            Image image = imageService.uploadImage(file, description, uploader);
            ImageDTO dto = convertToDTO(image);

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Hiba a feltöltéskor: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Belső szerver hiba: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ImageDTO>> getAllImages() {
        List<Image> images = imageService.getAllImages();
        List<ImageDTO> dtos = images.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getImageById(@PathVariable Long id) {
        Optional<Image> image = imageService.getImageById(id);
        if (image.isPresent()) {
            ImageDTO dto = convertToDTO(image.get());
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Kép nem található!");
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadImage(@PathVariable Long id) {
        Optional<Image> image = imageService.getImageById(id);

        if (image.isPresent()) {
            try {
                Image img = image.get();

                Path path = Paths.get("uploads").resolve(
                        img.getImageUrl().replace("/uploads/", "")
                );

                Resource resource = new UrlResource(path.toUri());

                if (!resource.exists()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Fájl nem található a szerveren!");
                }

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + img.getFileName() + "\"")
                        .header(HttpHeaders.CONTENT_TYPE, img.getContentType())
                        .body(resource);

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Hiba a letöltéskor: " + e.getMessage());
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Kép nem található!");
    }


    @GetMapping("/by-name/{fileName}")
    public ResponseEntity<Image> getByFileName(@PathVariable String fileName) {
        return ResponseEntity.ok(imageService.getImageByFileNameOrThrow(fileName));
    }


    @GetMapping("/by-user/{uploadedBy}")
    public ResponseEntity<List<ImageDTO>> getImagesByUploadedBy(@PathVariable String uploadedBy) {
        List<Image> images = imageService.getImagesByUploadedBy(uploadedBy);
        List<ImageDTO> dtos = images.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateImage(
            @PathVariable Long id,
            @RequestParam(value = "description", required = false) String description) {

        try {
            Image image = imageService.updateImage(id, description);
            ImageDTO dto = convertToDTO(image);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {
        if (imageService.deleteImage(id)) {
            return ResponseEntity.ok("Kép sikeresen törölve!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Kép nem található!");
    }


    private ImageDTO convertToDTO(Image image) {
        ImageDTO dto = new ImageDTO();
        dto.setId(image.getId());
        dto.setFileName(image.getFileName());
        dto.setContentType(image.getContentType());
        dto.setFileSize(image.getFileSize());
        dto.setUploadedAt(image.getUploadedAt());
        dto.setDescription(image.getDescription());
        dto.setUploadedBy(image.getUploadedBy());
        dto.setImageUrl(image.getImageUrl());
        return dto;
    }
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleImageNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<String> handleConflict(ConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}