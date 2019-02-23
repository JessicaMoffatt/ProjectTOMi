package ca.projectTOMi.tomi.authorization.wrapper;

import ca.projectTOMi.tomi.authorization.manager.UserAuthManager;
import lombok.Getter;

@Getter
public final class UserAuthLinkWrapper<E> {
	private final E modelObject;
	private final UserAuthManager manager;

	public UserAuthLinkWrapper(final E modelObject, final UserAuthManager manager) {
		this.modelObject = modelObject;
		this.manager = manager;
	}
}
