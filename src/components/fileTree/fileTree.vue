<template>
  <div class="com-fileTree">
    <div class="action">
      <el-form
        :inline="true"
        label-width="200px"
        :model="form"
        class="demo-form-inline"
      >
        <el-form-item label="where to save">
          <el-input
            style="width: 960px"
            v-model="form.toDir"
            placeholder="Save to the re-store directory"
          >
          </el-input>
        </el-form-item>
        <br />
        <el-form-item label="vscode history directory">
          <el-input
            style="width: 860px"
            v-model="form.historyPath"
            placeholder="Scan from common directories"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="scan">scan</el-button>
        </el-form-item>
        <br />
        <el-form-item label="filter from scan results">
          <el-select v-model="form.in" placeholder="select search scope">
            <el-option label="all directories" value="所有目录"></el-option>
            <el-option
              :disabled="curDir === ``"
              label="Current directory"
              value="当前目录"
            ></el-option>
            <el-option
              :disabled="curFile === ``"
              label="current file"
              value="当前文件"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="form.type" placeholder="select search type">
            <el-option
              label="filename or content"
              value="文件名或内容"
            ></el-option>
            <el-option label="file name" value="文件名"></el-option>
            <el-option label="document content" value="文件内容"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input
            style="width: 409px"
            v-model="form.text"
            placeholder="filter"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search">filter</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Finder
      v-loading="loading.scan"
      element-loading-text="scanning..."
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
            {{
              item.type === `time`
                ? $util.dateFormat(`YYYY-MM-DD hh:mm:ss`, item.label)
                : item.label
            }}
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
        toDir: ``, // 要另存到什么位置
        historyPath: ``, // 历史文件存储位置
        in: ``, // 搜索位置
        type: ``, // 搜索类型
        text: ``, // 用户输入的字符
        curDir: ``,
        curFile: ``,
      },
      loading: {
        scan: true,
      },
      fileData: {
        toDir: ``,
        historyPath: ``,
        list: [],
      },
      selectIdPath: [],
      tree: {},
      itemComponent: item,
    }
  },
  async created() {
    this.scan()
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
    fileData: {
      immediate: true,
      handler(val = {}) {
        const { list, historyPath, toDir } = val
        this.tree = { id: `root`, children: list }
        this.form.historyPath = historyPath
        this.form.toDir = toDir
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
    scan() {
      this.fileData = {}
      this.loading.scan = true
      this.$http
        .get(`/api/fileData`)
        .then((res) => {
          this.fileData = res
        })
        .catch((err) => {
          console.log(`errerr`, err)
        })
        .finally(() => {
          this.loading.scan = false
        })
    },
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
