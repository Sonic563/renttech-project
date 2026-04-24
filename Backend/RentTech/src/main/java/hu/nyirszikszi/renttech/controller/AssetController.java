package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.model.Asset;
import hu.nyirszikszi.renttech.repository.AssetRepository;
import hu.nyirszikszi.renttech.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;
    private final AssetRepository assetRepository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Asset> assets = assetRepository.findAllWithCategory();
            return ResponseEntity.ok(assets);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Hiba: " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssetById(@PathVariable Long id) {
        var assetOpt = assetService.getAssetById(id);

        if (assetOpt.isPresent()) {
            return ResponseEntity.ok(assetOpt.get());
        } else {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Eszköz nem található"));
        }
    }



    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createAsset(@RequestBody Asset asset) {
        try {
            System.out.println("CREATE ASSET REQUEST BODY: " + asset);
            Asset saved = assetService.createAsset(asset);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAsset(@PathVariable Long id, @RequestBody Asset assetDetails) {
        try {
            Asset updated = assetService.updateAsset(id, assetDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAsset(@PathVariable Long id) {
        try {
            assetService.deleteAsset(id);
            return ResponseEntity.ok(Map.of("message", "Az eszköz sikeresen törölve"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}
