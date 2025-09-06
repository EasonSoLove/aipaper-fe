<template>
  <div class="menuWrapper">
    <div class="mainBtn" id="mainBtn">
      <div @click.stop="togglePopup">
        <slot> 按钮 </slot>
      </div>
    </div>
    <transition name="fade">
      <div
        class="userMenuContainer"
        id="userMenuContainer"
        v-if="isPopupVisible"
        @click.stop="popupFn"
      >
        <!-- 头像菜单 -->
        <div class="userMenu">
          <div class="menuHeader">
            <div class="img">
              <img :src="avatar" alt="" />
            </div>
            <div class="info" @click="jumpToDistribution">
              <div class="name-container">
                <p class="name">{{ userInfo.user_name }}</p>

                <!-- 调试模式：显示所有VIP等级 -->
                <template v-if="debugVipMode && userVipInfo">
                  <div
                    v-for="(vipInfo, key) in userVipInfo"
                    :key="key"
                    class="vip-badge"
                    :style="{ '--vip-color': vipInfo.color }"
                  >
                    <img
                      :src="vipInfo.icon"
                      :alt="vipInfo.name"
                      class="vip-icon"
                    />
                    <span class="vip-text">{{ vipInfo.name }}</span>
                  </div>
                </template>

                <!-- 正常模式：显示单个VIP等级 -->
                <el-tooltip
                  v-else-if="!debugVipMode && userVipInfo"
                  content="点击跳转分享页面,升级您的权益"
                  placement="top"
                >
                  <div
                    class="vip-badge"
                    :style="{ '--vip-color': userVipInfo.color }"
                  >
                    <img
                      :src="userVipInfo.icon"
                      :alt="userVipInfo.name"
                      class="vip-icon"
                    />
                    <span class="vip-text">{{ userVipInfo.name }}</span>
                  </div>
                </el-tooltip>
              </div>
              <p class="tel">{{ userInfo.phone }}</p>
              <div class="tel">
                <span class="tel">{{ $t("login.lastLogin") }}：</span>
                <p class="tel">
                  {{ userInfo.last_login_time | dateFormatter }}
                </p>
              </div>
            </div>
          </div>
          <div class="menuBody">
            <div class="menuGroup menuAboutUer">
              <div class="menuItem" @click="jumpDetail('/user/userInfo')">
                <i class="el-icon-house"></i>
                {{ $t("navbar.dashboard") }}
              </div>
              <div class="menuItem" @click="showPcOrderList(1)">
                <i class="el-icon-goods"></i>
                {{ $t("navbar.orderManagement") }}
              </div>
              <div class="menuItem" @click="showPcOrderList(2)">
                <i class="el-icon-tickets"></i>
                {{ $t("navbar.myOutline") }}
              </div>
              <!-- v-if="userInfo.role == 'LEVEL_PROXY'" -->
              <div
                v-if="
                  userInfo.permission == 'AGENT' ||
                  userInfo.permission == 'SUPER_ADMIN'
                "
                class="menuItem"
                @click="$jumpUrl('/user/promotion')"
              >
                <i class="el-icon-tickets"></i>
                {{ $t("navbar.myPromotion") }}
              </div>
            </div>
            <div class="menuGroup menuAboutMixPaper">
              <!-- v-if="userInfo.permission == 'SUPER_ADMIN'" -->

              <div
                v-if="userInfo.permission == 'SUPER_ADMIN'"
                class="menuItem"
                @click="jumpDetail('/user/setting')"
              >
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-updatelog"></use>
                </svg>
                运营配置
              </div>
              <div
                v-if="userInfo.permission == 'SUPER_ADMIN'"
                class="menuItem"
                @click="jumpDetail('/user/refund')"
              >
                <i class="el-icon-heavy-rain"></i>
                退款管理
              </div>
              <div
                v-if="userInfo.permission == 'SUPER_ADMIN'"
                class="menuItem"
                @click="jumpDetail('/user/AIGClist')"
              >
                <i class="el-icon-heavy-rain"></i>
                降AIGC任务
              </div>
              <div class="menuItem gray" @click="$devf">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-updatelog"></use>
                </svg>
                {{ $t("navbar.updateLog") }}
              </div>
              <div class="menuItem gray" @click="$devf">
                <i class="el-icon-position"></i>
                <!-- <i class="el-icon-discover"></i> -->
                {{ $t("navbar.officialWebsite") }}
              </div>
              <div class="menuItem gray" @click="$devf">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-joinus"></use>
                </svg>
                {{ $t("navbar.joinUs") }}
              </div>
            </div>
            <div class="menuGroup menuAboutSetting">
              <div class="menuItem bothLeftRight">
                <div class="menuItem_left">
                  <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-zhongyingwen"></use>
                  </svg>
                  {{ $t("navbar.languageSwitch") }}
                </div>
                <div class="menuItem_right">
                  <lang-select class="right-menu-item hover-effect" />
                  <!-- 中
                  <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-qiehuan1"></use>
                  </svg>
                  英 -->
                </div>
              </div>
              <div @click="loginOut" class="menuItem logOutBox">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-logout"></use>
                </svg>
                {{ $t("navbar.logOut") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 用户订单 -->
    <el-drawer
      :visible.sync="ordersDrawer"
      :direction="orderDirection"
      append-to-body
      :lock-scroll="false"
      :size="device == 'mobile' ? '100%' : '50%'"
    >
      <template #title>
        <div v-if="orderTabs == 1" class="titleDrawer">我的订单</div>
        <div v-else class="titleDrawer">我的大纲</div>
      </template>
      <div class="drawBox">
        <user-orders v-if="orderTabs == 1" :listId="listId"></user-orders>
        <user-outlines v-if="orderTabs == 2" :listId="listId"></user-outlines>
      </div>
    </el-drawer>
  </div>
</template>
<script>
// import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import { getToken, removeToken } from "@/utils/auth"; // get token from cookie
import { mapGetters } from "vuex";
import UserOrders from "./UserOrders.vue";
import UserOutlines from "./UserOutlines.vue";
import LangSelect from "@/components/LangSelect";
import eventBus from "@/utils/eventBus";

export default {
  name: "UserMenu",
  components: {
    UserOrders,
    LangSelect,
    UserOutlines,
  },
  data() {
    return {
      // 定义变量
      isPopupVisible: false,
      listId: 0,
      orderDirection: "ltr", //用户订单抽屉方向
      ordersDrawer: false,
      orderTabs: 1,
      isPhone: false,
      // 调试模式：显示所有VIP等级
      debugVipMode: false,
    };
  },
  mounted() {
    // 页面初始化
  },
  created() {
    // step2点击重新生成大纲
    eventBus.on("showEmitList", this.showPhoneOrderList); // 订阅事件
    eventBus.on("showOrderList", this.showPcOrderList); // 订阅事件
    eventBus.on("orderDialogChange", this.closeDialog); // 订阅事件
  },
  beforeDestroy() {
    eventBus.off("showEmitList", this.showPhoneOrderList); // 移除事件监听
    eventBus.off("orderDialogChange", this.closeDialog); // 移除事件监听
    eventBus.off("showOrderList", this.showPcOrderList); // 移除事件监听
  },
  computed: {
    // 计算属性
    ...mapGetters(["avatar", "userInfo", "device"]),

    // 用户VIP信息
    userVipInfo() {
      const vipConfig = {
        NORMAL: {
          name: "普通用户",
          icon: require("@/assets/images/vip/normal.svg"),
          color: "#999999",
        },
        DISTRIBUTION: {
          name: "代理用户",
          icon: require("@/assets/images/vip/distribution.svg"),
          color: "#1890ff",
        },
        FRANCHISEE: {
          name: "城市合伙人",
          icon: require("@/assets/images/vip/franchisee.svg"),
          color: "#52c41a",
        },
        SUPER_ADMIN: {
          name: "超级管理员",
          icon: require("@/assets/images/vip/super_admin.svg"),
          color: "#f5222d",
        },
      };

      // 调试模式：显示所有VIP等级
      if (this.debugVipMode) {
        return vipConfig;
      }

      // 正常模式：根据用户权限显示对应等级
      if (!this.userInfo || !this.userInfo.permission) {
        return null;
      }

      const permission = this.userInfo.permission;
      return vipConfig[permission] || null;
    },
  },
  methods: {
    closeDialog() {
      this.ordersDrawer = false;
    },
    loginOut() {
      removeToken();
      localStorage.removeItem("loginID");
      // this.$router.push("/");
      location.reload();
    },
    // 定义方法
    togglePopup() {
      this.isPopupVisible = !this.isPopupVisible;
      if (this.isPopupVisible) {
        document.addEventListener("click", this.handleOutsideClick);
      } else {
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },
    handleOutsideClick(event) {
      const popup = document.querySelector("#userMenuContainer");
      const button = document.querySelector("#mainBtn");

      if (!popup.contains(event.target) && event.target !== button) {
        this.hidePopup();
      }
    },
    hidePopup() {
      this.isPopupVisible = false;
      document.removeEventListener("click", this.handleOutsideClick);
    },
    popupFn() {
      this.$log("129--弹窗点击事件");
    },
    jumpDetail(path) {
      this.$router.push(path);
    },

    // 跳转到分销页面
    jumpToDistribution() {
      this.$router.push("/distribution");
      this.hidePopup(); // 关闭用户菜单
    },
    showPhoneOrderList(status) {
      this.isPhone = true;
      this.showOrderList(status);
    },
    showPcOrderList(status) {
      Ming("dss", status);
      this.isPhone = false;
      this.showOrderList(status);
    },
    showOrderList(status) {
      Ming("ds2222s", status);

      this.orderTabs = status;
      // 本菜单仅在用户已登录状态可见,所以这里在查看订单前不再校验用户是否已登录
      this.listId = new Date().getTime();
      this.hidePopup();
      this.ordersDrawer = true;
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
@import "@/styles/variables.scss";

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
* p {
  margin: 0px;
}

.userMenuContainer {
  font-size: 14px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e9ecf1;
  position: absolute;
  --box-width: 280px;
  width: var(--box-width);
  right: 0;
  top: calc(#{$navBarHeight} - 10px);
}

.userMenu {
  box-shadow: 0px 6px 18px 0px rgba(29, 41, 57, 0.14);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.menuHeader {
  background-image: linear-gradient(90deg, #e3f0ff, #effcff);
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: default;
}

.menuHeader .img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  display: inline-block;
  line-height: 50px;
  font-size: 30px;
  text-align: center;
  background: #fff;
  color: #fff;
}

.menuHeader .img img {
  width: 100%;
  height: 100%;
}

.menuHeader .info {
  display: inline-block;
  line-height: 1.5em;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  padding: 4px;
  margin: -4px;
}

.menuHeader .vip-badge:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.menuHeader .info .name-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.menuHeader .info p.name {
  font-size: 16px;
  line-height: 1.8em;
  color: #1f2a2e;
  margin: 0;
}

.vip-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--vip-color, rgba(0, 0, 0, 0.08));
  font-size: 11px;
  line-height: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.vip-badge::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    var(--vip-color, transparent) 0%,
    transparent 100%
  );
  opacity: 0.1;
  z-index: 0;
}

.vip-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-color: var(--vip-color, rgba(0, 0, 0, 0.2));
}

.vip-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.vip-text {
  color: #555;
  font-weight: 600;
  white-space: nowrap;
  font-size: 10px;
  position: relative;
  z-index: 1;
}

.menuHeader .info .tel {
  color: #1f212680;
  font-size: 12px;
}

.menuBody {
  line-height: 3em;
  color: #2f2e3f;
}

.menuBody i,
.menuBody .icon.svg-icon {
  color: inherit;
}

.menuGroup {
  padding: 5px 20px;
  border-bottom: 1px solid #eeeff1;
}

.menuGroup:last-child {
  border: none;
}

.menuItem.bothLeftRight {
  display: flex;
  justify-content: space-between;
}

.logOutBox {
  color: $colorWarning;
}

// 重置订单抽屉样式
.drawBox {
  padding: 0 1.25rem 0 1.25rem;
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

.titleDrawer {
  font-size: 16px;
  color: #000;
}
</style>
