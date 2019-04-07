package ca.projectTOMi.tomi.authorization.wrapper;

import ca.projectTOMi.tomi.authorization.manager.UserAuthManager;
import lombok.Getter;

/**
 * Wraps a model object with a UserAuthManager to pass both objects together to a resource
 * assembler.
 *
 * @param <E>
 * 	The object to be wrapper with the UserAuthManager.
 *
 * @author Karol Talbot
 * @version 1
 */
@Getter
public final class UserAuthLinkWrapper<E> {
	/**
	 * The object to be wrapped with the UserAuthManager.
	 */
	private final E modelObject;

	/**
	 * Manages policy access to TOMi objects.
	 */
	private final UserAuthManager manager;

	/**
	 * Creates a new UserAuthLinkWrapper with the provided parameters.
	 *
	 * @param modelObject
	 * 	The object to be wrapped with the UserAuthManager.
	 * @param manager
	 * 	The UserAuthManager for the requesting user.
	 */
	public UserAuthLinkWrapper(final E modelObject, final UserAuthManager manager) {
		this.modelObject = modelObject;
		this.manager = manager;
	}
}
