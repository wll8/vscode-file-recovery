export default {
  dev: {
    baseApi: `http://localhost:8079`,
  },
  prod: {
    baseApi: `/`,
  },
  test: {
    baseApi: `http://localhost:8079`,
  },
}[process.env.VUE_APP_ENV]
