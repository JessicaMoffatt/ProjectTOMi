package ca.projectTOMi.tomi.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * A model class that contains information about accounts in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Entity
@Data
public final class UserAccount {
	/**
	 * The unique identifier for this UserAccount. Used to distinguish between Accounts.
	 */
	@Id
	@GeneratedValue (generator = "user_account_sequence")
	@SequenceGenerator (
		name = "user_account_sequence",
		sequenceName = "user_account_sequence",
		allocationSize = 1
	)
	private Long id;

	/**
	 * The team this UserAccount is a member of.
	 */
	@ManyToOne
	@OnDelete (action = OnDeleteAction.NO_ACTION)
	@JsonProperty (value = "teamId")
	@JsonIdentityInfo (generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
	@JsonIdentityReference (alwaysAsId = true)
	private Team team;

	/**
	 * This UserAccount holder's first name.
	 */
	@NotBlank
	private String firstName;

	/**
	 * This UserAccount holder's last name.
	 */
	@NotBlank
	private String lastName;

	/**
	 * The email address for this UserAccount.
	 */
	@NotBlank
	@Column (unique = true)
	private String email;

	/**
	 * The salaried rate of this UserAccount multiplied by 100 to remove decimals.
	 */
	@Min (0)
	private Long salariedRate;

	@ManyToMany (mappedBy = "projectMembers", targetEntity = Project.class)
	@JsonIgnore
	private Set<Project> projects = new HashSet<>();

	/**
	 * If this UserAccount is active.
	 */
	@JsonIgnore
	@NotNull
	private boolean active;

	@ColumnDefault ("false")
	private boolean programDirector;

	@ColumnDefault ("false")
	private boolean admin;

	@JsonIgnore
	private String googleId;

	@JsonProperty
	public void setTeamId(final Long id) {
		Team team = null;
		if (id != -1) {
			team = new Team();
			team.setId(id);
		}
		this.setTeam(team);
	}

	@Override
	public int hashCode() {
		return this.id.intValue();
	}

	@Override
	public boolean equals(final Object obj) {
		if (obj.getClass() != this.getClass()) {
			return false;
		} else {
			return this.getId().equals(((UserAccount) obj).getId());
		}
	}
}
