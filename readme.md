

vscode 本地历史存储位置: https://stackoverflow.com/a/72610691
  - win -- C:\Users\Mark\AppData\Roaming\Code\User\History
  - win -- C:\Users\Mark\AppData\Roaming\Code - Insiders\User\History
  - /home/USER/.config/VSCodium/User/History/
  - C:\Users\USER\AppData\Roaming\VSCodium\User\History

- github 没有可用的工具
- google 没有可用的工具
- 从 git 恢复
- 从 vscode 的时间线恢复
- 从硬盘扫描文件恢复

## 时间线
  - 保存于 `*/User/History/*` 中
  - 每个 `*/User/History/**/entries.json` 文件分别表示一个代码文件的历史

entries.json 结构

``` json
{
  // 配置版本
  "version": 1,
  // 原来文件所在位置
  "resource": "file:///d%3A/git2/cloudcmd/.madrun.mjs",
  // 文件历史
  "entries": [
    {
      // 历史文件存储的名称
      "id": "YFRn.mjs",
      "source": "工作区编辑",
      // 修改的时间
      "timestamp": 1656583915880
    },
    {
      "id": "Vfen.mjs",
      "timestamp": 1656585664751
    },
  ]
}
```

## 参考
- 文件树
  - https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-1a/
  - https://vuejsexamples.com/tag/tree/
  - https://github.com/geekhybrid/tree-vue -- 推荐
  - https://github.com/hyounoo/v-treeview
  - https://github.com/jledentu/vue-finder
- diff -- 对比当前时间与磁盘文件的差异
  - https://github.com/rtfpessoa/diff2html
  - https://github.com/danday74/git-diff