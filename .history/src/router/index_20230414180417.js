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
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '面板', icon: 'dashboard', affix: true }
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
    path: '/zhjluser',
    component: Layout,
    meta: {
      title: '恒泽计量',
      icon: 'skill',
      roles: ['admin', 'editor', 'zhjl']
    },
    children: [
      {
        path: 'work',
        component: () => import('@/views/hzjl-zzh/work.vue'),
        name: '个人工作台',
        meta: { title: '个人工作台', icon: 'peoples', noCache: true, roles: ['zhjl'] }
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
        component: () => import('@/views/hzjl-zzh/work.vue'),
        name: '订单台账',
        meta: { title: '订单台账', icon: 'peoples', noCache: true, roles: ['zhjl'] }
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
        component: () => import('@/views/hzjl-zzh/work.vue'),
        name: '仪器台账',
        meta: { title: '仪器台账', icon: 'peoples', noCache: true, roles: ['zhjl'] }
      }
    ]
  },
  {
    path: '/zhjlyq',
    component: Layout,
    meta: {
      title: '客户管理系统',
      icon: 'skill',
      roles: ['admin', 'editor', 'hzjl']
    },
    children: [
      {
        path: 'yqls',
        component: () => import('@/views/hzjl-zzh/hz-history.vue'),
        name: '仪器校验历史',
        meta: { title: '仪器校验历史', icon: 'chart', noCache: true }
      },
      {
        path: 'ddtz',
        component: () => import('@/views/hzjl-zzh/hz-Ledger.vue'),
        name: '订单台账',
        meta: { title: '订单台账', icon: 'chart', noCache: true }
      },
      {
        path: 'yqtz',
        component: () => import('@/views/hzjl-zzh/hz-Instrument.vue'),
        name: '仪器台账',
        meta: { title: '仪器台账', icon: 'chart', noCache: true }
      },
      {
        path: 'grgzt',
        component: () => import('@/views/fibrpro-com/price.vue'),
        name: '个人工作台',
        meta: { title: '个人工作台', icon: 'chart', noCache: true }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/hongkong',
    component: Layout,
    meta: {
      title: '香港邮件',
      icon: 'email',
      roles: ['admin', 'editor', 'hongkong']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/hongkong/complex-table.vue'),
        name: '報名錶',
        meta: { title: '報名錶', icon: 'excel', noCache: true }
      },
      {
        path: 'qiniu',
        component: () => import('@/views/qiniu/upload.vue'),
        name: '七牛',
        meta: { title: '七牛', icon: 'excel', noCache: true }
      }
    ]
  },
  {
    path: '/fibrpro',
    component: Layout,
    meta: {
      title: 'FIBRPRO',
      icon: 'skill',
      roles: ['admin', 'editor', 'fibrpro']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/fibrpro-com/index.vue'),
        name: '人员管理',
        meta: { title: '人员管理', icon: 'peoples', noCache: true, roles: ['fibrpro-admin'] }
      },
      {
        path: 'qiniu',
        component: () => import('@/views/fibrpro-com/price.vue'),
        name: '报表管理',
        meta: { title: '报表管理', icon: 'chart', noCache: true }
      }
    ]
  },
  {
    path: '/telegram',
    component: Layout,
    meta: {
      title: 'telegram',
      icon: 'guide',
      roles: ['admin', 'editor', 'telegram']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/telegram/index.vue'),
        name: '帳號',
        meta: { title: '帳號錶', icon: 'excel', noCache: true }
      },
      {
        path: 'group',
        component: () => import('@/views/telegram/group.vue'),
        name: 'group',
        meta: { title: '群例表', icon: 'list', noCache: true }
      },
      {
        path: 'message',
        component: () => import('@/views/telegram/message.vue'),
        name: 'message',
        meta: { title: '消息例表', icon: 'nested', noCache: true }
      }
    ]
  },
  {
    path: '/tishuai',
    component: Layout,
    meta: {
      title: 'Ti监控',
      icon: 'chart',
      roles: ['admin', 'editor', 'ti']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/ti_shuai/complex-table.vue'),
        name: '库存表',
        meta: { title: '库存表', icon: 'excel', noCache: true }
      },
      {
        path: 'device',
        component: () => import('@/views/ti_shuai/complex-device.vue'),
        name: '设备',
        meta: { title: '设备', icon: 'el-icon-mobile-phone', noCache: true }
      },
      {
        path: 'goods',
        component: () => import('@/views/ti_shuai/complex-goods.vue'),
        name: '物料',
        meta: { title: '物料', icon: 'el-icon-s-grid', noCache: true }
      },
      {
        path: 'orders',
        component: () => import('@/views/ti_shuai/complex-orders.vue'),
        name: '订单',
        meta: { title: '订单', icon: 'el-icon-tickets', noCache: true }
      }
    ]
  },
  {
    path: '/ipods',
    component: Layout,
    meta: {
      title: '苹果耳机',
      icon: 'chart',
      roles: ['admin', 'editor', 'ipods']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/ipods/index.vue'),
        name: '耳机',
        meta: { title: '耳机参数', icon: 'nested', noCache: true }
      }
    ]
  },
  {
    path: '/ipodsOut',
    component: Layout,
    meta: {
      title: '苹果耳机',
      icon: 'chart',
      roles: ['admin', 'editor', 'ipodsOut']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/ipodsOut/index.vue'),
        name: '耳机',
        meta: { title: '耳机出库', icon: 'nested', noCache: true }
      }
    ]
  },
  {
    path: '/ipodsz',
    component: Layout,
    meta: {
      title: '苹果耳机',
      icon: 'chart',
      roles: ['admin', 'editor', 'ipodsz']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/ipodsz/index.vue'),
        name: '耳机',
        meta: { title: '深圳ipods', icon: 'nested', noCache: true }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    meta: { roles: ['admin', 'editor'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'el-icon-s-help',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: {
          title: 'Edit Article',
          noCache: true,
          activeMenu: '/example/list'
        },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    meta: {
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    meta: {
      title: 'Error Pages',
      icon: '404',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    meta: { roles: ['admin', 'editor'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    meta: { roles: ['admin', 'editor'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    meta: { roles: ['admin', 'editor'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    meta: { roles: ['admin', 'editor'] },
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
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
