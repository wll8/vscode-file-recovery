const globby = require('globby')

const util = require(`./util.js`)
// 每个 entries.json 保存着 1 个文件的编辑记录
const gitRoot = `C:/Users/win/AppData/Roaming/Code/User/History/**/entries.json`
const path = require(`path`)
const fs = require(`fs`)
const toDir = `D:/re-store`
fs.existsSync(toDir) === false && fs.mkdirSync(toDir, {recursive: true})

const globbyList = globby.sync([
  gitRoot,
], {})
// .slice(0, 100)

let fileList = globbyList.map(file => {
  const data = require(file)
  const dir = path.parse(file).dir
  // entries.json 地址
  data.from = file
  data.fromDir = dir
  // 原文件地址
  data.resource = decodeURIComponent(data.resource).replace(/.*?\/\/\/(.*$)/, `$1`)
  // 原文件存储目录
  data.resourceDir = path.parse(data.resource).dir
  // 恢复后的完整地址
  data.rresource = `${toDir}/${data.resource.replace(/:\//g, `/`)}`
  // 恢复后的目录
  data.rresourceDir = `${toDir}/${path.parse(data.resource).dir.replace(/:\//g, `/`)}`
  const newItem = [...data.entries].pop()
  // 创建文件所在目录
  fs.mkdirSync(data.rresourceDir, {recursive: true})
  const binary = fs.readFileSync(`${dir}/${newItem.id}`, {encoding: `binary`})
  fs.writeFileSync(data.rresource, binary, {encoding: `binary`})

  // data.entries = data.entries.map(item => {
  //   item.path = `${dir}/${item.id}`
  //   item.date = util.dateFormat(`YYYY-MM-DD hh:mm:ss`, new Date(item.timestamp))
  //   return item
  // })
  return data
})

fileList = pathToTree(fileList, {key: `resource`})


fs.writeFileSync(`fileList.json`, JSON.stringify(fileList, null, 2))
console.log(`globbyList`, fileList)


function pathToTree(paths, {key = `path`}) {

  const tree = [];
  
  paths.forEach((item) => {
    const parts = item[key].split("/").filter((part) => part !== "");
    let currentNode = tree;
  
    parts.forEach((part, index) => {
      let existingNode = currentNode.find((node) => node.label === part);
      if (!existingNode) {
        existingNode = { label: part, children: [] };
        currentNode.push(existingNode);
      }
      
      const nodeId = parts.slice(0, index + 1).join('/')
      
      // 标记为目录或文件
      if (index === parts.length - 1) {
        existingNode.type = `fileDir`;
        existingNode.fromDir = item.fromDir;
        existingNode.resource = item.resource;
        existingNode.resourceDir = item.resourceDir;
        existingNode.rresource = item.rresource;
        existingNode.rresourceDir = item.rresourceDir;
        existingNode.children = item.entries.map(entries => {
          return {
            id: `${item.fromDir}/${entries.id}`,
            type: `time`,
            label: util.dateFormat(`YYYY-MM-DD hh:mm:ss`, new Date(entries.timestamp)),
            timestamp: entries.timestamp,
          }
        }).sort((item) => -item.timestamp)
      } else {
        existingNode.type = `dir`;
      }
      existingNode.id = nodeId;
      
      currentNode = existingNode.children;
    });
  });
  
  // console.log(tree);
  return tree
}