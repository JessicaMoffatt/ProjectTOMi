package ca.projectTOMi.tomi.authorization.wrapper;

import ca.projectTOMi.tomi.authorization.manager.TimesheetAuthManager;
import lombok.Getter;
/**
 * @author Karol Talbot
 * @param <E>
 */
@Getter
public final class TimesheetAuthLinkWrapper<E> {
	private final E modelObject;
	private final TimesheetAuthManager manager;

	public TimesheetAuthLinkWrapper(final E modelObject, final TimesheetAuthManager manager) {
		this.modelObject = modelObject;
		this.manager = manager;
	}
}
