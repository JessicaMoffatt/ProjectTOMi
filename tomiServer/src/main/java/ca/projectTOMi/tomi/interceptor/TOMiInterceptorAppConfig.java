package ca.projectTOMi.tomi.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Component
public class TOMiInterceptorAppConfig implements WebMvcConfigurer {
  private final UnitTypeInterceptor unitTypeInterceptor;

  @Autowired
  public TOMiInterceptorAppConfig(UnitTypeInterceptor unitTypeInterceptor) {
    this.unitTypeInterceptor = unitTypeInterceptor;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(unitTypeInterceptor);
  }
}