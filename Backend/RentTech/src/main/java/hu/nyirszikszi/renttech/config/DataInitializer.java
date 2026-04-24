package hu.nyirszikszi.renttech.config;

import hu.nyirszikszi.renttech.domain.AvailabilityStatus;
import hu.nyirszikszi.renttech.model.Asset;
import hu.nyirszikszi.renttech.model.Category;
import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.repository.AssetRepository;
import hu.nyirszikszi.renttech.repository.CategoryRepository;
import hu.nyirszikszi.renttech.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {


        if (categoryRepository.count() == 0) {
            List<Category> categories = List.of(
                    Category.builder().name("Laptopok").description("Hordozható számítógépek").build(),
                    Category.builder().name("Fényképezőgépek").description("Digitális fényképezőgépek").build(),
                    Category.builder().name("Projektorok").description("Projektorok prezentációkhoz").build(),
                    Category.builder().name("Hangrendszerek").description("Hangosítási berendezések").build(),
                    Category.builder().name("Egyéb").description("Egyéb technikai eszközök").build()
            );
            categoryRepository.saveAll(categories);

        }

        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .email("admin@rentech.hu")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("RentTech Admin")
                    .role(User.UserRole.ADMIN)
                    .build();

            User user = User.builder()
                    .email("user@example.com")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Demo User")
                    .phone("+36987654321")
                    .role(User.UserRole.USER)
                    .build();

            userRepository.saveAll(List.of(admin, user));

        }

        if (assetRepository.count() == 0 && categoryRepository.count() > 0) {
            Category laptops = categoryRepository.findByName("Laptopok").orElseThrow();
            Category cameras = categoryRepository.findByName("Fényképezőgépek").orElseThrow();




        }
    }
}