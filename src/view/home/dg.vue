<template>
  <template v-for="(item, idx) in arr" :key="idx">
    <div v-if="item.show" :class="item.className">
      <span class="class-key" @click="copyValue(item.key, 'key')">
        {{ item.key }}
      </span>
      <span class="maohao" v-if="item.key">:</span>
      <img
        v-if="item.icon"
        @click.stop="dbClick(item)"
        :src="item.icon === 1 ? rSvg : aSvg"
        alt=""
      />
      <span class="type" v-if="item.icon !== 1 && item.type">{{
        item.type
      }}</span>
      <span class="fuhaoStart">{{ item.fuhaoStart }}</span>
      <span
        class="class-value"
        :class="item.class"
        @click="copyValue(item.value, 'value', item.class)"
      >
        {{ item.value }}
      </span>
      <span class="len" v-if="item.children && item.icon !== 1">
        {{ item.children.length }}
      </span>
      <dg :arr="item.children"></dg>
      <span class="fuhaoEnd">{{ item.fuhaoEnd }}</span>
      <span>{{ item.douhao }}</span>
    </div>
  </template>
</template>

<script>
import { ElNotification } from 'element-plus'
export default {
  name: 'dg',
  props: ['arr'],
  data() {
    return {
      aSvg: require('@/assets/images/a.svg'),
      rSvg: require('@/assets/images/r.svg'),
    }
  },
  methods: {
    getT(val) {
      return Object.prototype.toString.call(val)
    },
    async copyValue(value, type, className) {
      let newVal = null
      if (type === 'key') {
        newVal = value.slice(1, value.length - 1)
      }
      if (type === 'value') {
        if (className.includes('null')) {
          newVal = null
        } else if (className.includes('string')) {
          newVal = value.slice(1, value.length - 1)
        } else {
          newVal = value
        }
      }

      var dom = document.createElement('input')
      dom.value = newVal
      document.body.append(dom)
      dom.select()
      document.execCommand('copy')
      ElNotification({
        message: '复制成功',
        type: 'success',
      })
      document.body.removeChild(dom)

      // try {
      //   await navigator.clipboard.writeText(newVal)
      //   ElNotification({
      //     message: '复制成功',
      //     type: 'success',
      //   })
      // } catch (error) {
      //   // ElMessage.error('复制暂不支持H5', error)
      // }
    },
    dbClick(data) {
      if (data.icon) {
        if (data.icon === 1) {
          data.icon = 2
        } else {
          data.icon = 1
        }
      }

      data.children.forEach((k) => {
        k.show = !k.show
      })
    },
    allHandle(data, dgShow, ceng = 1) {
      data &&
        data.forEach((k) => {
          if (k.icon) {
            k.icon = dgShow ? 1 : 2
          }
          if (ceng !== 1) k.show = dgShow
          k.children &&
            k.children.forEach((j) => {
              j.show = dgShow
              if (j.icon) {
                j.icon = dgShow ? 1 : 2
              }
              this.allHandle(j.children, dgShow, 2)
            })
        })
    },
  },
}
</script>

<style lang="less" scoped>
div {
  padding-left: 30px;
  margin-left: 8px;
  font-weight: 600;
  line-height: 24px;
}

.ml0 {
  padding-left: 0;

  div {
    border-left: 1px solid #999;
  }

  > div {
    border: none;
  }
}

.fuhaoStart,
.fuhaoEnd,
.len {
  margin-left: 6px;
}
.maohao {
  margin-left: 3px;
  margin-right: 3px;
}
.type {
  margin-left: 3px;
}

img {
  width: 16px;
  cursor: pointer;
  position: relative;
  top: 3px;
}

.class-key {
  color: #92278f;
  cursor: pointer;
}

.class-value {
  cursor: pointer;
}

.val-name {
  color: #25aae2;
}

.class-number {
  color: #25aae2;
}

.class-string {
  color: #3ab54a;
}

.class-boolean {
  color: #f3934e;
}

.class-null {
  color: #f34e5c;
}
</style>
