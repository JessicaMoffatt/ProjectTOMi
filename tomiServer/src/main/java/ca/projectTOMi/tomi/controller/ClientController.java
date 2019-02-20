package ca.projectTOMi.tomi.controller;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.ClientResourceAssembler;
import ca.projectTOMi.tomi.exception.ClientNotFoundException;
import ca.projectTOMi.tomi.model.Client;
import ca.projectTOMi.tomi.service.ClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * @author Karol Talbot
 * @version 1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class ClientController {
	private final ClientService service;
	private final ClientResourceAssembler assembler;
	private final Logger logger = LoggerFactory.getLogger("Client Controller");

	@Autowired
	public ClientController(final ClientService service, final ClientResourceAssembler assembler) {
		this.service = service;
		this.assembler = assembler;
	}

	/**
	 * Returns a collection of all active {@link Client} the source of a GET request to /clients.
	 *
	 * @return Collection of resources representing all active Client
	 */
	@GetMapping ("/clients")
	public Resources<Resource<Client>> getActiveClients() {
		final List<Resource<Client>> account = this.service.getActiveClients()
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(account, linkTo(methodOn(UserAccountController.class).getActiveAccounts()).withSelfRel());
	}

	/**
	 * Returns a resource representing the requested {@link Client} to the source of a GET request to
	 * /clients/id.
	 *
	 * @param id
	 * 	unique identifier for the Client
	 *
	 * @return Resource representing the Client object.
	 */
	@GetMapping ("/clients/{id}")
	public Resource<Client> getClient(@PathVariable final Long id) {
		final Client client = this.service.getClient(id);
		return this.assembler.toResource(client);
	}

	/**
	 * Creates a new {@link Client} with the attributes provided in the POST request to /clients.
	 *
	 * @param newClient
	 * 	an Client object with required information.
	 *
	 * @return response containing links to the newly created Client
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed
	 */
	@PostMapping ("/clients")
	public ResponseEntity<?> createClient(@RequestBody final Client newClient) throws URISyntaxException {
		final Resource<Client> resource = this.assembler.toResource(this.service.saveClient(newClient));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Updates the attributes for a {@link Client} with the provided id with the attributes provided
	 * in the PUT request to /clients/id.
	 *
	 * @param id
	 * 	the unique identifier for the Client to be updated
	 * @param newClient
	 * 	the updated Client
	 *
	 * @return response containing a link to the updated Client
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed
	 */
	@PutMapping ("/clients/{id}")
	public ResponseEntity<?> updateClient(@PathVariable final Long id, @RequestBody final Client newClient) throws URISyntaxException {
		final Client updatedClient = this.service.updateClient(id, newClient);
		final Resource<Client> resource = this.assembler.toResource(updatedClient);
		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Sets the requested {@link Client}'s active attribute false, removing it from the list of active
	 * clients. Responds to the DELETE requests to /clients/id.
	 *
	 * @param id
	 * 	the unique identifier for the Client to be set inactive
	 *
	 * @return a response without any content
	 */
	@DeleteMapping ("/clients/{id}")
	public ResponseEntity<?> setClientInactive(@PathVariable final Long id) {
		final Client client = this.service.getClient(id);
		client.setActive(false);
		this.service.saveClient(client);
		return ResponseEntity.noContent().build();
	}

	@ExceptionHandler ({ClientNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Client Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
