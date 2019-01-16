package ca.projectTOMi.tomi.assembler;

import java.net.URISyntaxException;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.controller.ClientController;
import ca.projectTOMi.tomi.controller.ExpenseController;
import ca.projectTOMi.tomi.model.Client;
import ca.projectTOMi.tomi.model.Expense;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * ClientResourceAssembler is responsible for creating a standard resource for {@link Client}
 * objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
public class ClientResourceAssembler implements ResourceAssembler<Client, Resource<Client>> {
  @Override
  public Resource<Client> toResource(Client client) {
    Resource<Client> resource = new Resource<>(client,
      linkTo(methodOn(ClientController.class).getClient(client.getId())).withSelfRel(),
      linkTo(methodOn(ClientController.class).getActiveClients()).withRel("clients"),
      linkTo(methodOn(ClientController.class).setClientInactive(client.getId())).withRel("delete"));

    try {
      resource.add(linkTo(methodOn(ClientController.class).updateClient(client.getId(), client)).withRel("update"));
    } catch (URISyntaxException e) {
      System.out.println(e);
    }
    return resource;
  }
}

