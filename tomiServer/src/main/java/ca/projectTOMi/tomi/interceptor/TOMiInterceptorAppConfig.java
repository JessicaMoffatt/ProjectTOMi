package ca.projectTOMi.tomi.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Component
public class TOMiInterceptorAppConfig implements WebMvcConfigurer {
  private final UserAuthorizationInterceptor userAuthorizationInterceptor;
  private final ProjectAuthorizationInterceptor projectAuthorizationInterceptor;
  private final TimesheetAuthorizationInterceptor timesheetAuthorizationInterceptor;

  @Autowired
  public TOMiInterceptorAppConfig(UserAuthorizationInterceptor userAuthorizationInterceptor, ProjectAuthorizationInterceptor projectAuthorizationInterceptor, TimesheetAuthorizationInterceptor timesheetAuthorizationInterceptor) {
    this.userAuthorizationInterceptor = userAuthorizationInterceptor;
    this.projectAuthorizationInterceptor = projectAuthorizationInterceptor;
    this.timesheetAuthorizationInterceptor = timesheetAuthorizationInterceptor;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(userAuthorizationInterceptor);
    registry.addInterceptor(projectAuthorizationInterceptor);
    registry.addInterceptor(timesheetAuthorizationInterceptor);
  }
}