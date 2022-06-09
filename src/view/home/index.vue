<template>
  <div class="json-format">
    <div class="common left">
      <div class="cell">
        <el-check-tag checked @click="formatInit">格式化源</el-check-tag>
      </div>
      <textarea :value="leftValue" @input="leftInp"></textarea>
    </div>
    <div class="common right">
      <div class="cell">
        <div>
          <el-check-tag checked @click="allHandle(true)">全部展开</el-check-tag>
          <el-check-tag @click="allHandle(false)">全部收起</el-check-tag>
          <!-- <el-check-tag type="info" @click="$router.push('/sgs')"
            >三国杀语音代码</el-check-tag
          > -->
        </div>
        <div>
          <el-tag type="info" @click="$refs.updateRef.show()">更新记录</el-tag>
          <el-tag type="info" @click="fk">反馈</el-tag>
        </div>
      </div>
      <div class="content">
        <template v-if="errMsg">
          <div class="err-msg" v-html="errMsg"></div>
          <el-button class="y-position" @click="findPosition">
            一键定位
          </el-button>
        </template>
        <template v-else>
          <Dg :arr="codeContent" ref="dgRef" />
        </template>
      </div>
      <Update ref="updateRef" />
    </div>
  </div>
</template>

<script>
import Dg from './dg.vue'
import Update from './update.vue'
import { ElNotification } from 'element-plus'
export default {
  name: 'Home',
  components: { Dg, Update },
  data() {
    return {
      objdata: {
        kind: 'youtube#searchListResponse',
        etag: '"m2yskBQFythfE4irbTIeOgYYfBU/PaiEDiVxOyCWelLPuuwa9LKz3Gk"',
        nextPageToken: 'CAUQAA',
        regionCode: 'KE',
        pageInfo: {
          totalResults: 4249,
          resultsPerPage: 5,
        },
        items: [
          {
            kind: 'youtube#searchResult',
            etag: '"m2yskBQFythfE4irbTIeOgYYfBU/QpOIr3QKlV5EUlzfFcVvDiJT0hw"',
            id: {
              kind: 'youtube#channel',
              channelId: 'UCJowOS1R0FnhipXVqEnYU1A',
            },
          },
          {
            kind: 'youtube#searchResult',
            etag: '"m2yskBQFythfE4irbTIeOgYYfBU/AWutzVOt_5p1iLVifyBdfoSTf9E"',
            id: {
              kind: 'youtube#video',
              videoId: 'Eqa2nAAhHN0',
            },
          },
          {
            kind: 'youtube#searchResult',
            etag: '"m2yskBQFythfE4irbTIeOgYYfBU/2dIR9BTfr7QphpBuY3hPU-h5u-4"',
            id: {
              kind: 'youtube#video',
              videoId: 'IirngItQuVs',
            },
          },
        ],
      },
      handType: ['String', 'Number', 'Boolean', 'Null'],
      leftValue: '',
      codeContent: [],
      errMsg: null,
      error: null,
      aSvg: require('@/assets/images/a.svg'),
      rSvg: require('@/assets/images/r.svg'),
    }
  },
  created() {
    try {
      this.initData()
      this.errMsg = null
    } catch (error) {
      this.handleErr(error)
    }

    ElNotification({
      title: '',
      dangerouslyUseHTMLString: true,
      message:
        '<div class="all-msg">点击<span class="key">key</span>和<span class="value">value</span>可以复制哦</div>',
      showClose: false,
      position: 'bottom-right',
    })
  },
  methods: {
    fk() {
      window.open('https://support.qq.com/products/405078?')
    },
    handleErr(err, isShowTips) {
      isShowTips &&
        ElNotification({
          title: '请先处理解析错误!',
          dangerouslyUseHTMLString: true,
          message: this.errMsg,
          type: 'error',
          position: 'bottom-right',
        })
      this.error = err
      const errArr = err.toString().split(' ')
      if (errArr[errArr.length - 2] === 'position') {
        let pos = errArr[errArr.length - 1]
        pos = Number(pos)
        this.errMsg = `第 ${pos} 位字符解析错误!<br/>（光标选中处）`

        this.$nextTick(() => {
          var textarea = document.querySelector('textarea')
          textarea.focus()
          textarea.selectionStart = pos
          textarea.selectionEnd = pos + 1

          // 创建pre保存格式，填充left的value的slice(0,pos)，返回高度
          const preDom = document.createElement('pre')
          preDom.innerHTML = this.leftValue.slice(0, pos)
          preDom.style.width = textarea.offsetWidth + 'px'
          preDom.style.padding = '10px'
          preDom.style.wordBreak = 'break-all'
          document.body.append(preDom)
          textarea.scroll({
            top: preDom.offsetHeight,
            left: 0,
            behavior: 'smooth',
          })
          document.body.removeChild(preDom)
        })
      }
    },
    formatInit() {
      try {
        var s = JSON.stringify(JSON.parse(this.leftValue), null, 4)
        this.leftValue = s
        localStorage.setItem('leftVal', JSON.stringify(s))
      } catch (error) {
        this.handleErr(error, true)
      }
    },
    findPosition() {
      if (this.errMsg) {
        this.handleErr(this.error)
      }
    },
    allHandle(foo) {
      if (this.errMsg) {
        this.handleErr(this.error, true)
        return
      }
      this.$refs.dgRef.allHandle(this.codeContent, foo)
    },
    initData() {
      let json = JSON.stringify(this.objdata)
      const loca = JSON.parse(localStorage.getItem('leftVal')) || json
      this.leftValue = loca
      this.init(JSON.parse(loca))
    },
    init(data) {
      let isShowKey = true
      let keyStart = ''
      let keyEnd = ''
      let type = ''

      if (this.getT(data).includes('Object')) {
        isShowKey = true
        keyStart = '{'
        keyEnd = '}'
        type = 'Object'
      } else if (this.getT(data).includes('Array')) {
        isShowKey = false
        keyStart = '['
        keyEnd = ']'
        type = 'Array'
      }

      this.codeContent = this.getOneObj(data, isShowKey)
      this.codeContent = [
        {
          fuhaoStart: keyStart,
          icon: 1,
          children: this.codeContent,
          fuhaoEnd: keyEnd,
          type,
          className: 'ml0',
          show: true,
        },
      ]
      // console.log(this.codeContent, 'codeContent')
    },
    /**
     * isShowKey 数组传回来是false
     */
    getOneObj(value, isShowKey = true) {
      let children = []
      const al = Object.keys(value)
      for (const key in value) {
        const showDouhao = key !== al[al.length - 1]

        if (this.getT(value[key]).includes('Object')) {
          children.push(...this.getObj(key, value[key], isShowKey, showDouhao))
        }

        if (this.getT(value[key]).includes('Array')) {
          children.push(...this.getArr(key, value[key], isShowKey, showDouhao))
        }

        if (this.handType.some((k) => this.getT(value[key]).includes(k))) {
          let valueRes = ''
          if (this.getT(value[key]).includes('Number')) {
            valueRes = Number(value[key])
          } else if (this.getT(value[key]).includes('String')) {
            valueRes = `"${value[key].replace(/"/g, "'")}"`
          } else if (this.getT(value[key]).includes('Boolean')) {
            valueRes = Boolean(value[key])
          } else if (this.getT(value[key]).includes('Null')) {
            valueRes = 'null'
          } else {
            valueRes = value
          }

          children.push({
            key: isShowKey ? `"${key}"` : '',
            value: valueRes,
            douhao: showDouhao ? ',' : '',
            show: true,
            class:
              'class-' +
              this.getT(value[key])
                .replace(/\[/, '')
                .replace(/\]/, '')
                .replace(/object /, '')
                .replace(/\w?/, function (r) {
                  return r.toLowerCase()
                }),
          })
        }
      }

      return children
    },
    getObj(key, val, isShowKey, showDouhao) {
      let arr = []
      arr.push({
        key: isShowKey ? `"${key}"` : '',
        fuhaoStart: '{',
        icon: 1,
        children: this.getOneObj(val, true),
        fuhaoEnd: '}',
        douhao: showDouhao ? ',' : '',
        type: 'Object',
        show: true,
      })
      return arr
    },
    getArr(key, val, isShowKey, showDouhao) {
      let arr = []
      arr.push({
        key: isShowKey ? `"${key}"` : '',
        fuhaoStart: '[',
        icon: 1,
        children: this.getOneObj(val, false),
        fuhaoEnd: ']',
        douhao: showDouhao ? ',' : '',
        type: 'Array',
        show: true,
      })
      return arr
    },
    leftInp(e) {
      this.leftValue = e.target.value
      localStorage.setItem('leftVal', JSON.stringify(this.leftValue))
      try {
        this.init(JSON.parse(this.leftValue))
        this.errMsg = null
      } catch (error) {
        this.handleErr(error)
      }
    },
    getT(val) {
      return Object.prototype.toString.call(val)
      // slice(8,-1)
    },
  },
}
</script>
<style lang="less" scoped>
.json-format {
  width: 100%;
  height: 100%;
  display: flex;
  border: 1px solid #f5f5f5;

  > div {
    word-break: break-all;
  }

  .common {
    display: flex;
    flex-direction: column;

    .cell {
      border-bottom: 1px solid #f5f5f5;
      padding: 10px;
      display: flex;
      align-items: center;
      word-wrap: wrap;
      user-select: none;
      display: flex;
      align-content: center;
      justify-content: space-between;

      span {
        cursor: pointer;
      }

      span:not(:first-child) {
        margin-left: 15px;
      }
    }
  }

  .left {
    width: 40%;
    border-right: 1px solid #f5f5f5;

    textarea {
      width: 100%;
      height: 100%;
      padding: 10px;
      border: none;
      resize: none;
    }
  }

  .right {
    flex: 1;

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 10px;

      .err-msg {
        color: #f34e5c;
      }

      .y-position {
        margin-top: 15px;
      }
    }
  }
}
</style>
