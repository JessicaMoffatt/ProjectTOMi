package ca.projectTOMi.tomi.controller;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.ClientResourceAssembler;
import ca.projectTOMi.tomi.model.Client;
import ca.projectTOMi.tomi.service.ClientService;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
public final class ClientController {
  private ClientService service;
  private ClientResourceAssembler assembler;

  /**
   * Constructor for this ClientController with parameters required for proper function of this
   * controller.
   *
   * @param assembler
   *   converts Client objects into resources
   * @param service
   *   provides services required for {@link Client} objects
   */
  public ClientController(ClientResourceAssembler assembler, ClientService service) {
    this.assembler = assembler;
    this.service = service;
  }

  /**
   * Returns a collection of all active {@link Client} the source of a GET request to /clients.
   *
   * @return Collection of resources representing all active Client
   */
  @GetMapping ("/clients")
  public Resources<Resource<Client>> getActiveClients() {
    List<Resource<Client>> account = service.getActiveClients().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(account,
      linkTo(methodOn(UserAccountController.class).getActiveAccounts()).withSelfRel());
  }

  /**
   * Returns a resource representing the requested {@link Client} to the source of a GET request to
   * /clients/id.
   *
   * @param id
   *   unique identifier for the Client
   *
   * @return Resource representing the Client object.
   */
  @GetMapping ("/clients/{id}")
  public Resource<Client> getClient(@PathVariable Long id) {
    Client client = service.getClient(id);
    return assembler.toResource(client);
  }

  /**
   * Creates a new {@link Client} with the attributes provided in the POST request to /clients.
   *
   * @param newClient
   *   an Client object with required information.
   *
   * @return response containing links to the newly created Client
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PostMapping ("/clients")
  public ResponseEntity<?> createClient(@RequestBody Client newClient) throws URISyntaxException {
    Resource<Client> resource = assembler.toResource(service.saveClient(newClient));

    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  /**
   * Updates the attributes for a {@link Client} with the provided id with the attributes provided
   * in the PUT request to /clients/id.
   *
   * @param id
   *   the unique identifier for the Client to be updated
   * @param newClient
   *   the updated Client
   *
   * @return response containing a link to the updated Client
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PutMapping ("/clients/{id}")
  public ResponseEntity<?> updateClient(@PathVariable Long id, @RequestBody Client newClient) throws URISyntaxException {
    Client updatedClient = service.updateClient(id, newClient);
    Resource<Client> resource = assembler.toResource(updatedClient);
    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  /**
   * Sets the requested {@link Client}'s active attribute false, removing it from the list of active
   * clients. Responds to the DELETE requests to /clients/id.
   *
   * @param id
   *   the unique identifier for the Client to be set inactive
   *
   * @return a response without any content
   */
  @DeleteMapping ("/clients/{id}")
  public ResponseEntity<?> setClientInactive(@PathVariable Long id) {
    Client client = service.getClient(id);
    client.setActive(false);
    service.saveClient(client);

    return ResponseEntity.noContent().build();
  }
}
