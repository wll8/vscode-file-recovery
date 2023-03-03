import Vue from 'vue'
import http from '@/http/index.js'
import util from '@/util/index.js'
import App from '@/App.vue'
import {
  Form,
  FormItem,
  Select,
  Option,
  Input,
  Button,
  Drawer,
  Dialog,
  Radio,
  Cascader,
  Upload,
  Link,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$util = util
Vue.config.productionTip = false
Vue.use(http)

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Button)
Vue.use(Drawer)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(Cascader)
Vue.use(Upload)
Vue.use(Link)

window.$this = new Vue({
  render: (h) => h(App),
}).$mount(`#app`)
