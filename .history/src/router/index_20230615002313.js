/* eslint-disable semi */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/* Router Modules */
import componentsRouter from './modules/components';
import chartsRouter from './modules/charts';
import tableRouter from './modules/table';
import nestedRouter from './modules/nested';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/zhjl-zzh/index.vue'),
        name: 'Dashboard',
        meta: { title: '个人工作台', icon: 'el-icon-set-up', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: {
          title: 'Documentation',
          icon: 'documentation',
          affix: false,
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: {
          title: 'Guide',
          icon: 'guide',
          noCache: true,
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/zhjlorder',
    component: Layout,
    meta: {
      title: '恒泽计量',
      icon: 'skill',
      roles: ['admin', 'editor', 'zhjl']
    },
    children: [
      {
        path: 'work',
        component: () => import('@/views/zhjl-zzh/zhjl-order.vue'),
        name: '预约管理',
        meta: { title: '预约管理', icon: 'el-icon-date', noCache: true, roles: ['zhjl'] }
      }
    ]
  },
  {
    path: '/zhjlsbtz',
    component: Layout,
    meta: {
      title: '恒泽计量',
      icon: 'skill',
      roles: ['admin', 'editor', 'zhjl']
    },
    children: [
      {
        path: 'work',
        component: () => import('@/views/zhjl-zzh/zhjl-Instrument.vue'),
        name: '仪器台账',
        meta: { title: '仪器台账', icon: 'el-icon-odometer', noCache: true, roles: ['zhjl'] }
      }
    ]
  },
  {
    path: '/zhjltdtz',
    component: Layout,
    meta: {
      title: '恒泽计量',
      icon: 'skill',
      roles: ['admin', 'editor', 'zhjl']
    },
    children: [
      {
        path: 'work',
        component: () => import('@/views/zhjl-zzh/zhjl-Ledger.vue'),
        name: '订单台账',
        meta: { title: '订单台账', icon: 'el-icon-shopping-cart-1', noCache: true, roles: ['zhjl'] }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/permission/user.vue'),
        name: '人员管理',
        meta: { title: '人员管理', icon: 'peoples', noCache: true, roles: ['admin'] }
      },
      {
        path: 'unit',
        component: () => import('@/views/permission/unit.vue'),
        name: '部门管理',
        meta: { title: '部门管理', icon: 'el-icon-office-building', noCache: true, roles: ['admin'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
