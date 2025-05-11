<template>
  <div class="mingcardBox">
    <ul>
      <li
        v-for="item in items"
        :key="item.id"
        :class="{ selected: isSelected(item.id) }"
        @click="toggleSelection(item.id)"
      >
        <div class="itemLeft">
          <div class="checkbox">
            <i v-if="isSelected(item.id)" class="el-icon-circle-check"></i>
            <div v-else class="unchecked-box"></div>
          </div>
          <div>
            <div style="font-weight: bold; margin-bottom: 3px">
              {{ item.name }}
            </div>
            <div style="font-size: 11px; color: #606266">{{ item.intro }}</div>
          </div>
        </div>
        <div class="priceItem">{{ item.price }}元</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["homeData", "additionalList"]),
    items() {
      return this.homeData.additional_service || [];
    },
  },
  data() {
    return {
      selectedItems: [],
    };
  },
  mounted() {},
  methods: {
    isSelected(id) {
      return this.selectedItems.includes(id);
    },
    toggleSelection(id) {
      if (this.disabled) {
        this.$message({
          type: "warning",
          message: "请您前往大纲详情页勾选礼包, 订单支付不支持勾选礼包!",
        });
        return false;
      }

      const index = this.selectedItems.indexOf(id);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(id);
      }
    },
  },
  watch: {
    selectedItems(newSelectedItems) {
      console.log("选中的项目: ", newSelectedItems);
      this.$store.dispatch("paper/setAdditionList", newSelectedItems);
    },
    disabled: {
      handler(newVal) {
        console.log("disabled: ", newVal);
        console.log("additionalList: ", this.additionalList);
        console.log("disabled: ", newVal);
        if (this.additionalList.length > 0) {
          this.selectedItems = this.additionalList;
        }
      },
      immediate: true, // 立即触发
      deep: true, // 深度监听
    },
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

.checkbox {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}

.unchecked-box {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1px solid #999;
}

li.selected .checkbox {
  background-color: #e0f7fa;
}

li:hover {
  background-color: #f1f1f1;
}

.el-icon-circle-check {
  font-size: 20px;
  color: #42b983;
}
.mingcardBox {
  box-shadow: 0 0.125rem 0.75rem 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  border: 0.0625rem solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  padding: 10px;
  transition: 0.3s;
  padding-top: 5px;
}
.mingcardBox li {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  cursor: pointer;
  padding: 10px;
  justify-content: space-between;
  margin-top: 5px;
  border-radius: 5px;
}
.itemLeft {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.priceItem {
  color: #f53f3f;
  font-size: 15px;
  font-weight: bold;
  width: 35px;
  text-align: center;
}
</style>
