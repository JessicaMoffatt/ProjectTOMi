package ca.projectTOMi.tomi.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ca.projectTOMi.tomi.authorization.AuthorizationManager;
import ca.projectTOMi.tomi.authorization.ProjectAuthorizationManager;
import ca.projectTOMi.tomi.authorization.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.authorization.TimesheetAuthorizationManager;
import ca.projectTOMi.tomi.authorization.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.authorization.UserAuthorizationManager;
import ca.projectTOMi.tomi.authorization.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.ProjectAuthorizationRepository;
import ca.projectTOMi.tomi.persistence.TimesheetAuthorizationRepository;
import ca.projectTOMi.tomi.persistence.UserAuthorizationRepository;
import ca.projectTOMi.tomi.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
@Component
@CrossOrigin (origins = "http://localhost:4200")
public class AuthorizationInterceptor implements HandlerInterceptor {
  private final ProjectAuthorizationRepository projectAuthRepository;
  private final TimesheetAuthorizationRepository timesheetAuthRepository;
  private final UserAuthorizationRepository userAuthRepository;
  private final UserAccountService service;

  @Autowired
  public AuthorizationInterceptor(UserAuthorizationRepository userAuthRepository, ProjectAuthorizationRepository projectAuthRepository, TimesheetAuthorizationRepository timesheetAuthRepository, UserAccountService service) {
    this.projectAuthRepository = projectAuthRepository;
    this.timesheetAuthRepository = timesheetAuthRepository;
    this.userAuthRepository = userAuthRepository;
    this.service = service;
  }

  @Override
  public boolean preHandle(
    HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    String authToken = request.getHeader("Authorization");

    //TODO Remove Hardcoded UserAccount---------------
    UserAccount user = service.getUserAccount(1L);
    //TODO -------------------------------------------

    String requestMethod = request.getMethod();
    String requestURI = request.getRequestURI();
    String controller = "";
    try {
      controller = ((HandlerMethod) handler).getMethod().getDeclaringClass().toString();
      controller = controller.replace("class ca.projectTOMi.tomi.controller.", "");
    }catch (ClassCastException e){
      return true;
    }
    if(controller.matches("TimesheetController|EntryController")) {
      System.out.println("TimesheetAuthManager");
      AuthorizationManager<TimesheetAuthorizationPolicy> authMan;
      authMan = new TimesheetAuthorizationManager(user);
      authMan.loadUserPolicies(timesheetAuthRepository.getAllByRequestingUser(user));
      request.setAttribute("authMan", authMan);
    }else if(controller.matches("ProjectController|ExpenseController")) {
      System.out.println("ProjectAuthManager");
      AuthorizationManager<ProjectAuthorizationPolicy> authMan;
      authMan = new ProjectAuthorizationManager(user);
      authMan.loadUserPolicies(projectAuthRepository.getAllByRequestingUser(user));
      request.setAttribute("authMan", authMan);
    }else{
      System.out.println("UserAuthManager");
      AuthorizationManager<UserAuthorizationPolicy> authMan;
      authMan = new UserAuthorizationManager(user);
      authMan.loadUserPolicies(userAuthRepository.getAllByRequestingUser(user));
      request.setAttribute("authMan", authMan);
    }
    return ((AuthorizationManager)request.getAttribute("authMan")).requestAuthorization(requestURI, requestMethod);
  }

  @Override
  public void postHandle(
    HttpServletRequest request, HttpServletResponse response, Object handler,
    ModelAndView modelAndView) throws Exception {
  }

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                              Object handler, Exception exception) throws Exception {
  }
}
