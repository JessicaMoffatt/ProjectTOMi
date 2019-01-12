package ca.projectTOMi.tomi.model;

import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.time.LocalDate;

/**
 * An entry is one weeks' worth of work on a specific component. Entries are part of timesheets and are used to determine billable and non billable hours, as well as the productivity of users.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
@Entity
@Data
public class Entry {

    /**
     * The unique identifier for this Entry. Used to distinguish between Entries.
     */
    @Id
    @GeneratedValue(generator = "entry_sequence")
    @SequenceGenerator(
            name = "entry_sequence",
            sequenceName = "entry_sequence",
            allocationSize = 1
    )
    private Long entryId;

    /**
     * The account of the user creating the entry.
     */
    @ManyToOne
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Account account;

    /**
     * The Project associated with the entry.
     */
    @ManyToOne
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Project project;

    /**
     * The Task associated with the entry.
     */
    @ManyToOne
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Task task;

    /**
     * The UnitType associated with the entry.
     */
    @ManyToOne
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private UnitType unitType;

    /**
     * Represents whether or not the entry has been approved by the project manager.
     */
    @Enumerated
    private Status status;

    /**
     * The name of the product that was created or worked on.
     */
    @Size(max = 100)
    private String component;

    /**
     * The Monday of the week this entry is for.
     */
    private LocalDate date;

    /**
     * This field has issues that need to be resolved:
     * 1. The hours array may need to be split from a weekly array to each day of the week for proper database normalization.
     * 2. Need to enforce that each day has at least 0 hours and no more than 24.
     */
    //TODO
    private Double[] hours;

    /**
     * The quantity of the unit type's unit that was produced.
     */
    @Min(0)
    private Double quantity;
}
