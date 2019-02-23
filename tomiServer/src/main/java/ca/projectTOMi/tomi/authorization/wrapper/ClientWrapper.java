package ca.projectTOMi.tomi.authorization.wrapper;

import ca.projectTOMi.tomi.authorization.manager.UserAuthorizationManager;
import ca.projectTOMi.tomi.model.Client;
import lombok.Getter;

@Getter
public final class ClientWrapper {
	private final Client client;
	private final UserAuthorizationManager manager;

	public ClientWrapper(final Client client, final UserAuthorizationManager manager) {
		this.client = client;
		this.manager = manager;
	}
}
