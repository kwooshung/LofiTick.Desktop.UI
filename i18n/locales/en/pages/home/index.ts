export const home = {
  title: 'Home',
  voicePreview: {
    title: 'Voice Sample Generator',
    description: 'Enter a script and generate preview audio for every currently supported voice in one click.',
    generate: 'Generate All Voice Samples',
    supportedCount: 'Current result count: {count}',
    input: {
      label: 'Preview Script',
      description: 'This script is sent to the desktop shell and rendered once for each supported voice.',
      placeholder: 'For example: Today we are previewing every currently supported LofiTick voice.'
    },
    empty: {
      title: 'No voice samples yet',
      description: 'Enter a script first, then click the generate button.'
    },
    result: {
      errorTitle: 'Generation Failed',
      itemErrorTitle: 'This voice failed to generate',
      error: 'Failed to generate voice samples. Check the service credentials or the desktop shell response.',
      notTauri: 'The current runtime is not Tauri, so voice samples cannot be generated directly.'
    }
  },
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
