const routes = [
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {path: 'login', component: () => import('pages/Auth/Login.vue'), name: 'login'},
      {path: 'register', component: () => import('pages/Auth/Register.vue'), name: 'register'},
      {path: 'verify-email', component: () => import('pages/Auth/VerifyEmail.vue'), name: 'verify_email', meta: {requiresAuth: true}},
      {path: 'forgot-password', component: () => import('pages/Auth/ForgotPassword.vue'), name: 'forgot_password'},
      {path: 'reset-password/:token', component: () => import('pages/Auth/ResetPassword.vue'), name: 'reset-password'},
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', redirect: '/dashboard', name: 'dashboard', meta: {requiresAuth: true}},
      {path: 'dashboard', component: () => import('pages/Dashboard/Index.vue'), meta: {requiresAuth: true}},
      {path: 'users', component: () => import('pages/User/Index.vue'), meta: {requiresAuth: true}},
      {path: 'sms_configurations', component: () => import('pages/SmsConfiguration/Index.vue'), meta: {requiresAuth: true}},
      {path: 'mail_configurations', component: () => import('pages/MailConfiguration/Index.vue'), meta: {requiresAuth: true}},
      {path: 'reniec_configurations', component: () => import('pages/ReniecConfiguration/Index.vue'), meta: {requiresAuth: true}},
      {path: 'sis_configurations', component: () => import('pages/SisConfiguration/Index.vue'), meta: {requiresAuth: true}},
      {path: 'ws_configurations', component: () => import('pages/WsConfiguration/Index.vue'), meta: {requiresAuth: true}},
      {path: 'configurations', component: () => import('pages/Configuration/Form.vue'), meta: {requiresAuth: true}},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
