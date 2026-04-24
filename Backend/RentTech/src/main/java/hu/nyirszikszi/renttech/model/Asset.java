package hu.nyirszikszi.renttech.model;

import hu.nyirszikszi.renttech.domain.AvailabilityStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "extra_description", columnDefinition = "TEXT")
    private String extraDescription;

    @Column(name = "daily_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status")
    @Builder.Default
    private AvailabilityStatus availability = AvailabilityStatus.ELÉRHETŐ;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "image_id")
    private Long imageId;

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;
}