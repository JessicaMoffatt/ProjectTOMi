package ca.projectTOMi.tomi.authorization.wrapper;

import ca.projectTOMi.tomi.authorization.manager.ProjectAuthManager;
import lombok.Getter;
/**
 * Wraps a model object with a ProjectAuthManager to pass both objects together to a resource
 * assembler.
 *
 * @param <E>
 * 	The object to be wrapper with the ProjectAuthManager.
 *
 * @author Karol Talbot
 * @version 1
 */
@Getter
public final class ProjectAuthLinkWrapper<E> {
	/**
	 * The object to be wrapped with the ProjectAuthManager.
	 */
	private final E modelObject;

	/**
	 * Manages policy access to project objects.
	 */
	private final ProjectAuthManager manager;

	/**
	 * Creates a new ProjectAuthLinkWrapper with the provided parameters.
	 *
	 * @param modelObject
	 * 	The object to be wrapped with the ProjectAuthManager.
	 * @param manager
	 * 	The ProjectAuthManager for the requesting user.
	 */
	public ProjectAuthLinkWrapper(final E modelObject, final ProjectAuthManager manager) {
		this.modelObject = modelObject;
		this.manager = manager;
	}
}