export const home = {
  title: 'Home',
  podcastScript: {
    title: 'Podcast Script Sandbox',
    description: 'This page no longer generates voice samples. It is now a temporary sandbox for assembling hot-search podcast copy into a Doubao-ready script.',
    editorDescription: 'The initial values are loaded from Settings > Hot Search. Changes here affect only the current test session and are not auto-saved.',
    templateCount: 'Template segment count: {count}',
    body: {
      label: 'Podcast Body',
      description: 'Add body segments one by one. This area is always the body editor, so you only need to fill the copy, speaker role, and segment type.',
      placeholder: 'Enter the body copy for this segment',
      add: 'Add Body Segment',
      emptyTitle: 'No body segments yet',
      emptyDescription: 'Add a body segment first, then choose its speaker role and segment type.'
    },
    adOpening: {
      label: 'Opening Ad Copy',
      description: 'This affects only the current homepage test. If the opening template contains an ad placeholder, this copy will override it first.',
      placeholder: 'Enter the opening ad copy for this test',
      add: 'Add Opening Ad Segment',
      emptyTitle: 'No opening ad segments yet',
      emptyDescription: 'Add an opening ad segment first, then arrange different speakers and copy in order.'
    },
    adClosing: {
      label: 'Closing Ad Copy',
      description: 'This affects only the current homepage test. If the closing template contains an ad placeholder, this copy will override it first.',
      placeholder: 'Enter the closing ad copy for this test',
      add: 'Add Closing Ad Segment',
      emptyTitle: 'No closing ad segments yet',
      emptyDescription: 'Add a closing ad segment first, then arrange different speakers and copy in order.'
    },
    names: {
      maleLabel: 'Male speaker name',
      femaleLabel: 'Female speaker name',
      morningLabel: 'Morning program name',
      eveningLabel: 'Evening program name',
      vipMorningLabel: 'Long morning program name',
      vipEveningLabel: 'Long evening program name'
    },
    actions: {
      title: 'Generate Modes',
      morningShort: 'Generate Morning Brief (Short)',
      morningLong: 'Generate Morning Brief (Long)',
      eveningShort: 'Generate Evening Brief (Short)',
      eveningLong: 'Generate Evening Brief (Long)',
      tip: 'This homepage is only a script sandbox, not the final homepage design.'
    },
    badges: {
      morning: 'Morning',
      evening: 'Evening',
      short: 'Short',
      long: 'Long'
    },
    result: {
      title: 'Generated Result',
      description: 'The response is already the final speaker + text line array that can be sent directly to the Volc podcast engine.',
      emptyTitle: 'No script generated yet',
      emptyDescription: 'Adjust the copy first, then click one of the four generate buttons above.'
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
