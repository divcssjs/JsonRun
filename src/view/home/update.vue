<template>
  <el-drawer v-model="open" :direction="direction" :show-close="false">
    <template #title>
      <div class="title">更新记录</div>
    </template>
    <template #default>
      <ul>
        <li>
          <span>2033.3.3</span>
          <div>待更新虚拟滚动</div>
        </li>
        <li>
          <span>2020.5.1</span>
          <div>错误信息一键定位</div>
        </li>
        <li>
          <span>2020.4.30</span>
          <div>代码格式化</div>
          <div>全部展开，全部收起</div>
          <div>格式化源</div>
        </li>
      </ul>
    </template>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      direction: 'rtl',
    }
  },
  methods: {
    show() {
      this.open = true
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  font-size: 20px;
}

ul {
  li {
    margin-bottom: 30px;
    span {
      color: #f34e5c;
      margin-bottom: 10px;
      display: block;
    }
    div {
      line-height: 24px;
    }
  }
}
</style>
