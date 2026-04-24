package hu.nyirszikszi.renttech.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @GetMapping
    public List<Map<String, Object>> getAllCategories() {


        return Arrays.asList(
                Map.of(
                        "id", 1L,
                        "name", "Laptopok",
                        "description", "Hordozható számítógépek",
                        "assetCount", 2
                ),
                Map.of(
                        "id", 2L,
                        "name", "Fényképezőgépek",
                        "description", "Digitális fényképezőgépek",
                        "assetCount", 1
                ),
                Map.of(
                        "id", 3L,
                        "name", "Projektorok",
                        "description", "Projektorok prezentációkhoz",
                        "assetCount", 0
                ),
                Map.of(
                        "id", 4L,
                        "name", "Hangrendszerek",
                        "description", "Hangosítási berendezések",
                        "assetCount", 0
                )
        );
    }
}