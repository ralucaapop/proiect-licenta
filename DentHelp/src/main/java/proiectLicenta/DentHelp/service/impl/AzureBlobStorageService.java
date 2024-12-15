package proiectLicenta.DentHelp.service.impl;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class AzureBlobStorageService {

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    public String uploadFile(MultipartFile file) throws IOException {
        BlobContainerClient containerClient = new BlobContainerClientBuilder()
                .connectionString(connectionString)
                .containerName(containerName)
                .buildClient();

        // Generează un nume unic pentru fișier
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        // Obține un client pentru blob
        BlobClient blobClient = containerClient.getBlobClient(fileName);

        // Încarcă fișierul
        blobClient.upload(file.getInputStream(), file.getSize(), true);

        // Returnează URL-ul fișierului
        return blobClient.getBlobUrl();
    }
}
