package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.model.Image;
import hu.nyirszikszi.renttech.service.ImageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = ImageController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
@Import(hu.nyirszikszi.renttech.exception.GlobalExceptionHandler.class)
class ImageControllerTest {

    @Autowired MockMvc mockMvc;

    @MockBean ImageService imageService;

    private Image imageWithData() {
        Image img = new Image();
        img.setId(1L);
        img.setFileName("pic.png");
        img.setContentType("image/png");
        img.setImageData("abc".getBytes(StandardCharsets.UTF_8));
        img.setFileSize(3L);
        img.setUploadedAt(LocalDateTime.of(2026, 4, 20, 10, 0));
        img.setDescription("desc");
        img.setUploadedBy("john");
        return img;
    }

    private Image imageWithoutData() {
        Image img = imageWithData();
        img.setImageData(null);
        return img;
    }

    @Test
    void uploadImage_success_uploadedByEmpty_defaultsAnonymous_returns201AndDtoWithBase64() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "pic.png", "image/png", "abc".getBytes(StandardCharsets.UTF_8)
        );

        when(imageService.uploadImage(any(), eq("d"), eq("anonymous")))
                .thenReturn(imageWithData());

        mockMvc.perform(multipart("/api/images/upload")
                        .file(file)
                        .param("description", "d")
                        .param("uploadedBy", ""))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.fileName").value("pic.png"))
                .andExpect(jsonPath("$.contentType").value("image/png"))
                .andExpect(jsonPath("$.fileSize").value(3))
                .andExpect(jsonPath("$.uploadedBy").value("john"))
                .andExpect(jsonPath("$.imageBase64", containsString("base64,")));
        verify(imageService).uploadImage(any(), eq("d"), eq("anonymous"));
    }

    @Test
    void uploadImage_ioException_returns400Message() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "pic.png", "image/png", "abc".getBytes(StandardCharsets.UTF_8)
        );

        when(imageService.uploadImage(any(), any(), any()))
                .thenThrow(new IOException("disk error"));

        mockMvc.perform(multipart("/api/images/upload")
                        .file(file)
                        .param("description", "d")
                        .param("uploadedBy", "x"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Hiba a feltöltéskor: disk error")));
    }

    @Test
    void uploadImage_illegalArgument_returns400Message() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "pic.png", "image/png", "abc".getBytes(StandardCharsets.UTF_8)
        );

        when(imageService.uploadImage(any(), any(), any()))
                .thenThrow(new IllegalArgumentException("bad file"));

        mockMvc.perform(multipart("/api/images/upload")
                        .file(file))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("bad file"));
    }

    @Test
    void uploadImage_genericException_returns500Message() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "pic.png", "image/png", "abc".getBytes(StandardCharsets.UTF_8)
        );

        when(imageService.uploadImage(any(), any(), any()))
                .thenThrow(new RuntimeException("boom"));

        mockMvc.perform(multipart("/api/images/upload")
                        .file(file))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(containsString("Belső szerver hiba: boom")));
    }

    @Test
    void getAllImages_returnsList_andCoversConvertToDtoBranchWhenNoImageData() throws Exception {
        when(imageService.getAllImages()).thenReturn(List.of(imageWithoutData()));

        mockMvc.perform(get("/api/images"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].imageBase64").doesNotExist());
    }

    @Test
    void getImageById_present_returns200() throws Exception {
        when(imageService.getImageById(1L)).thenReturn(Optional.of(imageWithData()));

        mockMvc.perform(get("/api/images/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void getImageById_notFound_returns404() throws Exception {
        when(imageService.getImageById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/images/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Kép nem található!"));
    }

    @Test
    void downloadImage_present_returns200WithHeadersAndBytes() throws Exception {
        when(imageService.getImageById(1L)).thenReturn(Optional.of(imageWithData()));

        mockMvc.perform(get("/api/images/1/download"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"pic.png\""))
                .andExpect(header().string("Content-Type", "image/png"))
                .andExpect(content().bytes("abc".getBytes(StandardCharsets.UTF_8)));
    }

    @Test
    void downloadImage_notFound_returns404() throws Exception {
        when(imageService.getImageById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/images/1/download"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Kép nem található!"));
    }

    @Test
    void getImageByFileName_present_returns200() throws Exception {
        when(imageService.getImageByFileNameOrThrow("a.png")).thenReturn(imageWithData());

        mockMvc.perform(get("/api/images/by-name/a.png"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").value("pic.png"));
    }

    @Test
    void getImageByFileName_notFound_returns404() throws Exception {
        when(imageService.getImageByFileNameOrThrow("missing.png"))
                .thenThrow(new hu.nyirszikszi.renttech.exception.ResourceNotFoundException("Kép nem található!"));

        mockMvc.perform(get("/api/images/by-name/missing.png"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Kép nem található!"));
    }

    @Test
    void getImagesByUploadedBy_returnsList() throws Exception {
        when(imageService.getImagesByUploadedBy("john")).thenReturn(List.of(imageWithData()));

        mockMvc.perform(get("/api/images/by-user/john"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void updateImage_success_returns200() throws Exception {
        when(imageService.updateImage(1L, "new")).thenReturn(imageWithData());

        mockMvc.perform(put("/api/images/1")
                        .param("description", "new"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void updateImage_notFound_returns404() throws Exception {
        when(imageService.updateImage(1L, "new"))
                .thenThrow(new IllegalArgumentException("not found"));

        mockMvc.perform(put("/api/images/1")
                        .param("description", "new"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("not found"));
    }

    @Test
    void deleteImage_true_returns200() throws Exception {
        when(imageService.deleteImage(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/images/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Kép sikeresen törölve!"));
    }

    @Test
    void deleteImage_false_returns404() throws Exception {
        when(imageService.deleteImage(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/images/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Kép nem található!"));
    }
    @Test
    void getImageByFileName_nonUnique_returns409() throws Exception {
        when(imageService.getImageByFileNameOrThrow("dup.png"))
                .thenThrow(new hu.nyirszikszi.renttech.exception.ConflictException("Nem egyedi fájlnév"));

        mockMvc.perform(get("/api/images/by-name/dup.png"))
                .andExpect(status().isConflict());
    }
}