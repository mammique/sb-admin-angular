var layout = {
  menu:
    [
      {
        sref: 'dashboard.home',
        name: 'Dashboard',
        icon: 'fa-dashboard'
      },
      {
        sref: 'dashboard.chart',
        name: 'Charts',
        icon: 'fa-bar-chart-o'
      },
      {
        sref: 'dashboard.table',
        name: 'Tables',
        icon: 'fa-table'
      },
      {
        sref: 'dashboard.form',
        name: 'Forms',
        icon: 'fa-edit'
      },
      {
        name: 'UI Elements',
        icon: 'fa-wrench',
        children: [
          {
            name: 'Panels and Wells',
            sref: 'dashboard.panels-wells'
          },
          {
            name: 'Buttons',
            sref: 'dashboard.buttons'
          },
          {
            name: 'Notifications',
            sref: 'dashboard.notifications'
          },
          {
            name: 'Typography',
            sref: 'dashboard.typography'
          },
          {
            name: 'Icons',
            sref: 'dashboard.icons'
          },
          {
            name: 'Grid',
            sref: 'dashboard.grid'
          },
        ]
      },
      {
        name: 'Multi-Level Dropdown',
        icon: 'fa-sitemap',
        children: [
          {
            name: 'Panels and Wells',
            sref: 'dashboard.panels-wells'
          },
          {
            name: 'Buttons',
            sref: 'dashboard.buttons'
          },
          {
            name: 'Third Level',
            children: [
              {
                name: 'Notifications',
                sref: 'dashboard.notifications'
              },
              {
                name: 'Typography',
                sref: 'dashboard.typography'
              },
              {
                name: 'Icons',
                sref: 'dashboard.icons'
              },
              {
                name: 'Grid',
                sref: 'dashboard.grid'
              },
            ]
          },

        ]
      },
      {
        name: 'Sample Pages',
        icon: 'fa-files-o',
        children: [
          {
            name: 'Blank Page',
            sref: 'dashboard.blank'
          },
          {
            name: 'Login Page',
            sref: 'login'
          },
        ]
      },
    ]
}