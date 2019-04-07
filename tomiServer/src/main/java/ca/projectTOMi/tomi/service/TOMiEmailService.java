package ca.projectTOMi.tomi.service;

import java.util.Objects;
import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

/**
 * Provides services required to automatically send emails.
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public class TOMiEmailService {
	/**
	 * Subject line for reminder email.
	 */
	static final String SUBJECT = "Reminder to submit this weeks timesheet";
	/**
	 * Body for reminder email.
	 */
	static final String EMAIL_BODY = "Hello %s%nThis is a reminder to submit your timesheet for the week of %s.%n%nThis is an automated message please do not reply.%n";

	/**
	 * Gmail address to send emails from.
	 */
	@Value ("${spring.mail.username}")
	private String emailAddress;

	/**
	 * Application password for the Gmail account to send emails from.
	 */
	@Value ("${spring.mail.password}")
	private String emailPass;

	/**
	 * The mail sender for constructing emails.
	 */
	private JavaMailSender emailSender = this.getJavaMailSender();

	/**
	 * Sends an email with the provided information.
	 *
	 * @param to
	 * 	Recipient of the email
	 * @param text
	 * 	Body of the Email
	 */
	void sendSimpleMessage(
		final String to, final String text) {
		if (!Objects.equals(((JavaMailSenderImpl) this.emailSender).getUsername(), this.emailAddress)) {
			this.emailSender = this.getJavaMailSender();
		}
		final SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject(SUBJECT);
		message.setText(text);
		this.emailSender.send(message);
	}

	/**
	 * Gets the email address for the application.
	 *
	 * @return the email address for the applicaiton
	 */
	String getEmailAddress() {
		return this.emailAddress;
	}

	/**
	 * Sets the configuration for the Gmail account.
	 *
	 * @return JavaMailSender with the appropriate configuration
	 */
	@Bean
	public JavaMailSender getJavaMailSender() {
		final JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost("smtp.gmail.com");
		mailSender.setPort(587);

		mailSender.setUsername(this.emailAddress);
		mailSender.setPassword(this.emailPass);

		final Properties props = mailSender.getJavaMailProperties();
		props.put("mail.transport.protocol", "smtp");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.debug", "false");

		return mailSender;
	}
}
