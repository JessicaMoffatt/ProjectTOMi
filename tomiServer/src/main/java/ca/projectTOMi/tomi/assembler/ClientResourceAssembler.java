package ca.projectTOMi.tomi.assembler;

import java.net.URISyntaxException;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.controller.ClientController;
import ca.projectTOMi.tomi.model.Client;
import ca.projectTOMi.tomi.authorization.wrapper.ClientWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Link;
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
public final class ClientResourceAssembler implements ResourceAssembler<ClientWrapper, Resource<Client>> {
	private final Logger logger = LoggerFactory.getLogger("Client Assembler");

	@Override
	public Resource<Client> toResource(final ClientWrapper clientWrapper) {
		final Client client = clientWrapper.getClient();
		final Resource<Client> resource = new Resource<>(client,
			linkTo(methodOn(ClientController.class).getClient(client.getId(), null)).withSelfRel(),
			linkTo(methodOn(ClientController.class).getActiveClients(null)).withRel("clients")
		);

		final Link deleteLink = linkTo(methodOn(ClientController.class).setClientInactive(client.getId())).withRel("delete");
		if (clientWrapper.getManager().linkAuthorization(deleteLink.getHref(), "DELETE")) {
			resource.add(deleteLink);
		}
		try {
			final Link updateLink = linkTo(methodOn(ClientController.class).updateClient(client.getId(), client, null)).withRel("update");
			if(clientWrapper.getManager().linkAuthorization(updateLink.getHref(), "PUT")) {
				resource.add(updateLink);
			}
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}

