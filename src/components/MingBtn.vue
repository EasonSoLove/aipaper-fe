<template>
  <div
    v-if="false"
    :class="['ming-checkbox', { disabled: isDisabled }]"
    @click="handleContainerClick"
  >
    <input
      type="checkbox"
      :checked="isChecked"
      @change="handleChange"
      class="ming-checkbox-input"
      :disabled="isDisabled"
    />
    <span class="ming-checkbox-label">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: "MingBtn",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isChecked: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val); // 触发 v-model 的更新
      },
    },
    isDisabled() {
      return this.disabled;
    },
  },
  methods: {
    handleChange(event) {
      if (!this.isDisabled) {
        const newValue = event.target.checked;
        this.$emit("input", newValue); // 更新 v-model
        this.$emit("change", newValue); // 发出 change 事件，传递当前状态
      }
    },
    handleContainerClick() {
      console.log("ddd", this.isDisabled);
      if (this.isDisabled) {
        // 提示用户该按钮已禁用
        this.$message({
          type: "warning",
          message: "订单页暂不支持修改,请在大纲页点击生成全文前 选择是否开启!",
        });
        return; // 阻止后续操作
      }
      this.isChecked = !this.isChecked;
    },
  },
};
</script>

<style scoped>
.ming-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 2px solid #ffd700; /* 使用金色边框 */
  border-radius: 5px;
  padding: 10px 20px;
  background-color: transparent;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.ming-checkbox.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ming-checkbox:hover:not(.disabled) {
  background-color: rgba(255, 215, 0, 0.1); /* 金色背景渐变 */
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); /* 金色阴影 */
}

.ming-checkbox-input {
  margin-right: 10px;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ffd700;
  border-radius: 3px;
  background-color: transparent;
  position: relative;
  transition: background-color 0.3s, border-color 0.3s;
}

.ming-checkbox-input:checked::before {
  content: "✔";
  font-size: 14px;
  color: #ffd700;
  position: absolute;
  top: 0;
  left: 3px;
}

.ming-checkbox-label {
  user-select: none;
  font-size: 16px;
  font-weight: bold;
  color: #ffd700; /* 使用金色字体 */
}
</style>
