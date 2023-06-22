package kjkim.kjkimspring.configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {
    // AWS 접근 키
    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    // AWS 비밀 키
    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;

    // AWS 지역
    @Value("${cloud.aws.region.static}")
    private String region;

    // AWS S3 클라이언트 설정을 위한 빈 생성
    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }
}

