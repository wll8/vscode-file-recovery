<template>
  <div
    @dblclick="msg.$emit(`event`, `dblclick`)"
    class="com-item"
    :data-select="expanded"
    :data-type="item.type"
    @mouseover.self="(ev) => mouseover({ expanded, item, ev })"
    @mouseleave.self="(ev) => mouseleave({ expanded, item, ev })"
  >
    <span data-icon="dir">
      <i v-show="expanded" class="el-icon-folder-opened"></i>
      <i v-show="!expanded" class="el-icon-folder"></i>
    </span>
    <span data-icon="fileDir">
      <i class="el-icon-document"></i>
    </span>
    <span data-icon="time">
      <i class="el-icon-time"></i>
    </span>
    <span>
      {{ item.label }}
    </span>
    <!-- 使用 md5 标记当前已恢复的位置 el-icon-location-information -->
    <!-- 要恢复到的位置 el-icon-finished -->
    <span data-icon="time-select">
      <i class="el-icon-finished" @click="msg.$emit(`event`, `restore`)"></i>
    </span>
  </div>
</template>
<script>
import msg from './msg.js'
export default {
  name: `com-item`,
  props: [`expanded`, `item`, `theme`],
  data() {
    return { msg }
  },
  async created() {},
  components: {},
  mounted() {},
  computed: {},
  methods: {
    mouseover({ expanded, item, ev }) {
      ev.target.setAttribute(`data-cur`, `true`)
    },
    mouseleave({ expanded, item, ev }) {
      ev.target.removeAttribute(`data-cur`)
    },
  },
}
</script>
<style lang="less" scoped></style>
