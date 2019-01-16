package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.exception.ClientNotFoundException;
import ca.projectTOMi.tomi.model.Client;
import ca.projectTOMi.tomi.persistence.ClientRepository;
import org.springframework.stereotype.Service;

@Service
public class ClientService {
  ClientRepository repository;

  public ClientService(ClientRepository repository) {
    this.repository = repository;
  }

  public List<Client> getActiveClients() {
    return repository.getAllByActive(true);
  }

  public Client getClient(Long id) {
    return this.repository.findById(id).orElseThrow(() -> new ClientNotFoundException());
  }

  public Client saveClient(Client client) {
    return repository.save(client);
  }

  public Client updateClient(Long id, Client newClient) {
    return repository.findById(id).map(client -> {
      client.setActive(newClient.isActive());
      client.setName(newClient.getName());
      return repository.save(client);
    }).orElseThrow(() -> new ClientNotFoundException());
  }
}
