package ca.projectTOMi.tomi.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
import javax.persistence.MapKey;
import javax.persistence.MapKeyColumn;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

/**
 * An entry is one weeks' worth of work on a specific component. Entries are part of timesheets and are used to determine billable and non billable hours, as well as the productivity of users.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 1.2
 */
@Entity
@Data
public final class Entry {

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
    @MapKeyColumn(name = "id")
    private UserAccount userAccount;

    /**
     * The Project associated with the entry.
     */
    @ManyToOne
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @MapKeyColumn(name = "id")
    private Project project;

    /**
     * The Task associated with the entry.
     */
    @ManyToOne
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @MapKeyColumn(name = "id")
    private Task task;

    /**
     * The UnitType associated with the entry.
     */
    @ManyToOne
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @MapKeyColumn(name = "id")
    private UnitType unitType;

    /**
     * The timesheet associated with the entry.
     */
    @ManyToOne
    @MapKeyColumn(name="id")
    private Timesheet timesheet;

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
     * The hours worked on the Monday of the week for this Entry.
     */
    @Column(name = "monday_hours", scale = 2, nullable = false)
    @Min(0)
    @Max(24)
    private Double mondayHours = 0.00;

    /**
     * The hours worked on the Tuesday of the week for this Entry.
     */
    @Column(name = "tuesday_hours", scale = 2, nullable = false)
    @Min(0)
    @Max(24)
    private Double tuesdayHours = 0.00;

    /**
     * The hours worked on the Wednesday of the week for this Entry.
     */
    @Column(name = "wednesday_hours", scale = 2, nullable = false)
    @Min(0)
    @Max(24)
    private Double wednesdayHours = 0.00;

    /**
     * The hours worked on the Thursday of the week for this Entry.
     */
    @Column(name = "thursday_hours", scale = 2, nullable = false)
    @Min(0)
    @Max(24)
    private Double thursdayHours = 0.00;

    /**
     * The hours worked on the Friday of the week for this Entry.
     */
    @Column(name = "friday_hours", scale = 2, nullable = false)
    @Min(0)
    @Max(24)
    private Double fridayHours = 0.00;

    /**
     * The hours worked on the Saturday of the week for this Entry.
     */
    @Column(name = "saturday_hours", scale = 2, nullable = false)
    @Min(0)
    @Max(24)
    private Double saturdayHours = 0.00;

    /**
     * The hours worked on the Sunday of the week for this Entry.
     */
    @Column(name = "sunday_hours", scale = 2, nullable = false)
    @Min(0)
    @Max(24)
    private Double sundayHours = 0.00;

    /**
     * The total hours worked for the week for this Entry.
     */
    @Formula("monday_hours + tuesday_hours + wednesday_hours + thursday_hours + friday_hours + saturday_hours + sunday_hours")
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
