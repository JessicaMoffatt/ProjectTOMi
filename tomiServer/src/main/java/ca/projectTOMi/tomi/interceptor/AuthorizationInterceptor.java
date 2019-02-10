package ca.projectTOMi.tomi.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ca.projectTOMi.tomi.authorization.ProjectAuthorizationManager;
import ca.projectTOMi.tomi.persistence.ProjectAuthorizationRepository;
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
  private final ProjectAuthorizationRepository repository;
  private final UserAccountService service;

  @Autowired
  public AuthorizationInterceptor(ProjectAuthorizationRepository repository, UserAccountService service) {
    this.repository = repository;
    this.service = service;
  }

  @Override
  public boolean preHandle(
    HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    String authToken = request.getHeader("Authorization");
    String requestMethod = request.getMethod();
    String requestURI = request.getRequestURI();
    String clas = "";
    try {
      clas = ((HandlerMethod) handler).getMethod().getDeclaringClass().toString();
    }catch (ClassCastException e){
      return true;
    }
    System.out.println(clas);
    ProjectAuthorizationManager authMan = new ProjectAuthorizationManager(repository.getAllByRequestingUser(service.getUserAccount(1L)));
    request.setAttribute("AuthMan", authMan );
    return true;
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
