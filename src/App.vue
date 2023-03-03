<template>
  <div class="test">
    <fileTree :fileData="fileData" />
  </div>
</template>
<script>
import fileTree from '@/components/fileTree/fileTree.vue'

export default {
  name: `Test`,
  data() {
    return {
      fileData: [],
    }
  },
  async created() {
    const httpData = await this.$http.get(`/api/fileData`)
    this.fileData = httpData
  },
  components: {
    fileTree,
  },
  mounted() {},
  computed: {},
  methods: {},
}
</script>
<style lang="less" scoped>
.test {
}
</style>
