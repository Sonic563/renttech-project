package hu.nyirszikszi.renttech.repository;

import hu.nyirszikszi.renttech.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {


    @Query("SELECT DISTINCT a FROM Asset a LEFT JOIN FETCH a.category")
    List<Asset> findAllWithCategory();

    @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.category WHERE a.id = ?1")
    Optional<Asset> findByIdWithCategory(Long id);

    @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.category WHERE a.category.name = ?1")
    List<Asset> findByCategoryName(String categoryName);
}