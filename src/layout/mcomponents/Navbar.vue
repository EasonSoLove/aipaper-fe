<template>
  <div class="navbar">
    <!-- <el-row :gutter="10">
      <el-col :xs="6" :sm="6" :lg="6">

        <div class="flex navBarRight">
          <div class="gift">
            <span class="num">1</span>
          </div>
          <div class="btn" @click="$devf">升级专业版</div>
          <template>
            <div
              v-if="!hasLogin"
              @click="pushLogin"
              class="login_box hidden-xs-only"
            >
              <div class="img">登录</div>
            </div>
            <div v-else class="login_box hidden-xs-only">
              <UserMenu>
                <div class="img">
                  <span>{{ name.slice(0, 1) }}</span>
                </div>
              </UserMenu>
            </div>
          </template>
        </div>
      </el-col>
    </el-row> -->

    <!-- 用户订单 -->
    <!-- <el-drawer> </el-drawer> -->
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
// import Breadcrumb from "@/components/Breadcrumb";
// import Hamburger from "@/components/Hamburger";
// import UserMenu from "./UserMenu.vue";
// // import UserOrders from "./UserOrders.vue";
// import { getToken, setToken } from "@/utils/auth"; // get token from cookie
export default {
  // components: {
  //   Breadcrumb,
  //   Hamburger,
  //   UserMenu,
  //   // UserOrders,
  //   dataStatistics,
  // },
  // data() {
  //   return {
  //     listId: 0,
  //     logo: require("@/assets/images/logo_paper.png"),
  //     drawer: false,
  //     direction: "rtl", //小屏菜单抽屉方向
  //     orderDirection: "ltr", //用户订单抽屉方向
  //     hasLogin: true,
  //     ordersDrawer: false,
  //     activeIndex: 1,
  //   };
  // },
  // computed: {
  //   ...mapGetters(["userInfo", "name", "avatar"]),
  // },
  // mounted() {
  //   this.hasLogin = getToken();
  // },
  // methods: {
  //   showOrderList() {
  //     const hasToken = getToken();
  //     if (hasToken) {
  //       this.listId = new Date().getTime();
  //       this.ordersDrawer = true;
  //     } else {
  //       this.$confirm("查看订单需要登录, 是否跳转到登录页?", "提示", {
  //         confirmButtonText: "确定",
  //         cancelButtonText: "取消",
  //         type: "warning",
  //         center: true,
  //       })
  //         .then(() => {
  //           this.$router.push("/login");
  //         })
  //         .catch(() => {
  //           this.$message({
  //             type: "info",
  //             message: "已取消生成",
  //           });
  //         });
  //     }
  //   },
  //   handleClose(done) {
  //     done();
  //   },
  //   handleOrdersClose(done) {
  //     done();
  //     // this.$confirm('确认关闭？')
  //     //     .then(_ => {
  //     //         done();
  //     //     })
  //     //     .catch(_ => {
  //     //         alert('先不关')
  //     //     });
  //   },
  //   jumpDetail(path) {
  //     this.$router.push(path);
  //   },
  //   pushLogin() {
  //     this.$router.push("/login");
  //   },
  //   showDraw() {
  //     this.drawer = true;
  //   },
  //   toggleSideBar() {
  //     this.$store.dispatch("app/toggleSideBar");
  //   },
  //   async logout() {
  //     await this.$store.dispatch("user/logout");
  //     this.$router.push(`/login?redirect=${this.$route.fullPath}`);
  //   },
  //   toView(toPath) {
  //     this.$router.push("/" + toPath + "");
  //   },
  // },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.operation_box {
  font-size: 20px;
  padding: 5px;
  border-radius: 5px;
  position: relative;
  left: 10px;
}

.navbar {
  // padding: 0 16px;

  .el-col {
    height: 100%;
  }

  .login_box {
    font-size: 12px;
    position: relative;

    .img {
      border-radius: 50%;
      width: 35px;
      height: 35px;
      background: #fff;
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
  height: 32px;
  width: 32px;
  margin-right: 10px;

  img {
    width: 100%;
    height: 100%;
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

.navbar {
  width: 100%;
  height: $navBarHeight;
  // overflow: hidden;
  position: relative;
  background: #f7f7f7; // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

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

.navbar .el-row {
  width: 100%;
  height: 100%;
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

.navbar {
  padding-left: $sideBarWidth;
}

@media only screen and (max-width: 990px) {
  .navbar {
    padding-left: 0px;
  }
}

.navItems {
  color: #777777;
  font-size: 14px;
  line-height: 24px;
  height: 100%;
  align-items: center;

  .navItem {
    padding: 0 10px;
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

.navBarRight {
  height: 100%;
  align-items: center;

  > div {
    margin: 0 10px;
  }

  .gift {
    --size: 18px;
    width: var(--size);
    height: var(--size);
    background-image: url("../../assets/images/gift.png");
    background-size: 100% 100%;
    position: relative;

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

  .btn {
    background-color: #3355ff;
    color: #fff;
    border-radius: 18px;
    height: 36px;
    padding: 8px 10px;
    line-height: 20px;
  }
}
</style>
