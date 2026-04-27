export const card = {
  machine: {
    unnamed: 'Unnamed machine',
    local: 'Local',
    remote: 'Remote'
  },
  actions: {
    addScene: 'Add scene',
    deleteMachine: 'Delete machine',
    network: 'Network',
    details: 'Details',
    edit: 'Edit',
    delete: 'Delete'
  },
  fields: {
    machineCode: 'Machine ID',
    machineRemark: 'Machine Remark',
    machineIdentity: 'Machine UUID',
    network: 'Network',
    scenes: 'Scenes'
  },
  tooltips: {
    copyToClipboard: 'Copy to clipboard',
    editRemark: 'Edit remark',
    saveRemark: 'Save remark'
  },
  toast: {
    machineRemarkSaved: 'Machine remark saved',
    machineDeleted: 'Machine deleted'
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
    deleteSceneTitle: 'Delete this scene?',
    deleteMachineTitle: 'Delete this machine?'
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
      localDescription: 'This machine has no scenes yet. Create one below.',
      remoteDescription: 'Creating scenes is not supported on remote machines.'
    },
    data: {
      title: 'No data',
      description: 'No machine selected or data not loaded.'
    }
  }
};
