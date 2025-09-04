<template>
  <div :class="['navbarHome', !showContent ? 'grayBg' : '']">
    <div class="navMain">
      <div>
        <div v-if="showContent" class="navItems flex">
          <div
            @click="$jumpUrl('/home/home')"
            class="grid-content nav_left flex items-center"
          >
            <div class="logo-box">
              <!-- <div class="logoR">
                <img :src="logoMax" alt="" title="logo" />
              </div> -->
              <div class="logoL">
                <p>万象写作</p>
                <!-- <img :src="logo" alt="" title="logo" /> -->
              </div>
            </div>
          </div>
          <div
            :class="['navItem', 'home' == $route.name ? 'active' : '']"
            @click="toView(0, '/home/home')"
          >
            {{ $t("route.homePage") }}
          </div>
          <template v-for="(route, i) in routerList">
            <div
              v-if="!route.hidden"
              :key="'route_' + i"
              :class="[
                'navItem',
                route.meta.inDevelopment ? 'gray' : '',
                route.name == $route.name ? 'active' : '',
              ]"
              @click="$jumpUrl('/main/' + route.path)"
            >
              {{ generateTitle(route.meta.title) }}
            </div>
          </template>
        </div>
        <div
          v-if="!showContent"
          class="logo-box phoneLogo"
          @click="$jumpUrl('/home/home')"
        >
          <!-- <div class="logoR phoneRLogo">
            <img :src="logoMax" alt="" title="logo" />
          </div> -->
          <div class="logoL phoneLLogo">
            <!-- <p>万象学术</p> -->
            <!-- <img :src="logo" alt="" title="logo" /> -->
            <p>万象写作</p>
          </div>
        </div>
        <div v-if="!showContent" class="navleftData">
          <div class="navWidth"></div>
          <div class="navDataLine">
            <data-statistics></data-statistics>
          </div>
        </div>
      </div>
      <!-- 风投轮播 -->
      <div class="carouselBox">
        <div class="carouselCon">
          <el-carousel
            height="44px"
            direction="vertical"
            indicator-position="none"
            :autoplay="true"
          >
            <!-- <el-carousel-item v-for="item in 3" :key="item">
              <p class="homeSwiper">
                <img
                  src="@/assets/images/index/home_nav_banner_02.png"
                  alt=""
                />
              </p>
            </el-carousel-item> -->
            <el-carousel-item v-for="item in 3" :key="item">
              <div class="giftBox hidden-xs-only">
                <img src="../../assets/images/bg/giftbox.png" alt="" />
                <div style="text-align: center">
                  <p>新功能<b>"降aigc率"</b>上线了！</p>
                  <p>
                    通过"降aigc率"功能，保证知网，维普，格子达的aigc率不超过<b>
                      20% </b
                    >，<b>超必退</b> ！
                  </p>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- 礼包 -->
      <!-- <div v-if="!showContent" class="giftBox hidden-xs-only">
        <img src="../../assets/images/bg/giftbox.png" alt="" />

        <p>
          降AIGC率上线了! 全网效果最佳！知网，维普，格子达aigc率不超过<b>
            20% </b
          >，<b>超必退</b> ！
        </p>
      </div> -->

      <!-- 礼包结束 -->
      <div :class="[showContent ? '' : 'leftNavbarPosition']">
        <div class="flex navBarRight">
          <!-- <div class="gift">
            <span class="num">1</span>
          </div> -->
          <!-- <div
            class="giftBtn hidden-xs-only"
            v-if="sub_domain == 'www'"
            @click="showGift"
          >
            <span class="icoSpan"> HOT </span>
            <span class="giftSpanMain">最新活动 </span>
          </div> -->
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="分享获取免费查重券"
            placement="top"
          >
            <div class="shareBtn" @click="showLink">
              <span>
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-icon--share"></use>
                </svg>
              </span>
            </div>
          </el-tooltip> -->

          <div
            v-if="avatar"
            class="navOrderBtn g_hover"
            @click="navClickOrder(3)"
          >
            <span class="menuIcon">
              <img src="@/assets/images/nav/coupon_menu_icon.png" alt="" />
            </span>
            <span> 优惠卷 </span>
          </div>
          <div
            v-if="avatar"
            class="navOrderBtn g_hover"
            @click="navClickOrder(1)"
          >
            <span class="menuIcon">
              <img src="@/assets/images/nav/order_menu_icon.png" alt="" />
            </span>
            <span> 我的订单 </span>
          </div>
          <div
            v-if="avatar"
            class="navOrderBtn g_hover"
            @click="navClickOrder(2)"
          >
            <span class="menuIcon">
              <img src="@/assets/images/nav/outline_menu_icon.png" alt="" />
            </span>
            <span> 我的大纲 </span>
          </div>
          <!-- 钱包 -->
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="我的钱包"
            placement="top"
          >
            <div
              v-if="avatar"
              class="navOrderBtn g_hover"
              @click="$jumpUrl('/wallet/recharge')"
            >
              <i class="el-icon-wallet"></i>
              <span> 钱包 </span>
            </div>
          </el-tooltip> -->

          <!-- 登录按钮 -->
          <template>
            <div
              v-if="!avatar"
              @click="pushLogin"
              class="login_box hidden-xs-only"
            >
              <div class="img">登录</div>
            </div>
            <div v-else class="login_box hidden-xs-only">
              <UserMenu>
                <div class="img">
                  <img :src="avatar" alt="" />
                </div>
              </UserMenu>
            </div>
            <div class="menuBtn hidden-sm-and-up" @click="showDraw">
              <i class="el-icon-s-operation"></i>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 菜单栏 -->
    <el-drawer
      size="40%"
      :visible.sync="drawerStatus"
      :direction="direction"
      :before-close="handleClose"
      :show-close="false"
      append-to-body
    >
      <template slot="title">
        <div>我的菜单</div>
      </template>
      <div class="flex flex-star">
        <template v-if="!hasLogin">
          <div
            class="text-main items-center siderbar-item"
            @click="
              drawerStatus = false;
              pushLogin();
            "
          >
            登录
          </div>
          <div
            :class="[
              'text-main items-center siderbar-item',
              'home' == $route.name ? 'active' : '',
            ]"
            @click="
              drawerStatus = false;
              $jumpUrl('/home/home');
            "
          >
            {{ $t("route.homePage") }}
          </div>
        </template>
        <template v-else>
          <div
            :class="[
              'text-main items-center siderbar-item',
              'home' == $route.name ? 'active' : '',
            ]"
            @click="
              drawerStatus = false;
              $jumpUrl('/home/home');
            "
          >
            {{ $t("route.homePage") }}
          </div>
          <div
            :class="[
              'text-main items-center siderbar-item',
              'userInfo' == $route.name ? 'active' : '',
            ]"
            @click="
              drawerStatus = false;
              $jumpUrl('/user/userInfo');
            "
          >
            我的个人主页
          </div>
          <div
            v-if="
              userInfo.permission == 'AGENT' ||
              userInfo.permission == 'SUPER_ADMIN'
            "
            :class="[
              'text-main items-center siderbar-item',
              'userInfo' == $route.name ? 'active' : '',
            ]"
            @click="
              drawerStatus = false;
              $jumpUrl('/user/promotion');
            "
          >
            {{ $t("navbar.myPromotion") }}
          </div>
        </template>
        <div
          class="text-main items-center siderbar-item"
          @click="
            drawerStatus = false;
            showOrderList(1);
          "
        >
          我的订单
        </div>
        <div
          class="text-main items-center siderbar-item"
          @click="
            drawerStatus = false;
            showOrderList(2);
          "
        >
          我的大纲
        </div>
        <div></div>
        <template v-for="(route, j) in routerList">
          <div
            :key="'route_in_right_nav_' + j"
            :class="[
              'text-main items-center siderbar-item',
              route.meta.inDevelopment ? 'gray' : '',
              route.name == $route.name ? 'active' : '',
            ]"
            @click="
              drawerStatus = false;
              $jumpUrl('/main/' + route.path);
            "
          >
            {{ generateTitle(route.meta.title) }}
          </div>
        </template>
        <div
          v-if="hasLogin"
          class="text-main items-center siderbar-item"
          @click="
            drawerStatus = false;
            loginOut();
          "
        >
          退出登录
        </div>
      </div>
    </el-drawer>

    <!-- 分享页面 -->
    <gift-page ref="giftRef"></gift-page>
    <login-page ref="loginRef"></login-page>
    <share-link ref="linkRef"></share-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import UserMenu from "./UserMenu.vue";
import giftPage from "./giftPage.vue";
import loginPage from "./loginPage.vue";
import shareLink from "./shareLink.vue";

import UserOrders from "./UserOrders.vue";
import UserOutlines from "./UserOutlines.vue";
import { generateTitle } from "@/utils/i18n";
import eventBus from "@/utils/eventBus";
import dataStatistics from "@/components//DataStatistics/index.vue";

import { getToken, setToken, removeToken } from "@/utils/auth"; // get token from cookie
const _ = require("lodash");
export default {
  components: {
    Breadcrumb,
    Hamburger,
    UserMenu,
    UserOrders,
    UserOutlines,
    dataStatistics,
    giftPage,
    loginPage,
    shareLink,
  },
  props: {
    showContent: {
      require: true,
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  data() {
    return {
      listId: 0,
      carouseStatus: true,

      logo: require("@/assets/images/MIXPAPER.png"),
      logoMax: require("@/assets/images/logoMax.png"),

      drawerStatus: false,
      direction: "rtl", //小屏菜单抽屉方向
      orderDirection: "ltr", //用户订单抽屉方向
      hasLogin: true,
      ordersDrawer: false,
      orderTabs: 1,

      routerList: [], //展示在导航栏的菜单路由
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "userInfo",
      "name",
      "avatar",
      "device",
      "sub_domain",
    ]),
  },

  mounted() {
    this.$log("tokend", getToken());
    this.hasLogin = getToken();
    this.$log("routes:", this.$router.options.routes);
    let arr = _.find(
      this.$router.options.routes,
      (obj) => obj.name == "main" && obj.meta.id == "5"
    );
    this.routerList = arr.children;
    // console.log('loca', localStorage.getItem('firstTag'))
    // let firstTag = localStorage.getItem('firstTag');
    // if (firstTag != '1') {
    //   this.showGift();
    // }
  },

  methods: {
    showLink() {
      this.$refs.linkRef.showInit();
    },
    showGift() {
      this.$refs.giftRef.showInit();
    },
    generateTitle,
    showOrderList(status) {
      const hasToken = getToken();
      this.$log("hasToken", hasToken);
      if (hasToken) {
        // 打开大纲/订单
        eventBus.emit("showEmitList", status);

        // this.orderTabs = status;

        // this.listId = new Date().getTime();
        //  this.$log("this.", this.listId);
        // this.ordersDrawer = true;
      } else {
        this.$confirm("查看订单需要登录, 是否跳转到登录页?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
          .then(() => {
            // 跳转登录页
            // this.$router.push("/login");
            eventBus.emit("showLogin"); // 发布事件
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消生成",
            });
          });
      }
    },
    handleClose(done) {
      done();
    },
    handleOrdersClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //     .then(_ => {
      //         done();
      //     })
      //     .catch(_ => {
      //         alert('先不关')
      //     });
    },
    pushLogin() {
      // this.$router.push("/login");
      this.$refs.loginRef.showInit();
    },
    showDraw() {
      this.drawerStatus = true;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    toView(index, path) {
      this.$store.dispatch("app/setActiveSidebar", 1);
      this.$jumpUrl(path);
    },
    loginOut() {
      removeToken();
      localStorage.removeItem("loginID");
      // this.$router.push("/");
      location.reload();
    },
    navClickOrder(status) {
      if (status == 3) {
        this.$jumpUrl("/home/redemption");
      } else {
        eventBus.emit("showOrderList", status);
      }
    },
  },
  created() {
    eventBus.on("showGift", this.showGift); // 订阅事件
    eventBus.on("showLogin", this.pushLogin); // 订阅事件
  },
  beforeDestroy() {
    eventBus.off("showGift", this.showGift); // 移除事件监听
    eventBus.off("showLogin", this.pushLogin); // 移除事件监听
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

@media only screen and (max-width: 990px) {
  .navbarHome {
    padding-left: 0px;

    .navItem {
      display: none;
    }
  }
}

@media only screen and (min-width: 640px) {
  .menuBtn {
    margin: 0;
    display: block;
    margin-right: 0 !important;
  }
}

.navMain {
  display: flex;
  padding: 0 10px;
  // max-width: 1100px;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  justify-content: space-between;
  background: #fff;
}

.operation_box {
  font-size: 20px;
  padding: 5px;
  border-radius: 5px;
  position: relative;
  left: 10px;
}

.navbarHome {
  // padding: 0 16px;
  height: 80px;
  width: 100%;

  .el-col {
    height: 100%;
  }

  .login_box {
    font-size: 12px;
    position: relative;
    cursor: pointer;

    .img {
      border-radius: 50%;
      width: 35px;
      height: 35px;
      background: #909399;
      text-align: center;
      line-height: 35px;
      font-size: 20px;
      color: $white;
      // color: var(--white);
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.web_title {
  font-size: 20px;
  font-weight: bold;

  span {
    font-size: 14px;
    position: relative;
    left: -5px;
  }
}

.nav_left {
  color: rgb(75 85 99);
  height: 100%;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.logo-box {
  // width: 176px;
  height: 40px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logoR {
    width: 48px;
    height: 40px;
    margin-right: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .phoneRLogo {
    height: 24px;
  }
}

.phoneLogo {
  display: none;
}

.mobile .logo-box {
  margin-right: 0px;
}

.mobile .phoneLogo {
  display: flex !important;
}

.mobile .navbarHome {
  height: 50px !important;

  .logoL {
    height: 24px;

    img {
      width: 90px;
      height: 15px;
    }
  }

  .logoR {
    width: 29px;
    height: 24px;
  }
}

.logoL {
  width: 117px;
  height: 40px;
  font-family: DOUYINSANSBOLD, DOUYINSANSBOLD;
  font-weight: normal;
  font-size: 26px;
  color: rgba(0, 0, 0, 0.85);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;

  img {
    width: 117px;
    height: 19px;
  }

  p {
    width: 100%;
    font-family: arial, "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑",
      "宋体", 宋体, Tahoma, Arial, Helvetica, STHeiti;
    text-align: center;
    font-weight: 600;
    // transform: rotateX(45deg) scaleX(1.2);
  }
}

.phoneLLogo {
  img {
    width: 90px;
    height: 15px;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  height: 100%;

  &:hover > div {
    cursor: pointer;
  }
}

.navbarHome {
  width: 100%;
  // overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  &.grayBg {
    background: #f7f7f7;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.items-align-right {
  justify-content: flex-end;
}

.flex.flex-star {
  justify-content: flex-start;
  flex-direction: column;
}

.text-main {
  margin-right: 1.5rem;
}

.text-main:hover {
  color: rgb(59 130 246 / 1);
}

.siderbar-item {
  padding-left: 20px;
  padding-bottom: 15px;
  cursor: default;

  &.active {
    color: rgb(59 130 246 / 1);
  }

  &.gray {
    color: #777777b5;
  }
}

// 重置订单抽屉样式
.drawBox {
  padding-left: 10px;
  position: relative;
}

.drawBox::before {
  content: "";
  display: block;
  position: absolute;
  top: -14px;
  left: 0px;
  width: 100%;
  height: 0px;
  border-top: 1px solid #0000001f;
}

.navItems {
  & > div:hover {
    cursor: pointer;
  }

  font-size: 14px;
  line-height: 24px;
  height: 100%;
  align-items: center;

  .navItem {
    padding: 0 10px;
    color: #777777;

    &.gray {
      color: #777777d5;
    }

    &:hover {
      font-weight: 600;
      color: #212121;
      position: relative;

      &::after {
        content: "";
        display: block;
        width: calc(100% - 20px);
        height: 3px;
        background: #3355ff;
        position: absolute;
        left: 50%;
        bottom: -3px;
        transform: translate(-50%, 0);
      }
    }
  }

  .active {
    font-weight: 600;
    color: #212121;
    position: relative;

    &::after {
      content: "";
      display: block;
      width: calc(100% - 20px);
      height: 3px;
      background: #3355ff;
      position: absolute;
      left: 50%;
      bottom: -3px;
      transform: translate(-50%, 0);
    }
  }
}
.shareBtn {
  font-size: 20px;
  color: #3355ff;
  &:hover {
    cursor: pointer;
  }
}
.walletBox {
  font-size: 24px;
  color: #3355ff;
  &:hover {
    cursor: pointer;
  }
}
.navOrderBtn {
  // width: 88px;
  padding: 0px 10px;
  height: 32px;
  background: #0066ff1a;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #0066ff;
  line-height: 32px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}
.navBarRight {
  height: 100%;
  align-items: center;

  > div {
    margin: 0 5px;
  }

  .gift {
    --size: 18px;
    width: var(--size);
    height: var(--size);
    background-image: url("../../assets/images/gift.png");
    background-size: 100% 100%;
    position: relative;
    cursor: pointer;

    .num {
      background-color: #ff4d4d;
      line-height: 18px;
      padding: 0 6px;
      color: #fff;
      border-radius: 9px;
      position: absolute;
      right: -13px;
      top: -10px;
    }
  }

  .giftBtn {
    box-sizing: border-box;
    position: relative;
    border-radius: 5px;
    padding: 0px 10px;
    line-height: 36px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    .giftSpanMain {
      display: inline-block; /* 将span设置为行内块级元素 */
      width: 75px; /* 设置固定宽度，具体宽度可根据需要调整 */
      margin-left: 5px;
      overflow: hidden; /* 隐藏超出内容 */
      white-space: nowrap; /* 强制文本在一行中显示 */
      text-overflow: ellipsis; /* 添加省略号 */
    }
    .icoSpan {
      height: 12px;
      border-radius: 5px;
      border: 1px solid #e20000;
      color: #e20000;
      font-size: 10px;
      line-height: 11px;
      padding: 0 3px;
      position: absolute;
      right: -4px;
      top: -3px;
      border-bottom-left-radius: 0px;
    }
  }
}

.menuBtn {
  font-size: 24px;
}
.navleftData {
  display: flex;
  .navWidth {
    width: 250px;
  }
  .navDataLine {
  }
}
.giftBox {
  display: flex;
  align-items: center;
  height: 40px;
  background: #ffefe7;
  border: 1px solid #ffd1b9;
  border-radius: 8px;
  padding-left: 10px;
  padding-right: 10px;
  img {
    width: 26px;
    margin-right: 8px;
    height: 26px;
  }
  font-size: 14px;
  color: #e20000;
}
.carouselBox {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  .carouselCon {
    width: 550px;
  }
}
.homeSwiper {
  width: 280px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
  }
}
.menuIcon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 3px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
