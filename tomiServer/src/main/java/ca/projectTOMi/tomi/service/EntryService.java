package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.exception.EntryNotFoundException;
import ca.projectTOMi.tomi.exception.IllegalEntryStateException;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.persistence.EntryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@Link Entry} objects.
 *
 * @author Iliya Kiritchkov
 * @version 1
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
     *
     * @param id       the unique identifier for the Entry to update.
     * @param newEntry Entry object containing the updated attributes.
     * @return Entry containing the updated attributes.
     */
    public Entry updateEntry(Long id, Entry newEntry) {
        return repository.findById(id).map(entry -> {
            entry.setComponent(newEntry.getComponent());
            entry.setProject(newEntry.getProject());
            entry.setQuantity(newEntry.getQuantity());
            entry.setTask(newEntry.getTask());
            entry.setUnitType(newEntry.getUnitType());
            entry.setMondayHours(newEntry.getMondayHours());
            entry.setTuesdayHours(newEntry.getTuesdayHours());
            entry.setWednesdayHours(newEntry.getWednesdayHours());
            entry.setThursdayHours(newEntry.getTuesdayHours());
            entry.setFridayHours(newEntry.getFridayHours());
            entry.setSaturdayHours(newEntry.getSaturdayHours());
            entry.setSundayHours(newEntry.getSundayHours());
            entry.setStatus(Status.LOGGING);

            return repository.save(entry);
        }).orElseThrow(() -> new EntryNotFoundException());
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
     * Persists the provided {@Link Entry}
     *
     * @param entry Entry to be persisted.
     * @return Entry that was persisted.
     */
    public Entry saveEntry(Entry entry) {
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
}