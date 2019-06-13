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
      {
        path: 'electronic',
        routes: [
          {
            name: '电子发票销售方配置项',
            path: '/electronic/electronicsellervoice',
            component: './ElectronicInvoiceIssuance/ElectronicSellervoice',
          },
          {
            name: '电子发票配置项',
            path: '/electronic/electronicinvoice',
            component: './ElectronicInvoiceIssuance/ElectronicInvoiceIssuance',
          },
          {
            name: '电子发票业务配置项',
            path: '/electronic/electronicitem',
            component: './ElectronicInvoiceIssuance/ElectronicItem',
          },
        ],
      },
      {
        path: 'advertisement',
        routes: [
          {
            name: '广告位管理',
            path: '/advertisement/advertspace',
            component: './Advertisement/AdvertSpace/AdvertSpace',
          },
          {
            name: '广告管理',
            path: '/advertisement/advertis',
            component: './Advertisement/Advertis/Advertis',
          },
        ],
      },
    ],
  },
  {
    component: '404',
  },
];
