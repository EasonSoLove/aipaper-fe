import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
import mLayout from "@/layout/mainLayout.vue";

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
    meta: {
      id: "0",
    },
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
    meta: {
      id: "1",
    },
  },
  // 404 page must be placed at the end !!!
  {
    path: "*",
    redirect: "/404",
    hidden: true,
    meta: {
      id: "2",
    },
  },
  {
    path: "/dashboard",
    component: () => import("@/views/dashboard/index"),
    hidden: true,
    meta: {
      id: "3",
    },
  },
  {
    path: "/toPromotion",
    component: () => import("@/views/user/toPromotion"),
    hidden: true,
    meta: {
      id: "0",
    },
  },
  //  {
  //     path: "/home",
  //    name: "/home",
  //     component: () => import("@/views/home/index"),
  //     meta: {
  //       title: "home",
  //       icon: "dashboard",
  //     },
  //   },
  {
    path: "/",
    component: Layout,
    // redirect: "/home/home",
    redirect: "/main/writepaper",
    meta: {
      id: "4",
    },
    // children: [
    //   {
    //     path: "home",
    //     name: "home",
    //     component: () => import("@/views/home/index"),
    //     meta: {
    //       title: "home",
    //       icon: "dashboard",
    //     },
    //   },
    // ],
  },

  {
    path: "/main",
    component: mLayout,
    redirect: "/main/explore",
    name: "main",
    meta: {
      title: "homePage",
      icon: "el-icon-s-help",
      id: "5",
    },
    children: [
      {
        path: "writepaper",
        name: "writepaper",
        component: () => import("@/views/writepaper/index"),
        meta: {
          keepAlive: false,
          // title: "写论文",
          title: "writePaper",
          icon: "el-icon-edit",
          id: "5-1",
          parentId: "5",
          describe: "立即生成一篇导师认可的论文",

          inDevelopment: false,
        },
      },
      // 降重/降aigc率
      {
        path: "reduceRepetition",
        name: "reduceRepetition",
        component: () => import("@/views/reduceRepetition/index.vue"),
        meta: {
          keepAlive: false,
          title: "reduceRepetition",
          // title: "降重/降AIGC率",
          icon: "el-icon-tickets",
          id: "5-8",
          describe: "原创是我最好的伪装",
          parentId: "5",
          inDevelopment: false,
        },
      },
      // ChatGpt
      {
        path: "chat",
        name: "chat",
        component: () => import("@/views/chat/index.vue"),
        meta: {
          keepAlive: false,
          title: "chat",
          // title: "降重/降AIGC率",
          icon: "el-icon-chat-dot-round",
          describe: "没思路过来让我指点你一下",
          id: "5-8",
          parentId: "5",
          inDevelopment: false,
        },
      },

      // 查重页面
      {
        path: "plagiarismCheck",
        name: "plagiarismCheck",
        component: () => import("@/views/plagiarismCheck/index"),
        meta: {
          keepAlive: false,
          title: "plagiarismCheck",
          // title: "搜论文",
          icon: "el-icon-document-checked",
          describe: "专业查重,指明论文方向",
          id: "5-2",
          parentId: "5",
          inDevelopment: false,
        },
      },
      // 论文宝典
      {
        path: "explore",
        name: "explore",
        component: () => import("@/views/explore/index"),
        meta: {
          keepAlive: true,
          title: "searchPaper",
          // title: "搜论文",
          icon: "el-icon-download",
          describe: "我的脑袋里有十亿亿篇文献",
          id: "5-2",
          parentId: "5",
          inDevelopment: false,
        },
      },

      // 读论文
      // {
      //   path: "readpaper",
      //   name: "readpaper",
      //   component: () => import("@/views/readpaper/index"),
      //   meta: {
      //     keepAlive: true,
      //     title: "readPaper",
      //     // title: "读论文",
      //     icon: "el-icon-reading",
      //     describe: "高效提炼论文精华，掌握学术动态。",
      //     id: "5-3",
      //     parentId: "5",
      //     inDevelopment: true,
      //   },
      // },
      // 改论文
      // {
      //   path: "amendpaper",
      //   name: "amendpaper",
      //   component: () => import("@/views/amendpaper/index"),
      //   meta: {
      //     keepAlive: true,
      //     title: "amendPaper",
      //     // title: "改论文",
      //     icon: "el-icon-edit-outline",
      //     describe: "智能优化文本，确保论文质量。",
      //     id: "5-4",
      //     parentId: "5",
      //     inDevelopment: true,
      //   },
      // },
      // 综合服务
      // {
      //   path: "integratedservices",
      //   name: "integratedservices",
      //   component: () => import("@/views/integratedservices/index"),
      //   meta: {
      //     keepAlive: true,
      //     title: "integratedServices",
      //     // title: "综合服务",
      //     describe: "一站式学术支持，助力研究发表。",
      //     icon: "el-icon-data-line",
      //     id: "5-5",
      //     parentId: "5",
      //     inDevelopment: true,
      //   },
      // },
      // 精品课程
      // {
      //   path: "eliteCourses",
      //   name: "eliteCourses",
      //   component: () => import("@/views/aitools/index"),
      //   meta: {
      //     keepAlive: true,
      //     title: "eliteCourses",
      //     // title: "精品课程",
      //     describe: "提升写作技能，掌握实用技巧。",
      //     icon: "el-icon-notebook-1",
      //     id: "5-6",
      //     parentId: "5",
      //     inDevelopment: true,
      //   },
      // },
      // ai工具
      // {
      //   path: "aitools",
      //   name: "aitools",
      //   component: () => import("@/views/aitools/index"),
      //   meta: {
      //     keepAlive: true,
      //     title: "aiTools",
      //     // title: "AI工具",
      //     describe: "智能工具支持，提升学术效率。",
      //     icon: "el-icon-set-up",
      //     id: "5-7",
      //     parentId: "5",
      //     inDevelopment: true,
      //   },
      // },
      // 我的钱包
      // {
      //   path: "orderList",
      //   name: "orderList",
      //   hidden: true,
      //   component: () => import("@/views/user/order.vue"),
      //   meta: {
      //     keepAlive: true,
      //     title: "aiTools",
      //     // title: "AI工具",
      //     describe: "智能工具支持，提升学术效率。",
      //     icon: "el-icon-set-up",
      //     id: "5-7",
      //     parentId: "5",
      //   },
      // },
    ],
  },
  {
    path: "/user",
    component: Layout,
    children: [
      {
        path: "promotion",
        name: "promotion",
        component: () => import("@/views/user/index.vue"),
        meta: {
          title: "我的推广",
          icon: "dashboard",
        },
      },
      {
        path: "setting",
        name: "setting",
        component: () => import("@/views/user/setting.vue"),
        meta: {
          title: "运营配置",
          icon: "dashboard",
        },
      },
      {
        path: "userInfo",
        name: "userInfo",
        component: () => import("@/views/user/userinfo"),
        meta: {
          title: "我的个人主页",
        },
      },
    ],
    hidden: true,
  },
  {
    path: "/paper",
    component: Layout,
    redirect: "/paper/preview",
    children: [
      {
        path: "preview",
        name: "preview",
        component: () => import("@/views/paperpreview/index"),
        meta: {
          title: "范文样例",
          icon: "dashboard",
          inDevelopment: false,
        },
      },
      {
        path: "reduceRepetiton",
        name: "reduceRepetiton",
        component: () => import("@/views/reduceRepetition/index"),
        meta: {
          title: "智能降重",
          icon: "dashboard",
          inDevelopment: false,
        },
      },
    ],
  },
  // {
  //   path: '/paper',
  //   component: Layout,
  //   redirect: '/paper/reduceRepetiton',
  //   children: []
  // },

  // {
  //   path: '/reduceRepetiton',
  //   component: () => import('@/views/reduceRepetition/index'),
  //   hidden: true
  // },
  {
    path: "/home",
    component: Layout,
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index"),

        meta: {
          title: "首页",
          icon: "dashboard",
          inDevelopment: false,
          describe: "你对我的强大一无所知",
        },
      },
      // 优惠卷
      {
        path: "redemption",
        name: "redemption",
        component: () => import("@/views/wallet/redemption"),
        meta: {
          keepAlive: true,
          title: "redemption",
          // title: "搜论文",
          icon: "el-icon-download",
          describe: "我的脑袋里有十亿亿篇文献",
          id: "5-2",
          parentId: "5",
          inDevelopment: false,
        },
      },
    ],
    hidden: true,
  },
  {
    path: "/wallet",
    component: Layout,
    children: [
      {
        path: "recharge",
        name: "recharge",
        component: () => import("@/views/wallet/index.vue"),

        meta: {
          title: "充值",
          icon: "dashboard",
          inDevelopment: false,
          describe: "",
        },
      },
    ],
    hidden: true,
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
