package com.thiepCuoi.config;

import com.thiepCuoi.repository.UserRepository;
import com.thiepCuoi.repository.CategoryRepository;
import com.thiepCuoi.repository.TemplateRepository;
import com.thiepCuoi.repository.CardTemplateRepository;
import com.thiepCuoi.repository.entity.User;
import com.thiepCuoi.repository.entity.Category;
import com.thiepCuoi.repository.entity.Template;
import com.thiepCuoi.repository.entity.CardTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private TemplateRepository templateRepository;
    
    @Autowired
    private CardTemplateRepository cardTemplateRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Tự động tạo admin user nếu chưa có
        createAdminUserIfNotExists();
        
        // Chỉ load dữ liệu mẫu nếu database trống
        if (userRepository.count() <= 1) {
            loadSampleData();
        }
    }
    
    private void createAdminUserIfNotExists() {
        // Kiểm tra xem đã có admin chưa
        if (!userRepository.existsByUsername("admin")) {
            System.out.println("Creating default admin user...");
            
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@thiepCuoi.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Quản trị viên");
            admin.setRole(User.Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            userRepository.save(admin);
            
            System.out.println("Default admin user created successfully!");
        }
    }

    private void loadSampleData() {
        System.out.println("Loading sample data...");
        
        // Tạo users mẫu
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@thiepCuoi.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("Quản trị viên");
        admin.setRole(User.Role.ADMIN);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        userRepository.save(admin);

        User user1 = new User();
        user1.setUsername("user1");
        user1.setEmail("user1@example.com");
        user1.setPassword(passwordEncoder.encode("user123"));
        user1.setFullName("Nguyễn Văn A");
        user1.setRole(User.Role.USER);
        user1.setCreatedAt(LocalDateTime.now());
        user1.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user1);

        // Tạo categories mẫu
        Category classicCategory = new Category();
        classicCategory.setName("Cổ điển");
        classicCategory.setDescription("Thiệp cưới phong cách cổ điển, trang nhã");
        classicCategory.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(classicCategory);

        Category modernCategory = new Category();
        modernCategory.setName("Hiện đại");
        modernCategory.setDescription("Thiệp cưới phong cách hiện đại, tối giản");
        modernCategory.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(modernCategory);

        Category flowerCategory = new Category();
        flowerCategory.setName("Hoa văn");
        flowerCategory.setDescription("Thiệp cưới có hoa văn đẹp mắt");
        flowerCategory.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(flowerCategory);

        Category vintageCategory = new Category();
        vintageCategory.setName("Vintage");
        vintageCategory.setDescription("Thiệp cưới phong cách vintage cổ điển");
        vintageCategory.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(vintageCategory);

        // Tạo templates mẫu
        Template classicTemplate = new Template();
        classicTemplate.setName("Thiệp cổ điển vàng");
        classicTemplate.setDescription("Thiệp cưới màu vàng với hoa văn cổ điển");
        classicTemplate.setCategory(classicCategory);
        classicTemplate.setPrice(BigDecimal.valueOf(50000));
        classicTemplate.setImageUrl("/images/classic-gold.jpg");
        classicTemplate.setPreviewUrl("/images/classic-gold-preview.jpg");
        classicTemplate.setIsActive(true);
        classicTemplate.setCreatedAt(LocalDateTime.now());
        templateRepository.save(classicTemplate);

        Template modernTemplate = new Template();
        modernTemplate.setName("Thiệp hiện đại trắng");
        modernTemplate.setDescription("Thiệp cưới màu trắng phong cách tối giản");
        modernTemplate.setCategory(modernCategory);
        modernTemplate.setPrice(BigDecimal.valueOf(45000));
        modernTemplate.setImageUrl("/images/modern-white.jpg");
        modernTemplate.setPreviewUrl("/images/modern-white-preview.jpg");
        modernTemplate.setIsActive(true);
        modernTemplate.setCreatedAt(LocalDateTime.now());
        templateRepository.save(modernTemplate);

        Template roseTemplate = new Template();
        roseTemplate.setName("Thiệp hoa hồng");
        roseTemplate.setDescription("Thiệp cưới với hoa văn hoa hồng lãng mạn");
        roseTemplate.setCategory(flowerCategory);
        roseTemplate.setPrice(BigDecimal.valueOf(55000));
        roseTemplate.setImageUrl("/images/rose-pattern.jpg");
        roseTemplate.setPreviewUrl("/images/rose-pattern-preview.jpg");
        roseTemplate.setIsActive(true);
        roseTemplate.setCreatedAt(LocalDateTime.now());
        templateRepository.save(roseTemplate);

        Template vintageTemplate = new Template();
        vintageTemplate.setName("Thiệp vintage nâu");
        vintageTemplate.setDescription("Thiệp cưới màu nâu phong cách vintage");
        vintageTemplate.setCategory(vintageCategory);
        vintageTemplate.setPrice(BigDecimal.valueOf(48000));
        vintageTemplate.setImageUrl("/images/vintage-brown.jpg");
        vintageTemplate.setPreviewUrl("/images/vintage-brown-preview.jpg");
        vintageTemplate.setIsActive(true);
        vintageTemplate.setCreatedAt(LocalDateTime.now());
        templateRepository.save(vintageTemplate);

        // Tạo card template mẫu
        CardTemplate cardTemplate = new CardTemplate();
        cardTemplate.setTemplate(classicTemplate);
        cardTemplate.setTemplateName("Thiệp cổ điển vàng HTML");
        cardTemplate.setHtmlContent(
            "<div class=\"wedding-card classic-gold\">\n" +
            "    <div class=\"card-header\">\n" +
            "        <h1>{{groom_name}} & {{bride_name}}</h1>\n" +
            "    </div>\n" +
            "    <div class=\"card-body\">\n" +
            "        <p class=\"date\">{{wedding_date}}</p>\n" +
            "        <p class=\"time\">{{wedding_time}}</p>\n" +
            "        <p class=\"venue\">{{wedding_venue}}</p>\n" +
            "        <p class=\"message\">{{custom_message}}</p>\n" +
            "    </div>\n" +
            "    <div class=\"card-footer\">\n" +
            "        <p>Trân trọng kính mời</p>\n" +
            "    </div>\n" +
            "</div>"
        );
        cardTemplate.setCssContent(
            ".wedding-card.classic-gold {\n" +
            "    max-width: 500px;\n" +
            "    margin: 0 auto;\n" +
            "    background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);\n" +
            "    border: 1px solid #e0e0e0;\n" +
            "    padding: 40px;\n" +
            "    font-family: \"Inter\", sans-serif;\n" +
            "    text-align: center;\n" +
            "    color: #333;\n" +
            "    box-shadow: 0 4px 20px rgba(0,0,0,0.1);\n" +
            "}\n" +
            ".card-content h2 { font-size: 2rem; font-weight: 300; margin-bottom: 20px; }\n" +
            ".divider { width: 100px; height: 2px; background: #e91e63; margin: 20px auto; }\n" +
            ".date { font-size: 1.3rem; font-weight: 500; margin: 15px 0; }"
        );
        cardTemplate.setTemplateVariables("{\"groom_name\": \"Tên chú rể\", \"bride_name\": \"Tên cô dâu\", \"wedding_date\": \"Ngày cưới\", \"wedding_time\": \"Giờ cưới\", \"wedding_venue\": \"Địa điểm\", \"custom_message\": \"Lời nhắn\"}");
        cardTemplate.setPreviewImageUrl("/images/modern-white-template.jpg");
        cardTemplate.setVersion("1.0");
        cardTemplate.setIsActive(true);
        cardTemplate.setCreatedBy(admin);
        cardTemplate.setCreatedAt(LocalDateTime.now());
        cardTemplate.setUpdatedAt(LocalDateTime.now());
        cardTemplateRepository.save(cardTemplate);

        System.out.println("Sample data loaded successfully!");
    }
}