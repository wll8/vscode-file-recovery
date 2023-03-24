const globby = require(`globby`)
const path = require(`path`)
const fs = require(`fs`)

/**
 * 路径列表转树
 * @param {*} paths
 * @param {*} param1
 * @returns
 */
function pathToTree(paths, { key = `path` }) {
  const tree = []

  paths.forEach((item) => {
    const parts = item[key].split(`/`).filter((part) => part !== ``)
    let currentNode = tree

    parts.forEach((part, index) => {
      let existingNode = currentNode.find((node) => node.label === part)
      if (!existingNode) {
        existingNode = { label: part, children: [] }
        currentNode.push(existingNode)
      }

      const nodeId = parts.slice(0, index + 1).join(`/`)

      // 标记为目录或文件
      if (index === parts.length - 1) {
        existingNode.type = `fileDir`
        existingNode.fromDir = item.fromDir
        existingNode.resource = item.resource
        existingNode.resourceDir = item.resourceDir
        existingNode.rresource = item.rresource
        existingNode.rresourceDir = item.rresourceDir
        existingNode.children = item.entries
          .map((entries) => {
            return {
              id: `${item.fromDir}/${entries.id}`,
              type: `time`,
              label: entries.timestamp,
            }
          })
          .sort((item) => -item.label)
      } else {
        existingNode.type = `dir`
      }
      existingNode.id = nodeId

      currentNode = existingNode.children
    })
  })

  // console.log(tree);
  return tree
}

function scan({ historyPath, toDir } = {}) {
  const gitRoot = `${historyPath}/**/entries.json`

  fs.existsSync(toDir) === false && fs.mkdirSync(toDir, { recursive: true })
  const globbyList = globby.sync([gitRoot], {})

  let fileList = globbyList.map((file) => {
    const data = require(file)
    const dir = path.parse(file).dir
    // entries.json 地址
    data.from = file
    data.fromDir = dir
    // 原文件地址
    data.resource = decodeURIComponent(data.resource).replace(
      /.*?\/\/\/(.*$)/,
      `$1`
    )
    // 原文件存储目录
    data.resourceDir = path.parse(data.resource).dir
    // 恢复后的完整地址
    data.rresource = `${toDir}/${data.resource.replace(/:\//g, `/`)}`
    // 恢复后的目录
    data.rresourceDir = `${toDir}/${path
      .parse(data.resource)
      .dir.replace(/:\//g, `/`)}`
    const newItem = [...data.entries].pop()
    // 创建文件所在目录
    fs.mkdirSync(data.rresourceDir, { recursive: true })
    const binary = fs.readFileSync(`${dir}/${newItem.id}`, {
      encoding: `binary`,
    })
    fs.writeFileSync(data.rresource, binary, { encoding: `binary` })
    return data
  })

  const tree = pathToTree(fileList, { key: `resource` })
  return tree
}

module.exports = {
  scan,
}
