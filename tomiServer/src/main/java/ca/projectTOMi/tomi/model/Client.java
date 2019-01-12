package ca.projectTOMi.tomi.model;

import java.util.ArrayList;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.Data;

/**
 * A model class for storing information related to the Client.
 *
 * @author Karol Talbot
 * @version 1
 */
@Entity
@Data
public class Client {
  /**
   * The unique identifier for this Client.
   */
  @Id
  @GeneratedValue(generator = "client_sequence")
  @SequenceGenerator(
    name = "client_sequence",
    sequenceName = "client_sequence",
    allocationSize = 1
  )
  private Long clientId;

  /**
   * The name of this Client.
   */
  @Column(unique = true, length = 100, nullable = false)
  private String name;

  private ArrayList<Date> fish;
}

