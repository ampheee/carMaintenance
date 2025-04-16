package utilities

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"html/template"
	"net"
	"net/smtp"
	"path/filepath"
)

// BuildVerificationEmailMessage builds a MIME-compliant email message with both plain text and HTML parts.
func BuildVerificationEmailMessage(from, to, verifyLink string) (string, error) {
	templatePath := filepath.Join("pkg", "utilities", "emailTemplates", "verify.html")
	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		return "", fmt.Errorf("failed to load email template: %w", err)
	}

	var htmlBody bytes.Buffer
	data := struct {
		VerifyURL string
	}{
		VerifyURL: verifyLink,
	}
	if err := tmpl.Execute(&htmlBody, data); err != nil {
		return "", fmt.Errorf("failed to execute email template: %w", err)
	}

	// Plain text fallback for clients that don't support HTML
	plainTextBody := fmt.Sprintf("Click the link to verify your account: %s", verifyLink)

	// Create the MIME message
	headers := map[string]string{
		"From":         from,
		"To":           to,
		"Subject":      "Подтверждение почты",
		"MIME-version": "1.0",
		"Content-Type": "multipart/alternative; boundary=boundary-string",
	}

	// Build the MIME body
	var message bytes.Buffer
	for key, value := range headers {
		message.WriteString(fmt.Sprintf("%s: %s\r\n", key, value))
	}
	message.WriteString("\r\n")

	// Add plain text part
	message.WriteString("--boundary-string\r\n")
	message.WriteString("Content-Type: text/plain; charset=\"UTF-8\"\r\n")
	message.WriteString("Content-Transfer-Encoding: 7bit\r\n\r\n")
	message.WriteString(plainTextBody + "\r\n\r\n")

	// Add HTML part
	message.WriteString("--boundary-string\r\n")
	message.WriteString("Content-Type: text/html; charset=\"UTF-8\"\r\n")
	message.WriteString("Content-Transfer-Encoding: 7bit\r\n\r\n")
	message.WriteString(htmlBody.String() + "\r\n")

	// End of MIME message
	message.WriteString("--boundary-string--\r\n")

	return message.String(), nil
}

func SendVerificationEmail(fromEmailName, fromEmailAddress, toEmailAddress, emailHost, emailPort, emailPassword, verifyLink string) error {
	message, err := BuildVerificationEmailMessage(fromEmailAddress, toEmailAddress, verifyLink)
	if err != nil {
		return fmt.Errorf("failed to build email message: %w", err)
	}
	auth := smtp.PlainAuth("", fromEmailAddress, emailPassword, emailHost)
	emailHostPort := emailHost + ":" + emailPort
	conn, err := net.Dial("tcp", emailHostPort)
	if err != nil {
		return fmt.Errorf("failed to connect to SMTP server: %w", err)
	}
	defer conn.Close()
	client, err := smtp.NewClient(conn, emailHost)
	if err != nil {
		return fmt.Errorf("failed to create SMTP client: %w", err)
	}
	defer client.Close()
	if ok, _ := client.Extension("STARTTLS"); ok {
		config := &tls.Config{
			InsecureSkipVerify: true,
			ServerName:         emailHost,
		}
		if err := client.StartTLS(config); err != nil {
			return fmt.Errorf("failed to start TLS: %w", err)
		}
	}
	if err := client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP authentication failed: %w", err)
	}
	if err := client.Mail(fromEmailAddress); err != nil {
		return fmt.Errorf("failed to set sender: %w", err)
	}
	if err := client.Rcpt(toEmailAddress); err != nil {
		return fmt.Errorf("failed to set recipient: %w", err)
	}
	w, err := client.Data()
	if err != nil {
		return fmt.Errorf("failed to send email data: %w", err)
	}

	defer w.Close()

	_, err = w.Write([]byte(message))
	if err != nil {
		return fmt.Errorf("failed to write email message: %w", err)
	}

	return nil
}
