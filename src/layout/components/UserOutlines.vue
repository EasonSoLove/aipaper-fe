<template>
  <div class="ordersList" v-loading="loading">
    <div class="btns">
      <!-- <el-button type="primary" round @click="delList">删除大纲</el-button> -->
      <el-button type="primary" round @click="refresh">刷新大纲</el-button>
    </div>
    <!-- 大纲列表 -->
    <el-checkbox-group v-model="checkList" @change="handleCheckAllChange">
      <div
        class="orderBox"
        v-for="(orderObj, index) in orderList"
        :key="index + 'outline'"
      >
        <!-- <el-checkbox :label="orderObj.id" :value="orderObj.id"></el-checkbox> -->
        <div class="order">
          <div class="orderNum rowBetween">
            <!-- <div class="left">大纲号：{{ orderObj.order.out_trade_no }}</div> -->
            <div class="left"></div>
            <div class="right">
              时间：
              {{ orderObj.updated_at | dateFormatter }}
              <!-- 创建时间还是生成时间? -->
            </div>
          </div>
          <div>
            <div class="orderTitle">{{ orderObj.title }}</div>
            <div class="orderText rowBetween handleRow">
              <div class="left">
                <div>大纲状态：{{ orderObj.status }}</div>
                <div>大纲类型：{{ orderObj.product }}</div>
              </div>
              <div class="right">
                <div>
                  <el-button
                    @click="downLoadLine(orderObj)"
                    icon="el-icon-download"
                    :disabled="orderObj.status != '生成成功'"
                    type="text"
                  >
                    付费下载
                  </el-button>
                  <el-button
                    @click="jumpStep2(orderObj)"
                    icon="el-icon-view"
                    v-show="orderObj.version == 'v1'"
                    :disabled="orderObj.status != '生成成功'"
                    type="text"
                  >
                    查看大纲
                  </el-button>

                  <template v-if="orderObj.version == 'v2'">
                    <el-button
                      @click="jumpV2Outline(orderObj)"
                      v-if="
                        orderObj.status == '等待中' ||
                        orderObj.status == '生成失败'
                      "
                      icon="el-icon-view"
                      type="text"
                    >
                      继续编辑大纲
                    </el-button>
                    <el-button
                      @click="jumpV2Outline(orderObj)"
                      :disabled="orderObj.status != '生成成功'"
                      v-else
                      icon="el-icon-view"
                      type="text"
                    >
                      查看大纲
                    </el-button>
                  </template>
                </div>
                <!-- <div >
                  <el-button
                    @click="clickShowDia(orderObj)"
                    icon="el-icon-edit"
                    :disabled="orderObj.status != '生成成功'"
                    type="text"
                  >
                    根据此大纲继续生成正文,任务书等
                  </el-button>
                </div> -->
              </div>
            </div>
          </div>

          <div class="orderText rowBetween handleRow">
            <div class="left">
              学业类型:
              <span class="price">{{ orderObj.type }}</span>
            </div>
            <div class="left">
              万象大纲:
              <span class="price">{{
                orderObj.version == "v1" ? "万象专业版" : "万象定制版"
              }}</span>
            </div>
            <div class="left">
              科目:
              <span class="price">{{ orderObj.field }}</span>
            </div>
            <div class="right">
              <!-- <span class="price">￥: 0.01元</span> -->
              <!-- <span
                class="handle"
                v-if="orderObj.order.payment_status == 'WAIT_BUYER_PAY'"
                style="color: crimson"
                >去支付</span
              > -->
            </div>
          </div>
        </div>
      </div>
    </el-checkbox-group>
    <div class="block">
      <el-pagination
        background
        small
        layout="total, prev, pager, next"
        :total="page.total"
        :page-size="page.page_size"
        :current-page="page.page_num"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import { getList } from "@/api/table";
import { getOutlineList, outlineStatus } from "@/api/user";
import { throttle } from "lodash";
import eventBus from "@/utils/eventBus";
import { product } from "@/api/gpt";

export default {
  name: "UserOrders",
  props: {
    listId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // 定义变量
      checkList: [],
      orderList: [],
      loading: false,
      page: {
        page_num: 0,
        page_size: 5,
        total: null,
      },
    };
  },
  components: {
    // webinfo,
  },
  watch: {
    // 当listId发生变化时执行此回调
    listId(newVal, oldVal) {
      // 在这里处理listId变化后需要做的事情
      this.handleCurrentChange(1);
    },
  },
  mounted() {
    // 页面初始化
    this.handleCurrentChange(1);
  },

  computed: {
    // 计算属性
  },
  methods: {
    clickShowDia(row) {
      Ming("sddd", this.$route.path);
      // 关闭弹窗
      eventBus.emit("orderDialogChange", false);
      // 切换至对应v1/v2
      this.$store.dispatch("paper/setOutlineVersion", row.version);

      if (this.$route.path !== "/main/writepaper") {
        this.$router.push({ path: "/main/writepaper" }, function () {
          console.log("点击展示大纲弹窗");
          // 展示大纲弹窗
          setTimeout(() => {
            eventBus.emit("outlineGen", row);
          }, 1000);
        });
      } else {
        this.$nextTick(() => {
          // 展示大纲弹窗
          console.log("点击展示大纲弹窗2222233");
          setTimeout(() => {
            eventBus.emit("outlineGen", row);
          }, 300);
        });
      }
    },
    downLoadLine(row) {
      let requestForm = {
        title: row.title,
        threeCon: false,
        language: row.language,
        type: row.type,
        field: ["哲学", row.field],
        key: row.key1,
      };
      this.$store.dispatch("app/setRequestForm", requestForm);
      eventBus.emit("showDownOutline", requestForm);
      eventBus.emit("orderDialogChange", false);
    },
    jumpV2Outline(row) {
      zhuge.track(`用户编辑定制版大纲`, {
        大纲标题: row.title,
        大纲key: row.key1,
      });
      // 获取数据再跳转
      this.loading = true;
      outlineStatus({ key: row.key1 })
        .then((res) => {
          console.log("res", res);
          let data = {
            ...res.result,
          };
          data.field = ["哲学", row.field];
          this.$store.dispatch("paper/setFormdataV2", res.result);
          this.$store.dispatch("app/setRequestForm", data);
          // 生成大纲可点击
          this.$store.dispatch("app/setProStatus", false);

          this.loading = false;
          // 记录大纲状态
          this.$store.dispatch("paper/setOutlineVersion", res.result.version);
          this.$store.dispatch("paper/setAigc", true);

          this.jumpSelfOutline(res.result);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 跳转大纲及打开定制版
    jumpSelfOutline(requestForm) {
      this.$log("setFormdata111-----------", requestForm, 2);

      if (this.$route.path !== "/main/writepaper") {
        this.$router.push(
          {
            path: "/main/writepaper",
          },
          () => {
            this.$nextTick(() => {
              eventBus.emit("setFormData", requestForm, 2); // 发布事件
              eventBus.emit("orderDialogChange", false);

              if (requestForm.outline && requestForm.outline.outline) {
                setTimeout(() => {
                  eventBus.emit("successOutline", requestForm.outline.outline);
                }, 200);
              } else {
                this.$store.dispatch("app/setActiveIndex", 0);
                let _this = this;
                setTimeout(() => {
                  _this.$nextTick(() => {
                    _this.$scrollTo("#outlineTop", 500, { offset: -1500 });
                  });
                }, 200);
              }
            });
          }
        );
      } else {
        eventBus.emit("setFormData", requestForm, 2); // 发布事件
        eventBus.emit("orderDialogChange", false);
        let _this = this;
        if (requestForm.outline && requestForm.outline.outline) {
          setTimeout(() => {
            eventBus.emit("successOutline", requestForm.outline.outline);
          }, 200);
        } else {
          this.$store.dispatch("app/setActiveIndex", 0);
          setTimeout(() => {
            _this.$nextTick(() => {
              _this.$scrollTo("#outlineTop", 500, { offset: -1500 });
            });
          }, 200);
        }
      }
    },
    jumpStep2(row) {
      zhuge.track(`用户查看大纲`, {
        大纲标题: row.title,
        大纲key: row.key1,
      });

      this.$store.dispatch("paper/setOutlineVersion", row.version);

      // row.key1
      this.$router.push(
        {
          path: "/main/writepaper",
          query: {
            key1: row.key1,
            field: row.field,
            timeData: new Date().getTime(),
          },
        },
        () => {
          this.$nextTick(() => {
            let requestForm = {
              title: row.title,
              threeCon: false,
              language: row.language,
              type: row.type,
              field: row.field,
              key: row.key1,
              product: row.product,
              word_count: row.word_count,
            };
            this.$store.dispatch("app/setRequestForm", requestForm);
            this.$store.dispatch("paper/setAigc", true);

            eventBus.emit("setFormData", requestForm, 1); // 发布事件
            eventBus.emit("orderDialogChange", false);
          });
        }
      );
    },
    refresh() {
      this.handleCurrentChange(1);
    },
    handleCheckAllChange(val) {
      if (val.length > 1) {
        this.$message({
          type: "warning",
          message: "只能同时选择一条数据!",
        });
        this.checkList.pop();
      }
    },
    delList() {
      // delOrder(this.checkList).then((res) => {
      // });
    },
    handleCurrentChange: throttle(function (newPage) {
      this.loading = true;
      // 这里可以添加你的分页逻辑，例如发送请求获取新的数据
      let params = {
        page_num: newPage,
        page_size: this.page.page_size,
      };
      getOutlineList(params)
        .then((res) => {
          this.loading = false;

          let data = res.result;
          if (Object.keys(data).length > 0) {
            this.orderList = data.outline_list || [];
            this.page.page_num = data.page_num - 0;
            this.page.total = data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }, 300), // 300毫秒内最多执行一次
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
.ordersList {
  --border: 1px solid #0000001f;
  --border-bottom: 1px solid #0000001f;
  max-height: 90vh;
  overflow: auto;
  padding-right: 10px;
}

/* 整个滚动条 */
.ordersList::-webkit-scrollbar {
  width: 8px;
  /* 滚动条宽度 */
  background-color: #f5f5f5;
  /* 背景颜色 */
}

/* 滚动条轨道 */
.ordersList::-webkit-scrollbar-track {
  border-radius: 8px;
  background-color: #f5f5f5;
}

/* 滚动条滑块 */
.ordersList::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #555;
}

/* 当鼠标悬停在滑块上时的样式 */
.ordersList::-webkit-scrollbar-thumb:hover {
  background-color: #666;
}

.orderBox {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
}

.orderBox .order {
  display: block;
  flex-grow: 1;
  height: fit-content;
  font-size: 14px;
  padding: 10px 15px;
  // border: 1px solid #0000001f;
  border: var(--border);
  border-radius: 5px;
  margin-left: 10px;
}

.orderBox ::v-deep .el-checkbox .el-checkbox__label {
  display: none;
}

.rowBetween {
  display: flex;
  justify-content: space-between;
  line-height: 2em;
}

.rowBetween .left {
  color: #666;
}

.rowBetween .right {
  color: #409eff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.orderNum.rowBetween div {
  color: #999;
  font-size: 12px;
}

.orderTitle {
  color: #202020;
  font-weight: 600;
  margin-top: 15px;
}

.handleRow:not(:last-child) {
  border-bottom: var(--border-bottom);
  margin-bottom: 10px;
}

.btns {
  text-align: right;
  // border-top: var(--border-bottom);
  padding: 15px 0;
}

.handle {
  cursor: pointer;
  margin-left: 5px;
}
.price {
  color: #303133;
}
</style>
