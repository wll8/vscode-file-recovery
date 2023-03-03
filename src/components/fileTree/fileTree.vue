<template>
  <div class="com-fileTree">
    <h1>vscode file recovery</h1>
    <div class="action">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="form.in" placeholder="选择搜索范围">
            <el-option label="所有目录" value="所有目录"></el-option>
            <el-option
              :disabled="curDir === ``"
              label="当前目录"
              value="当前目录"
            ></el-option>
            <el-option
              :disabled="curFile === ``"
              label="当前文件"
              value="当前文件"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="form.type" placeholder="选择搜索类型">
            <el-option label="文件名或内容" value="文件名或内容"></el-option>
            <el-option label="文件名" value="文件名"></el-option>
            <el-option label="文件内容" value="文件内容"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="form.text" placeholder="搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Finder
      class="tree-container"
      ref="finder"
      :tree="tree"
      :item-component="itemComponent"
      :arrow-component="{ render: () => `` }"
      @expand="onExpand"
    ></Finder>

    <el-drawer :visible.sync="drawer" :title="curFile">
      <div class="drawerBox" v-if="drawer">
        <div class="text">
          <el-input
            class="textarea"
            type="textarea"
            placeholder="..."
            :value="textarea"
            resize="none"
          >
          </el-input>
        </div>
        <div class="list">
          <div
            :class="[`list-item`, { cur: curTime.cache === item.id }]"
            v-for="item in curList"
            :key="item.id"
            @click="() => $refs.finder.expand(item.id)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { Finder } from '@jledentu/vue-finder'
import item from './item.vue'
import msg from './msg.js'
import '@jledentu/vue-finder/dist/vue-finder.css'
function findNodesById(nodes, ids) {
  const result = []

  nodes.forEach((node) => {
    if (ids.includes(node.id)) {
      result.push(node)
    }

    if (node.children && node.children.length) {
      result.push(...findNodesById(node.children, ids))
    }
  })

  return result
}

export default {
  name: `com-fileTree`,
  data() {
    return {
      drawer: false,
      textarea: ``,
      form: {
        in: ``, // 搜索位置
        type: ``, // 搜索类型
        text: ``, // 用户输入的字符
        curDir: ``,
        curFile: ``,
      },
      selectIdPath: [],
      tree: {},
      itemComponent: item,
    }
  },
  async created() {
    msg.$on(`event`, (type, data) => {
      setTimeout(() => {
        console.log({ type, data }, this.selectIdPath)
        const fnMap = {
          dblclick: () => {
            this.curTime.cache && (this.drawer = true)
          },
        }
        fnMap[type] && fnMap[type]()
      }, 0)
    })
    this.$once(`hook:beforeDestroy`, () => {
      msg.$off()
    })
  },
  components: {
    Finder,
  },
  async mounted() {},
  computed: {
    curTime() {
      // 尾部的节点
      let [node1 = {}, node2 = {}, node3 = {}] = findNodesById(
        this.tree.children || [],
        this.selectIdPath
      ).reverse()
      const data =
        node1.type === `time`
          ? {
              cache: node1.id, // 数据缓存位置
              rresource: node2.rresource, // 应恢复到的位置
              rresourceDir: node2.rresourceDir, // 应恢复到的目录
            }
          : {}
      return data
    },
    curList() {
      // 尾部的节点
      let [node1 = {}, node2 = {}, node3 = {}] = findNodesById(
        this.tree.children || [],
        this.selectIdPath
      ).reverse()
      const data = node1.type === `time` ? node2.children : []
      return data
    },
    curDir() {
      // 尾部的节点
      let [node1 = {}, node2 = {}, node3 = {}] = findNodesById(
        this.tree.children || [],
        this.selectIdPath
      ).reverse()
      const data = [node1, node2, node3].find((item) => item.type === `dir`)
      return data ? data.id : ``
    },
    curFile() {
      // 尾部的节点
      let [node1 = {}, node2 = {}, node3 = {}] = findNodesById(
        this.tree.children || [],
        this.selectIdPath
      ).reverse()
      const data = [node1, node2, node3].find((item) => item.type === `fileDir`)
      return data ? data.id : ``
    },
  },
  watch: {
    '$attrs.fileData': {
      immediate: true,
      handler(val) {
        this.tree = { id: `root`, children: val }
        this.$nextTick(() => {
          // this.$refs.finder.expand(
          //   `C:/Users/win/AppData/Roaming/Code/User/History/-126abc21/rjpI.vue`
          // )
        })
      },
    },
    curTime: {
      immediate: true,
      async handler(val = {}, old = {}) {
        if (val.cache && val.cache !== old.cache) {
          console.log(`valval`, val)
          this.textarea = ``
          const httpData = await this.$http.post(`/api/getTime`, val)
          this.textarea = httpData.text
        }
      },
    },
  },
  methods: {
    onExpand({ expanded, sourceEvent }) {
      // console.log(`expanded`, expanded)
      this.selectIdPath = expanded
    },
  },
}
</script>
<style lang="less" scoped>
.com-fileTree {
  .tree-container {
    height: 50vh;
  }
  ::v-deep {
    .item.expanded {
      background-color: #ddd;
      color: #000;
    }
    .item .inner-item {
      padding: 2px;
    }
    [data-icon] {
      display: none;
    }
    [data-select='true'][data-cur] [data-icon='time-select'],
    [data-type='dir'] [data-icon='dir'],
    [data-type='fileDir'] [data-icon='fileDir'],
    [data-type='time'] [data-icon='time'] {
      display: inline;
    }
    [data-type='time'] {
      cursor: pointer;
      user-select: none;
    }

    .el-drawer {
      width: calc(100% - 20px) !important;
    }
  }
  .drawerBox {
    padding: 10px;
    .text {
      flex-grow: 1;
      .textarea {
        ::v-deep {
          textarea {
            height: 85vh;
          }
        }
      }
    }
    display: flex;
    .list {
      width: 200px;
      height: 85vh;
      padding-left: 10px;
      overflow-y: scroll;
      .list-item {
        cursor: pointer;
        user-select: none;
        padding: 4px;
        & + .list-item {
          margin-top: 5px;
        }
        &.cur {
          background-color: #ddd;
        }
      }
    }
  }
}
</style>
