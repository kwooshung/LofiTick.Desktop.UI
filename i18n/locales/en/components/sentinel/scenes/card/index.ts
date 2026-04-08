export const card = {
  machine: {
    unnamed: 'Unnamed machine',
    local: 'Local',
    remote: 'Remote'
  },
  actions: {
    addScene: 'Add scene',
    details: 'Details',
    edit: 'Edit',
    delete: 'Delete'
  },
  fields: {
    machineCode: 'Machine ID',
    machineIdentity: 'Machine UUID',
    machineFingerprint: 'Fingerprint',
    network: 'Network'
  },
  tooltips: {
    copyToClipboard: 'Copy to clipboard'
  },
  stats: {
    scenes: 'Scenes',
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  scene: {
    unnamed: 'Unnamed scene',
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  dialogs: {
    deleteSceneTitle: 'Delete this scene?'
  },
  empty: {
    ipv4: {
      title: 'No IPv4 address',
      description: 'This machine has not reported IPv4 yet.'
    },
    ipv6: {
      title: 'No IPv6 address',
      description: 'This machine has not reported IPv6 yet.'
    },
    scenes: {
      title: 'No scenes',
      localDescription: 'Click “Add scene” in the top right to create one.',
      remoteDescription: 'Creating scenes is not supported on remote machines.'
    },
    data: {
      title: 'No data',
      description: 'No machine selected or data not loaded.'
    }
  }
};
