export const home = {
  title: 'Home',
  welcomeEmail: {
    description: 'Click the button to generate the welcome email and send it to the current recipient mailbox.',
    target: 'Default recipient: {email}',
    send: 'Send Welcome Email',
    result: {
      successTitle: 'Sent',
      errorTitle: 'Failed',
      success: 'The welcome email was sent to {email}. Actual recipient count: {count}.',
      error: 'Failed to send the welcome email. Check the email config or backend response.'
    }
  }
};
