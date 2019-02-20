package ca.projectTOMi.tomi.assembler;

import java.net.URISyntaxException;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.controller.ClientController;
import ca.projectTOMi.tomi.model.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public final class ClientResourceAssembler implements ResourceAssembler<Client, Resource<Client>> {
	private final Logger logger = LoggerFactory.getLogger("Client Assembler");

	@Override
	public Resource<Client> toResource(final Client client) {
		final Resource<Client> resource = new Resource<>(client,
			linkTo(methodOn(ClientController.class).getClient(client.getId())).withSelfRel(),
			linkTo(methodOn(ClientController.class).getActiveClients()).withRel("clients"),
			linkTo(methodOn(ClientController.class).setClientInactive(client.getId())).withRel("delete"));

		try {
			resource.add(linkTo(methodOn(ClientController.class).updateClient(client.getId(), client)).withRel("update"));
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}

