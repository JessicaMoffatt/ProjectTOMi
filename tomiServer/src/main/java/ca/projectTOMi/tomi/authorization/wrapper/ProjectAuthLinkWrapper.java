package ca.projectTOMi.tomi.authorization.wrapper;

import ca.projectTOMi.tomi.authorization.manager.ProjectAuthManager;
import lombok.Getter;

@Getter
public final class ProjectAuthLinkWrapper<E> {
	private final E modelObject;
	private final ProjectAuthManager manager;

	public ProjectAuthLinkWrapper(final E modelObject, final ProjectAuthManager manager) {
		this.modelObject = modelObject;
		this.manager = manager;
	}
}