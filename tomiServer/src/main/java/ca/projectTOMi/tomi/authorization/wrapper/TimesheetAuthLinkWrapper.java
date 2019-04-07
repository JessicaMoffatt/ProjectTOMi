package ca.projectTOMi.tomi.authorization.wrapper;

import ca.projectTOMi.tomi.authorization.manager.TimesheetAuthManager;
import lombok.Getter;

/**
 * Wraps a model object with a TimesheetAuthManager to pass both objects together to a resource
 * assembler.
 *
 * @param <E>
 * 	The object to be wrapper with the TimesheetAuthManager.
 *
 * @author Karol Talbot
 * @version 1
 */
@Getter
public final class TimesheetAuthLinkWrapper<E> {
	/**
	 * The object to be wrapped with the TimesheetAuthManager.
	 */
	private final E modelObject;

	/**
	 * Manages policy access to timesheet objects.
	 */
	private final TimesheetAuthManager manager;

	/**
	 * Creates a new TimesheetAuthLinkWrapper with the provided parameters.
	 *
	 * @param modelObject
	 * 	The object to be wrapped with the TimesheetAuthManager.
	 * @param manager
	 * 	The TimesheetAuthManager for the requesting user.
	 */
	public TimesheetAuthLinkWrapper(final E modelObject, final TimesheetAuthManager manager) {
		this.modelObject = modelObject;
		this.manager = manager;
	}
}
