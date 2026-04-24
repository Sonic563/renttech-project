package hu.nyirszikszi.renttech.service;

import hu.nyirszikszi.renttech.domain.AvailabilityStatus;
import hu.nyirszikszi.renttech.model.Asset;
import hu.nyirszikszi.renttech.model.Category;
import hu.nyirszikszi.renttech.repository.AssetRepository;
import hu.nyirszikszi.renttech.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssetService {
    private final AssetRepository assetRepository;
    private final CategoryRepository categoryRepository;

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Optional<Asset> getAssetById(Long id) {
        return assetRepository.findById(id);
    }

    @Transactional
    public Asset createAsset(Asset asset) {
        if (asset.getAvailability() == null) {
            asset.setAvailability(AvailabilityStatus.ELÉRHETŐ);
        }

        asset.setCategory(resolveCategory(asset.getCategory()));
        return assetRepository.save(asset);
    }

    @Transactional
    public Asset updateAsset(Long id, Asset assetDetails) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        asset.setName(assetDetails.getName());
        asset.setDescription(assetDetails.getDescription());
        asset.setExtraDescription(assetDetails.getExtraDescription());
        asset.setDailyPrice(assetDetails.getDailyPrice());
        asset.setAvailability(assetDetails.getAvailability());
        asset.setCategory(resolveCategory(assetDetails.getCategory()));
        asset.setImageId(assetDetails.getImageId());
        asset.setImageUrl(assetDetails.getImageUrl());

        return assetRepository.save(asset);
    }

    private Category resolveCategory(Category incomingCategory) {
        if (incomingCategory == null) {
            return null;
        }

        if (incomingCategory.getId() != null) {
            return categoryRepository.findById(incomingCategory.getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        String categoryName = incomingCategory.getName();
        if (categoryName == null || categoryName.isBlank()) {
            return null;
        }

        String normalizedName = categoryName.trim();
        return categoryRepository.findByName(normalizedName)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(normalizedName)
                        .description("Automatikusan létrehozott kategória")
                        .build()));
    }

    public void deleteAsset(Long id) {
        if (!assetRepository.existsById(id)) {
            throw new RuntimeException("Asset not found");
        }
        assetRepository.deleteById(id);
    }
}