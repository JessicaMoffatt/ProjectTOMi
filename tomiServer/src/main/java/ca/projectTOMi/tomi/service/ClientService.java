package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.exception.ClientNotFoundException;
import ca.projectTOMi.tomi.model.Client;
import ca.projectTOMi.tomi.persistence.ClientRepository;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link Client} objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public final class ClientService {
  private ClientRepository repository;

  /**
   * Constructor for the {@link Client} Service.
   *
   * @param repository
   *   Repository responsible for persisting Client instances
   */
  public ClientService(ClientRepository repository) {
    this.repository = repository;
  }

  /**
   * Gets a list of all {@link Client}s that are active.
   *
   * @return List containing all Clients that are active
   */
  public List<Client> getActiveClients() {
    return repository.getAllByActive(true);
  }

  /**
   * Gets a {@link Client} object with the provided id.
   *
   * @param id
   *   the unique identifier for the Client to be found
   *
   * @return Client object matching the provided id
   */
  public Client getClient(Long id) {
    return this.repository.findById(id).orElseThrow(() -> new ClientNotFoundException());
  }

  /**
   * Persists the provided {@link Client}.
   *
   * @param client
   *   Client to be persisted
   *
   * @return the Client that was persisted
   */
  public Client saveClient(Client client) {
    return repository.save(client);
  }

  /**
   * Updates the {@link Client} with the provided id with the provided attributes.
   *
   * @param id
   *   the unique identifier for the Client to be updated
   * @param newClient
   *   Client object containing the updated attributes
   *
   * @return Client containing the updated attributes
   */
  public Client updateClient(Long id, Client newClient) {
    return repository.findById(id).map(client -> {
      client.setActive(newClient.isActive());
      client.setName(newClient.getName());
      return repository.save(client);
    }).orElseThrow(() -> new ClientNotFoundException());
  }
}
