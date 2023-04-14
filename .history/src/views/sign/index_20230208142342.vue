<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">Registration Form</h3>
    </div>
    <el-form ref="form" :model="form" label-width="200px" label-position="top">
      <template v-for="item in formJson">
        {{ item.key }}
        <el-form-item :label="item.label" :key="item.key">
          <el-input v-model="form[item.key]" :placeholder="item.placeholder"></el-input>
        </el-form-item>
      </template>
    </el-form>

  </div>
</template>

<script>

export default {
  name: 'Registration',

  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      formJosn: [
        { label: 'Name (Chinese) 姓名 (中文)', type: 'input', placeholder: 'Name (Chinese) 姓名 (中文)', key: 'name' }
      ],
      form: {},
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },

  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }


  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

</style>
