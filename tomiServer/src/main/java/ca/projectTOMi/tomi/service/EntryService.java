package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.exception.EntryNotFoundException;
import ca.projectTOMi.tomi.exception.IllegalEntryStateException;
import ca.projectTOMi.tomi.exception.IllegalTimesheetModificationException;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.EntryRepository;
import ca.projectTOMi.tomi.persistence.TimesheetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Provides services for {@link Entry} objects.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 1.1
 */
@Service
public class EntryService {
	private final EntryRepository entryRepository;
	private final TimesheetRepository timesheetRepository;

	/**
	 * Constructor for the EntryService component.
	 *
	 * @param entryRepository
	 * 	Repository responsible for persisting {@link Entry} instances.
	 */
	public EntryService(final EntryRepository entryRepository, final TimesheetRepository timesheetRepository) {
		this.entryRepository = entryRepository;
		this.timesheetRepository = timesheetRepository;
	}

	/**
	 * Updates the {@link Entry} with the provided id with the provided attributes. If the updated
	 * Entry has a Status of APPROVED or SUBMITTED, an IllegalEntryStateException will be raised as
	 * these statuses do not allow any modification of the contents of an Entry object.
	 * <p>
	 * If the updated Entry has a Status of LOGGING, the existing Entry will be updated to contain the
	 * updated attributes.
	 * <p>
	 * If the updated Entry has a Status of REJECTED, a new Entry object will be created with
	 * identical content to the rejected Entry and it will be saved with an Active status of false.
	 * The existing Entry Status will be set to LOGGING.
	 *
	 * @param id
	 * 	the unique identifier for the Entry to update.
	 * @param updatedEntry
	 * 	Entry object containing the updated attributes.
	 *
	 * @return Entry containing the updated attributes.
	 */
	public Entry updateEntry(final Long id, final Entry updatedEntry) {
		final Entry entry = this.entryRepository.findById(id).orElseThrow(EntryNotFoundException::new);
		switch (entry.getStatus()) {
			case APPROVED:
				throw new IllegalEntryStateException();

			case SUBMITTED:
				throw new IllegalEntryStateException();

			case REJECTED:
				final Entry modifiedEntry = new Entry();
				modifiedEntry.setComponent(updatedEntry.getComponent());
				modifiedEntry.setProject(updatedEntry.getProject());
				modifiedEntry.setQuantity(updatedEntry.getQuantity());
				modifiedEntry.setTask(updatedEntry.getTask());
				modifiedEntry.setUnitType(updatedEntry.getUnitType());
				modifiedEntry.setMondayHours(updatedEntry.getMondayHours());
				modifiedEntry.setTuesdayHours(updatedEntry.getTuesdayHours());
				modifiedEntry.setWednesdayHours(updatedEntry.getWednesdayHours());
				modifiedEntry.setThursdayHours(updatedEntry.getTuesdayHours());
				modifiedEntry.setFridayHours(updatedEntry.getFridayHours());
				modifiedEntry.setSaturdayHours(updatedEntry.getSaturdayHours());
				modifiedEntry.setSundayHours(updatedEntry.getSundayHours());
				modifiedEntry.setStatus(Status.LOGGING);
				modifiedEntry.setActive(true);
				this.entryRepository.save(modifiedEntry);

				entry.setActive(false);
				this.entryRepository.save(entry);
				break;

			case LOGGING:
				entry.setComponent(updatedEntry.getComponent());
				entry.setProject(updatedEntry.getProject());
				entry.setQuantity(updatedEntry.getQuantity());
				entry.setTask(updatedEntry.getTask());
				entry.setUnitType(updatedEntry.getUnitType());
				entry.setMondayHours(updatedEntry.getMondayHours());
				entry.setTuesdayHours(updatedEntry.getTuesdayHours());
				entry.setWednesdayHours(updatedEntry.getWednesdayHours());
				entry.setThursdayHours(updatedEntry.getTuesdayHours());
				entry.setFridayHours(updatedEntry.getFridayHours());
				entry.setSaturdayHours(updatedEntry.getSaturdayHours());
				entry.setSundayHours(updatedEntry.getSundayHours());
				entry.setTimesheet(timesheetRepository.findById(entry.getTimesheet().getId()).orElse(entry.getTimesheet()));
				entry.setStatus(Status.LOGGING);
				entry.setActive(true);
				this.entryRepository.save(entry);
				break;
		}

		return entry;
	}

	/**
	 * Gets a {@link Entry} object with the provided id.
	 *
	 * @param id
	 * 	the unique identifier for the Entry to find.
	 *
	 * @return Entry object matching the provided id.
	 */
	public Entry getEntry(final Long id) {
		return this.entryRepository.findById(id).orElseThrow(EntryNotFoundException::new);
	}

	/**
	 * Persists the provided {@link Entry} and sets its Status to LOGGING.
	 *
	 * @param entry
	 * 	Entry to be persisted.
	 *
	 * @return Entry that was persisted.
	 */
	public Entry saveEntry(final Entry entry) {
		entry.setStatus(Status.LOGGING);
		entry.setActive(true);
		entry.setQuantity(0.0);
		entry.setTimesheet(timesheetRepository.findById(entry.getTimesheet().getId()).orElse(entry.getTimesheet()));
		return this.entryRepository.save(entry);
	}

	/**
	 * Deletes an {@link Entry} object. The delete action is based on the current Status of the Entry.
	 * If the status is LOGGING then the Entry will be physically deleted from the database,
	 * otherwise, the Entry active field will be set to false.
	 *
	 * @param id
	 * 	id of the Entry to be deleted.
	 */
	public void deleteEntry(final Long id) {
		final Entry entry = this.getEntry(id);

		if (entry.getStatus().equals(Status.LOGGING)) {
			this.entryRepository.delete(entry);
		} else {
			entry.setActive(false);
			this.entryRepository.save(entry);
		}
	}

	private void submitTimesheetEntries(final Timesheet timesheet) {
		final List<Entry> entries = this.entryRepository.getAllByActiveTrueAndTimesheetOrderById(timesheet);
		for (final Entry e : entries) {
			if (e.getStatus() != Status.APPROVED) {
				e.setStatus(Status.SUBMITTED);
			}
			this.entryRepository.save(e);
		}
	}

	/**
	 * Gets a List of all {@link Entry} objects that are active.
	 *
	 * @return List containing all Entries that are active.
	 */
	public List<Entry> getActiveEntries() {
		return new ArrayList<>(this.entryRepository.getAllByActiveOrderById(true));
	}

	public Entry copyEntry(final Long entryId) {
		final Entry copy = this.entryRepository.findById(entryId).orElseThrow(EntryNotFoundException::new);
		final Entry newEntry = new Entry();
		newEntry.setStatus(Status.LOGGING);
		newEntry.setActive(true);
		newEntry.setTimesheet(copy.getTimesheet().getId());
		newEntry.setComponent(copy.getComponent());
		newEntry.setUnitType(copy.getUnitType());
		newEntry.setTask(copy.getTask());
		newEntry.setMondayHours(0.0);
		newEntry.setTuesdayHours(0.0);
		newEntry.setWednesdayHours(0.0);
		newEntry.setThursdayHours(0.0);
		newEntry.setFridayHours(0.0);
		newEntry.setSaturdayHours(0.0);
		newEntry.setSundayHours(0.0);
		newEntry.setQuantity(0.0);
		newEntry.setProject(copy.getProject());
		return this.entryRepository.save(newEntry);
	}

	/**
	 * Gets a list of all @{link Timesheet}s that are active.
	 *
	 * @return List containing all Timesheet that are active
	 */
	public List<Timesheet> getActiveTimesheets() {
		return this.timesheetRepository.getAllByActiveOrderById(true);
	}


	public List<Entry> getEntriesByTimesheet(final Long timesheetId) {
		final Timesheet timesheet = this.timesheetRepository.findById(timesheetId).orElseThrow(TimesheetNotFoundException::new);

		return this.entryRepository.getAllByActiveTrueAndTimesheetOrderById(timesheet);
	}

	/**
	 * Persists the provided {@link Timesheet}.
	 *
	 * @param timesheet
	 * 	Timesheet to be persisted
	 *
	 * @return the Timesheet that was persisted
	 */
	public Timesheet saveTimesheet(final Timesheet timesheet) {
		return this.timesheetRepository.save(timesheet);
	}

	/**
	 * Gets a {@link Timesheet} object with the provided id.
	 *
	 * @param id
	 * 	the unique identifier for the Timesheet to be found
	 *
	 * @return Timesheet object matching the provided id
	 */
	public Timesheet getTimesheetById(final Long id) {
		return this.timesheetRepository.findById(id).orElseThrow(TimesheetNotFoundException::new);
	}

	/**
	 * Updates the Timesheet with the provided id with the provided attributes.
	 *
	 * @param id
	 * 	the unique identifier for the Timesheet to be updated
	 * @param newTimesheet
	 * 	Timesheet object containing the updated attributes
	 *
	 * @return Timesheet containing the updated attributes
	 */
	public Timesheet updateTimesheet(final Long id, final Timesheet newTimesheet) {
		return this.timesheetRepository.findById(id).map(timesheet -> {
				timesheet.setStatus(newTimesheet.getStatus());
				timesheet.setSubmitDate(newTimesheet.getSubmitDate());
				timesheet.setId(newTimesheet.getId());
				return timesheet;
			}
		).orElseThrow(TimesheetNotFoundException::new);
	}

	/**
	 * Creates a new timesheet with the provided date for the provided user.
	 *
	 * @param date
	 * 	The week the timesheet if required for
	 * @param userAccount
	 * 	The account of the user
	 *
	 * @return if the account was created successfully
	 */
	boolean createTimesheet(final LocalDate date, final UserAccount userAccount) {
		final Timesheet t = new Timesheet();
		t.setStatus(Status.LOGGING);
		t.setStartDate(date);
		t.setUserAccount(userAccount);
		t.setActive(true);

		return t == this.timesheetRepository.save(t);
	}

	public Timesheet submitTimesheet(final Long id) {
		Timesheet timesheet = this.timesheetRepository.findById(id).orElseThrow(TimesheetNotFoundException::new);
		final LocalDate date = LocalDate.now();
		if (timesheet.getStatus() == Status.LOGGING || timesheet.getStatus() == Status.REJECTED) {
			final List<Status> entryStatuses = this.timesheetRepository.getEntriesStatusesByTimesheet(timesheet.getId());
			if (entryStatuses.contains(Status.REJECTED)) {
				throw new IllegalTimesheetModificationException();
			} else {
				this.submitTimesheetEntries(timesheet);
			}
			timesheet.setStatus(Status.SUBMITTED);
			timesheet.setSubmitDate(date.toString());
			timesheet = this.timesheetRepository.save(timesheet);
		} else {
			throw new IllegalTimesheetModificationException();
		}

		return timesheet;
	}

	/**
	 * Evaluates the {@link Status} of the timesheet with the provided id. If all {@link
	 * ca.projectTOMi.tomi.model.Entry}s are approved the timesheet is given the approved status. If
	 * all entries are approved or rejected the timesheet is given the rejected status. Otherwise,
	 * it's status remains unchanged.
	 *
	 * @param id
	 * 	the unique identifier for the timesheet
	 */
	public void evaluateTimesheet(final Long id) {
		final List<Status> statuses = this.timesheetRepository.getEntriesStatusesByTimesheet(id);
		final Timesheet timesheet = this.timesheetRepository.findById(id).orElseThrow(TimesheetNotFoundException::new);
		if (!statuses.contains(Status.SUBMITTED) && !statuses.contains(Status.LOGGING)) {
			if (statuses.contains(Status.REJECTED)) {
				timesheet.setStatus(Status.REJECTED);
			} else {
				timesheet.setStatus(Status.APPROVED);
			}
			this.timesheetRepository.save(timesheet);
		}
	}

	List<Timesheet> getTimesheetsByUserAccount(final UserAccount userAccount) {
		return this.timesheetRepository.getAllByActiveTrueAndUserAccountOrderByStartDateDesc(userAccount);
	}

	public List<Entry> getEntriesToEvaluate(final Project project) {
		return this.entryRepository.getAllByActiveTrueAndProjectAndStatus(project, Status.SUBMITTED);
	}

	public boolean evaluateEntry(final Long entryId, final Status status){
		final Entry entry = this.entryRepository.findById(entryId).orElseThrow(EntryNotFoundException::new);
		if(entry.getStatus() == Status.SUBMITTED) {
			entry.setStatus(status);
			this.entryRepository.save(entry);
			this.evaluateTimesheet(entry.getTimesheet().getId());
			return true;
		}
		return false;
	}
}