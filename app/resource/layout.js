var layout = {
  menu:
    [
      {
        sref: 'dashboard.home',
        title: 'Dashboard',
        icon: 'fa-dashboard'
      },
      {
        sref: 'dashboard.chart',
        title: 'Charts',
        icon: 'fa-bar-chart-o'
      },
      {
        sref: 'dashboard.table',
        title: 'Tables',
        icon: 'fa-table'
      },
      {
        sref: 'dashboard.form',
        title: 'Forms',
        icon: 'fa-edit'
      },
      {
        title: 'UI Elements',
        icon: 'fa-wrench',
        children: [
          {
            title: 'Panels and Wells',
            sref: 'dashboard.panels-wells'
          },
          {
            title: 'Buttons',
            sref: 'dashboard.buttons'
          },
          {
            title: 'Notifications',
            sref: 'dashboard.notifications'
          },
          {
            title: 'Typography',
            sref: 'dashboard.typography'
          },
          {
            title: 'Icons',
            sref: 'dashboard.icons'
          },
          {
            title: 'Grid',
            sref: 'dashboard.grid'
          },
        ]
      },
      {
        title: 'Multi-Level Dropdown',
        icon: 'fa-sitemap',
        children: [
          {
            title: 'Panels and Wells',
            sref: 'dashboard.panels-wells'
          },
          {
            title: 'Buttons',
            sref: 'dashboard.buttons'
          },
          {
            title: 'Third Level',
            children: [
              {
                title: 'Notifications',
                sref: 'dashboard.notifications'
              },
              {
                title: 'Typography',
                sref: 'dashboard.typography'
              },
              {
                title: 'Icons',
                sref: 'dashboard.icons'
              },
              {
                title: 'Grid',
                sref: 'dashboard.grid'
              },
            ]
          },

        ]
      },
      {
        title: 'Sample Pages',
        icon: 'fa-files-o',
        children: [
          {
            title: 'Blank Page',
            sref: 'dashboard.blank'
          },
          {
            title: 'Login Page',
            sref: 'login'
          },
        ]
      },
    ],
  pages: {
    'User': {
      title: 'User',
      resource: '/',
      fields: [
        {
          name: 'firstName',
          title: '名',
          type: 'string',
        },
        {
          name: 'familyName',
          title: '姓',
          type: 'string',
        }
      ]
    }
  }
}