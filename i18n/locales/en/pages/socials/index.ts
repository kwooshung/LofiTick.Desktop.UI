export const socials = {
  title: 'Social',
  result: {
    table: {
      id: 'ID',
      name: 'Name',
      number: 'Group ID',
      size: 'Members',
      full: 'Full',
      enabled: 'Enabled',
      actions: 'Actions'
    },
    footer: {
      total: 'Total {total} results'
    },
    filter: {
      full: 'Only joinable'
    }
  },
  form: {
    name: { placeholder: 'Group name...' },
    number: { placeholder: 'Group ID...' },
    size: { placeholder: 'Group size...' },
    url: { placeholder: 'Invite link...' }
  },
  all: {
    title: 'All'
  },
  qq: {
    title: 'QQ',
    groups: {
      title: 'QQ Groups',
      all: {
        title: 'All'
      },
      result: {
        table: {
          id: 'ID',
          name: 'Name',
          number: 'Group ID',
          size: 'Members',
          full: 'Full',
          enabled: 'Enabled',
          actions: 'Actions'
        },
        footer: {
          total: 'Total {total} results'
        },
        filter: {
          full: 'Only joinable'
        }
      },
      form: {
        name: {
          label: 'Name',
          placeholder: 'Group name...',
          verify: {
            required: 'Name is required',
            length: 'Name length is invalid'
          }
        },
        number: {
          label: 'Group ID',
          placeholder: 'Group ID...',
          verify: {
            required: 'Group ID is required',
            pattern: 'Group ID format is invalid'
          }
        },
        size: {
          label: 'Members',
          placeholder: 'Group size...',
          item: '{count} members',
          verify: {
            required: 'Please select a group size',
            pattern: 'Group size is invalid'
          }
        },
        url: {
          label: 'Invite link',
          placeholder: 'Invite link...',
          verify: {
            required: 'Invite link is required',
            pattern: 'Invite link format is invalid'
          }
        },
        unique: {
          checking: 'Checking...',
          nameExists: 'Name already exists',
          numberExists: 'Group ID already exists'
        }
      },
      add: 'Add group',
      edit: 'Edit'
    }
  },
  wechat: {
    title: 'WeChat',
    groups: {
      title: 'WeChat Groups',
      add: 'Add group',
      edit: 'Edit'
    },
    subscription: {
      title: 'WeChat Official Accounts',
      add: 'Add account',
      edit: 'Edit'
    }
  },
  discord: {
    title: 'Discord Channels'
  }
};
