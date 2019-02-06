package ca.projectTOMi.tomi.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.ProjectResourceAssembler;
import ca.projectTOMi.tomi.exception.InvalidIDPrefix;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Handles HTTP requests for {@link ca.projectTOMi.tomi.model.Project} objects in the ProjectTOMi system.
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class ProjectController {
  @Autowired private ProjectService service;
  @Autowired private ProjectResourceAssembler assembler;

  /**
   * Returns a resource representing the requested {@link Project} to the source of a GET request to
   * /projects/id.
   *
   * @param id
   *   unique identifier for the Project
   *
   * @return Resource representing the Project object.
   */
  @GetMapping ("/projects/{id}")
  public Resource<Project> getProject(@PathVariable String id) {
    return assembler.toResource(service.getProjectById(id));
  }

  /**
   * Returns a collection of all active {@link Project} the source of a GET request to /projects.
   *
   * @return Collection of resources representing all active Projects
   */
  @GetMapping ("/projects")
  public Resources<Resource<Project>> getActiveProjects() {

    List<Resource<Project>> project = service.getActiveProjects().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(project,
      linkTo(methodOn(ProjectController.class).getActiveProjects()).withSelfRel());
  }

  /**
   * Creates a new {@link Project} with the attributes provided in the POST request to /projects.
   *
   * @param newProject
   *   an Project object with required information.
   *
   * @return response containing links to the newly created Project
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PostMapping ("/projects")
  public ResponseEntity<?> createProject(@RequestBody Project newProject) throws URISyntaxException {
    if(!newProject.getId().trim().matches("^\\p{Alpha}\\p{Alpha}\\d{0,5}+$")){
      throw new InvalidIDPrefix();
    }
    newProject.setId(service.getId(newProject.getId()));
    Resource<Project> resource = assembler.toResource(service.saveProject(newProject));

    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  /**
   * Updates the attributes for a {@link Project} with the provided id with the attributes provided
   * in the PUT request to /projects/id.
   *
   * @param id
   *   the unique identifier for the Project to be updated
   * @param newProject
   *   the updated Project
   *
   * @return response containing a link to the updated Project
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PutMapping ("/projects/{id}")
  public ResponseEntity<?> updateProject(@PathVariable String id, @RequestBody Project newProject) throws URISyntaxException {
    Project updatedProject = service.updateProject(id, newProject);
    Resource<Project> resource = assembler.toResource(updatedProject);
    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  /**
   * Sets the requested {@link Project}'s active attribute false, removing it from the list of
   * active Projects. Responds to the DELETE requests to /projects/id.
   *
   * @param id
   *   the unique identifier for the Project to be set inactive
   *
   * @return a response without any content
   */
  @DeleteMapping ("/projects/{id}")
  public ResponseEntity<?> setProjectInactive(@PathVariable String id) {
    Project project = service.getProjectById(id);
    project.setActive(false);
    service.saveProject(project);

    return ResponseEntity.noContent().build();
  }

  @GetMapping("/user_accounts/{id}/projects")
  public Resources<Resource<Project>> getProjectsByUserAccount(@PathVariable Long id) {
    List<Resource<Project>> project = service.getProjectByUserAccount(id).stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(project,
      linkTo(methodOn(ProjectController.class).getActiveProjects()).withSelfRel());
  }
}
