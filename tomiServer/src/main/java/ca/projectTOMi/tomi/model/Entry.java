package ca.projectTOMi.tomi.model;

import lombok.Data;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

/**
 * An entry is one weeks' worth of work on a specific component. Entries are part of timesheets and are used to determine billable and non billable hours, as well as the productivity of users.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
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
    private Long id;

    /**
     * The userAccount of the user creating the entry.
     */
    @NotNull
    @ManyToOne
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private UserAccount userAccount;

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
     * The Monday of the week this Entry is for.
     */
    private LocalDate date;

    /**
     * The hours worked on the Monday of the week for this Entry.
     */
    @Column(scale = 2)
    @Min(0)
    @Max(24)
    private Double mondayHours;

    /**
     * The hours worked on the Tuesday of the week for this Entry.
     */
    @Column(scale = 2)
    @Min(0)
    @Max(24)
    private Double tuesdayHours;

    /**
     * The hours worked on the Wednesday of the week for this Entry.
     */
    @Column(scale = 2)
    @Min(0)
    @Max(24)
    private Double wednesdayHours;

    /**
     * The hours worked on the Thursday of the week for this Entry.
     */
    @Column(scale = 2)
    @Min(0)
    @Max(24)
    private Double thursdayHours;

    /**
     * The hours worked on the Friday of the week for this Entry.
     */
    @Column(scale = 2)
    @Min(0)
    @Max(24)
    private Double fridayHours;

    /**
     * The hours worked on the Saturday of the week for this Entry.
     */
    @Column(scale = 2)
    @Min(0)
    @Max(24)
    private Double saturdayHours;

    /**
     * The hours worked on the Sunday of the week for this Entry.
     */
    @Column(scale = 2)
    @Min(0)
    @Max(24)
    private Double sundayHours;

    /**
     * The total hours worked for the week for this Entry.
     */
    @Formula("mondayHours + tuesdayHours + wednesdayHours + thursdayHours + fridayHours + saturdayHours + sundayHours")
    private Double totalHours;

    /**
     * The quantity of the unit type's unit that was produced.
     */
    @Min(0)
    private Double quantity;

    /**
     * If this Entry is active.
     */
    @Column(nullable = false)
    private boolean active;
}
