<template>
  <div class="ming-checkbox" @click="toggleCheck">
    <input
      type="checkbox"
      :checked="isChecked"
      @change="handleChange"
      class="ming-checkbox-input"
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
  },
  computed: {
    isChecked: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    toggleCheck() {
      this.isChecked = !this.isChecked;
      this.$emit("change", this.isChecked); // 确保传递当前选中状态
    },
    handleChange(event) {
      this.isChecked = event.target.checked;
      this.$emit("change", this.isChecked);
    },
  },
};
</script>

<style scoped>
.ming-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.ming-checkbox-input {
  margin-right: 5px;
}

.ming-checkbox-label {
  user-select: none;
}
</style>
