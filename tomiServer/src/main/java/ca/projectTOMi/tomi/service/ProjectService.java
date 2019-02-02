package ca.projectTOMi.tomi.service;

import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.exception.ProjectNotFoundException;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.persistence.ProjectRepository;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link Project} objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public final class ProjectService {
  private ProjectRepository repository;

  /**
   * Constructor for the ProjectService service.
   *
   * @param repository
   *   Repository responsible for persisting Project instances
   */
  public ProjectService(ProjectRepository repository) {
    this.repository = repository;
  }

  /**
   * Updates the project with the provided id with the provided attributes.
   *
   * @param id
   *   the unique identifier for the project to be updated
   * @param newProject
   *   Project object containing the updated attributes
   *
   * @return Project containing the updated attributes
   */
  public Project updateProject(String id, Project newProject) {
    return repository.findById(id).map(project -> {
      project.setProjectName(newProject.getProjectName());
      project.setBillableRate(newProject.getBillableRate());
      project.setBudget(newProject.getBudget());
      project.setClient(newProject.getClient());
      project.setProjectManager(newProject.getProjectManager());
      project.setProjectMembers(newProject.getProjectMembers());
      project.setActive(newProject.isActive());
      return repository.save(project);
    }).orElseThrow(() -> new ProjectNotFoundException());
  }

  /**
   * Gets a {@link Project} object with the provided id.
   *
   * @param id
   *   the unique identifier for the Project to be found
   *
   * @return Project object matching the provided id
   */
  public Project getProjectById(String id) {
    return repository.findById(id).orElseThrow(() -> new ProjectNotFoundException());
  }

  /**
   * Gets a list of all projects that are active.
   *
   * @return List containing all projects that are active
   */
  public List<Project> getActiveProjects() {
    return repository.getAllByActive(true).stream().collect(Collectors.toList());
  }

  /**
   * Generates a sequential id based on a provided prefix for a {@link Project}.
   *
   * @param prefix the prefix for the id
   * @return the generated id
   */
  public String getId(String prefix){
    String id = prefix;
    List<String> prefixes = repository.getIds(prefix);
    String top = prefixes.size() == 0? "0": prefixes.get(0).substring(2).trim();
    int i = Integer.parseInt(top)+1;
    return String.format("%s%05d", id, i);
  }
  /**
   * Persists the provided {@link Project}.
   *
   * @param project
   *   Project to be persisted
   *
   * @return the Project that was persisted
   */
  public Project saveProject(Project project) {
    return repository.save(project);
  }
}
