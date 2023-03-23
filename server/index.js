const path = require(`path`)
const fs = require(`fs`)
const express = require(`express`)
const os = require(`os`)
const util = require(`./util.js`)
const normalize = require(`normalize-path`)

const server = express()
server.use(express.json()) // for parsing application/json
server.get(`/api/fileData`, (req, res) => {
  let { historyPath, toDir } = req.body
  // @see https://stackoverflow.com/a/72610691
  const homeDir = os.userInfo().homedir
  const pathList = [
    historyPath,
    `${homeDir}/AppData/Roaming/Code/User/History/`,
    `${homeDir}/AppData/Roaming/Code - Insiders/User/History/`,
    `${homeDir}/AppData/Roaming/VSCodium/User/History`,
    `${homeDir}/.config/VSCodium/User/History/`,
  ]
  historyPath = (() => {
    return pathList.find((path) => path && fs.existsSync(path))
  })()
  toDir = toDir || normalize(`${process.cwd()}/re-store/`)
  if (historyPath) {
    const fileList = util.scan({
      historyPath: normalize(historyPath),
      toDir,
    })
    res.json({
      historyPath: normalize(historyPath),
      toDir,
      list: fileList,
    })
  } else {
    res.json({ msg: `Wrong historyPath`, data: pathList })
  }
})
server.post(`/api/getTime`, (req, res) => {
  const { cache } = req.body
  // todo 应处理编码格式
  res.json({ text: require(`fs`).readFileSync(cache, `utf8`) })
})
server.use(express.static(path.join(__dirname, `../dist`)))

// 监听端口
const port = `8081`
server.listen(port, `0.0.0.0`, () => console.log(`service started: ${port}`))
