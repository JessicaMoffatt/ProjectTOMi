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

	/**
	 * Repository responsible for accessing and persisting for Client objects.
	 */
	private final ClientRepository clientRepository;

	/**
	 * Constructor for the {@link Client} Service.
	 *
	 * @param clientRepository
	 * 	Repository responsible for persisting Client instances
	 */
	public ClientService(final ClientRepository clientRepository) {
		this.clientRepository = clientRepository;
	}

	/**
	 * Gets a list of all {@link Client}s that are active.
	 *
	 * @return List containing all Clients that are active
	 */
	public List<Client> getActiveClients() {
		return this.clientRepository.getAllByActiveOrderById(true);
	}

	/**
	 * Gets a {@link Client} object with the provided id.
	 *
	 * @param id
	 * 	the unique identifier for the Client to be found
	 *
	 * @return Client object matching the provided id
	 */
	public Client getClient(final Long id) {
		return this.clientRepository.findById(id).orElseThrow(ClientNotFoundException::new);
	}

	/**
	 * Persists the provided {@link Client}.
	 *
	 * @param client
	 * 	Client to be persisted
	 *
	 * @return the Client that was persisted
	 */
	public Client saveClient(final Client client) {
		return this.clientRepository.save(client);
	}

	/**
	 * Updates the {@link Client} with the provided id with the provided attributes.
	 *
	 * @param id
	 * 	the unique identifier for the Client to be updated
	 * @param newClient
	 * 	Client object containing the updated attributes
	 *
	 * @return Client containing the updated attributes
	 */
	public Client updateClient(final Long id, final Client newClient) {
		return this.clientRepository.findById(id).map(client -> {
			client.setActive(true);
			client.setName(newClient.getName());
			return this.clientRepository.save(client);
		}).orElseThrow(ClientNotFoundException::new);
	}
}
