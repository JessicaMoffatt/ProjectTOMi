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
 *
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
public class ClientController {
  ClientService service;
  ClientResourceAssembler assembler;

  public ClientController(ClientResourceAssembler assembler, ClientService service){
    this.assembler = assembler;
    this.service = service;
  }

  @GetMapping("/clients")
  public Resources<Resource<Client>> getActiveClients(){
    List<Resource<Client>> account = service.getActiveClients().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(account,
      linkTo(methodOn(UserAccountController.class).getActiveAccounts()).withSelfRel());
  }

  @GetMapping("/clients/{id}")
  public Resource<Client> getClient(@PathVariable Long id){
    Client client = service.getClient(id);
    return assembler.toResource(client);
  }

  @PostMapping("/clients")
  public ResponseEntity<?> createClient(@RequestBody Client newClient) throws URISyntaxException {
    Resource<Client> resource = assembler.toResource(service.saveClient(newClient));

    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  @PutMapping("/clients/{id}")
  public ResponseEntity<?> updateClient(@PathVariable Long id, @RequestBody Client newClient) throws URISyntaxException {
    Client updatedClient = service.updateClient(id, newClient);
    Resource<Client> resource = assembler.toResource(updatedClient);
    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  @DeleteMapping ("/clients/{id}")
  public ResponseEntity<?> setClientInactive(@PathVariable Long id) {
    Client client = service.getClient(id);
    client.setActive(false);
    service.saveClient(client);

    return ResponseEntity.noContent().build();
  }
}
