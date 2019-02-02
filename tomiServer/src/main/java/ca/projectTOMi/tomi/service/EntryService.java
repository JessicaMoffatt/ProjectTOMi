package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.exception.EntryNotFoundException;
import ca.projectTOMi.tomi.exception.IllegalEntryStateException;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.persistence.EntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Provides services for {@Link Entry} objects.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 1.1
 */
@Service
public class EntryService {
    private EntryRepository repository;

    /**
     * Constructor for the EntryService component.
     *
     * @param repository Repository responsible for persisting {@Link Entry} instances.
     */
    public EntryService(EntryRepository repository) {
        this.repository = repository;
    }

    /**
     * Updates the {@Link Entry} with the provided id with the provided attributes.
     * If the updated Entry has a Status of APPROVED or SUBMITTED, an IllegalEntryStateException will
     * be raised as these statuses do not allow any modofication of the contents of an Entry object.
     * <p>
     * If the updated Entry has a Status of LOGGING, the existing Entry will be updated to contain the updated attributes.
     * <p>
     * If the updated Entry has a Status of REJECTED, a new Entry object will be created with identical content to the rejected Entry and it will be saved with an Active status of false. The existing Entry Status will be set to LOGGING.
     *
     * @param id       the unique identifier for the Entry to update.
     * @param updatedEntry Entry object containing the updated attributes.
     * @return Entry containing the updated attributes.
     */
    public Entry updateEntry(Long id, Entry updatedEntry) {
        Entry entry = repository.findById(id).orElseThrow(() -> new EntryNotFoundException());

        switch (entry.getStatus()) {
            case APPROVED:
                throw new IllegalEntryStateException();

            case SUBMITTED:
                throw new IllegalEntryStateException();

            case REJECTED:
                Entry rejectedEntry = new Entry();
                rejectedEntry.setDate(updatedEntry.getDate());
                rejectedEntry.setComponent(updatedEntry.getComponent());
                rejectedEntry.setProject(updatedEntry.getProject());
                rejectedEntry.setQuantity(updatedEntry.getQuantity());
                rejectedEntry.setTask(updatedEntry.getTask());
                rejectedEntry.setUnitType(updatedEntry.getUnitType());
                rejectedEntry.setMondayHours(updatedEntry.getMondayHours());
                rejectedEntry.setTuesdayHours(updatedEntry.getTuesdayHours());
                rejectedEntry.setWednesdayHours(updatedEntry.getWednesdayHours());
                rejectedEntry.setThursdayHours(updatedEntry.getTuesdayHours());
                rejectedEntry.setFridayHours(updatedEntry.getFridayHours());
                rejectedEntry.setSaturdayHours(updatedEntry.getSaturdayHours());
                rejectedEntry.setSundayHours(updatedEntry.getSundayHours());
                rejectedEntry.setStatus(Status.REJECTED);
                rejectedEntry.setActive(false);
                repository.save(rejectedEntry);

                entry.setStatus(Status.LOGGING);
                repository.save(entry);
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
                entry.setTimesheet(updatedEntry.getTimesheet());
                entry.setStatus(Status.LOGGING);
                entry.setActive(true);
                repository.save(entry);
                break;
        }

        return entry;
    }

    /**
     * Gets a {@link Entry} object with the provided id.
     *
     * @param id the unique identifier for the Entry to find.
     * @return Entry object matching the provided id.
     */
    public Entry getEntry(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntryNotFoundException());
    }

    /**
     * Persists the provided {@Link Entry} and sets its Status to LOGGING.
     *
     * @param entry Entry to be persisted.
     * @return Entry that was persisted.
     */
    public Entry saveEntry(Entry entry) {
        entry.setStatus(Status.LOGGING);
        return repository.save(entry);
    }

    /**
     * Deletes an {@Link Entry} object. The delete action is based on the current Status of the Entry.
     * If the status is LOGGING then the Entry will be physically deleted from the database, otherwise,
     * the Entry active field will be set to false.
     *
     * @param id id of the Entry to be deleted.
     */
    public void deleteEntry(Long id) {
        Entry entry = this.getEntry(id);

        if (entry.getStatus().equals(Status.LOGGING)) {
            repository.delete(entry);
        } else {
            entry.setActive(false);
            repository.save(entry);
        }
    }

    public void submitTimesheetEntries(Timesheet timesheet){
        List<Entry> entries = repository.getAllByActiveTrueAndTimesheet(timesheet);
        for(Entry e: entries){
            if(e.getStatus() != Status.APPROVED) {
                e.setStatus(Status.SUBMITTED);
            }
            repository.save(e);
        }
    }

    /**
     * Gets a List of all {@Link Entry} objects that are active.
     *
     * @return List containing all Entries that are active.
     */
    public List<Entry> getActiveEntries() {
        return repository.getAllByActive(true).stream().collect(Collectors.toList());
    }
}