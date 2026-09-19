import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:smartphone',
      order: 200,
      title: $t('page.appUsers.title'),
    },
    name: 'AppUsers',
    path: '/app-users',
    children: [
      {
        name: 'AppUserList',
        path: 'list',
        component: () => import('#/views/app-users/list.vue'),
        meta: {
          icon: 'lucide:users',
          title: $t('page.appUsers.list'),
        },
      },
    ],
  },
];

export default routes;
