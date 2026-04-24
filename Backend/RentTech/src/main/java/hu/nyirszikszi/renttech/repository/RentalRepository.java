package hu.nyirszikszi.renttech.repository;

import hu.nyirszikszi.renttech.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    List<Rental> findByUserId(Long userId);


    List<Rental> findByAssetId(Long deviceId);

    @Query("""
        SELECT COUNT(r) FROM Rental r
        WHERE r.asset.id = :deviceId
          AND r.status <> 'lemondva'
          AND r.startDate <= :end
          AND r.endDate >= :start
    """)
    int countOverlapping(
            @Param("deviceId") Long deviceId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}