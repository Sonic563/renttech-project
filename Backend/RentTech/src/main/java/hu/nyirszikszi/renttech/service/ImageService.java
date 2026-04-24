package hu.nyirszikszi.renttech.service;

import hu.nyirszikszi.renttech.exception.BadRequestException;
import hu.nyirszikszi.renttech.exception.ConflictException;
import hu.nyirszikszi.renttech.exception.ResourceNotFoundException;
import hu.nyirszikszi.renttech.model.Image;
import hu.nyirszikszi.renttech.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ImageService {

    private final ImageRepository imageRepository;
    private static final long MAX_FILE_SIZE = 900 * 1024;

    public Image uploadImage(MultipartFile file, String description, String uploadedBy) throws IOException {
        if (file == null) throw new BadRequestException("File is required");
        if (file.isEmpty()) throw new BadRequestException("Fájl nem lehet üres!");

        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            throw new BadRequestException("Csak képfájlok engedélyezettek!");
        }

        String originalFilename = file.getOriginalFilename();


        Path uploadPath = Paths.get("uploads");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }


        String extension = "";
        int dotIndex = originalFilename.lastIndexOf(".");
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex);
        }

        String fileName = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(fileName);


        Files.copy(file.getInputStream(), filePath);


        Image image = new Image();
        image.setFileName(originalFilename);
        image.setContentType(contentType);
        image.setFileSize(file.getSize());
        image.setDescription(description);
        image.setUploadedBy(uploadedBy);
        image.setUploadedAt(LocalDateTime.now());


        image.setImageUrl("/uploads/" + fileName);

        return imageRepository.save(image);
    }

    public Optional<Image> getImageById(Long id) {
        return imageRepository.findById(id);
    }


    public Image getImageByFileNameOrThrow(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new BadRequestException("Fájl név kötelező");
        }

        List<Image> matches = imageRepository.findAllByFileName(fileName.trim());

        if (matches.isEmpty()) {
            throw new ResourceNotFoundException("Kép nem található!");
        }
        if (matches.size() > 1) {
            throw new ConflictException("Nem egyedi fájlnév!");
        }

        return matches.get(0);
    }

    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    public List<Image> getImagesByUploadedBy(String uploadedBy) {
        if (uploadedBy == null || uploadedBy.isBlank()) {
            throw new BadRequestException("feltöltő megadása kötelező");
        }

        return imageRepository.findAllByUploadedBy(uploadedBy.trim());
    }



    public boolean deleteImage(Long id) {
        if (id == null) throw new BadRequestException("Image id is required");

        Image img = imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("not found"));

        try {
            if (img.getImageUrl() != null) {
                Path path = Paths.get("uploads")
                        .resolve(img.getImageUrl().replace("/uploads/", ""));

                Files.deleteIfExists(path);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        imageRepository.deleteById(id);
        return true;
    }
    public Image updateImage(Long id, String description) {
        if (id == null) throw new BadRequestException("A kép azonosítója kötelező");
        if (description == null || description.isBlank()) {
            throw new BadRequestException("A leírás kötelező");
        }

        Image img = imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nem található"));

        img.setDescription(description);
        return imageRepository.save(img);
    }

    private boolean isValidImageType(String contentType) {
        if (contentType == null) return false;
        return contentType.equals("image/jpeg")
                || contentType.equals("image/png")
                || contentType.equals("image/gif")
                || contentType.equals("image/webp");
    }
}