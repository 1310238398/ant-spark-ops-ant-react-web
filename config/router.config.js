export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login/Index' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AdminLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard/Home' },
      {
        path: '/example',
        routes: [{ path: '/example/demo', component: './Demo/DemoList' }],
      },
      {
        path: '/system',
        routes: [
          { path: '/system/menu', component: './Menu/MenuList' },
          { path: '/system/role', component: './Role/RoleList' },
          { path: '/system/user', component: './User/UserList' },
          { path: '/system/systemparameter', component: './SystemParameter/SystemParameterList' },
          { path: '/system/appversion', component: './AppVersion' },
        ],
      },
      {
        path: 'basic',
        routes: [
          { path: '/basic/dictionary', component: './Dictionary/DictionaryList' },
          { path: '/basic/park', component: './Park/ParkList' },
        ],
      },
    ],
  },
  {
    component: '404',
  },
];
