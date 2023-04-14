<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">Registration Form</h3>
    </div>
    <el-form ref="form" :model="form" label-width="200px" label-position="top">

      <template v-for="item in formJosn">
        <template v-if="item.type == 'input'">
          <el-form-item :label="item.label" :key="item.key">
            <el-input v-model="form[item.key]" :placeholder="item.placeholder"></el-input>
          </el-form-item>
        </template>
        <template v-if="item.type == 'select-date'">
          <el-form-item :label="item.label" :key="item.key">
            <el-date-picker
              v-model="form[item.key]"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              >
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-if="item.type == 'radio'">
          <el-form-item :label="item.label" :key="item.key">
            <el-radio-group v-model="form[item.key]">
              <el-radio v-for="citem in item.optionItems" :label="citem.label"></el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-if="item.type == 'text'">
          <el-form-item label="" :key="item.key">
            <p style="font-size:12px;margin-top: 0px;">{{ item.label }}</p>
          </el-form-item>
        </template>
        <template v-if="item.type == 'title'">
          <el-form-item label="" :key="item.key">
            <p style="font-size:16px;margin-bottom: 0px;">{{ item.label }}</p>
          </el-form-item>
        </template>

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
        { label: 'Name (Chinese) 姓名 (中文)', type: 'input', placeholder: 'Name (Chinese) 姓名 (中文)', key: 'name' },
        { label: '(English)(英文)', type: 'input', placeholder: '(English)(英文)', key: 'en_name' },
        { label: 'Surname 姓', type: 'input', placeholder: 'Surname 姓', key: 'en_name' },
        { label: 'Given Names 名', type: 'input', placeholder: 'Given Names 名', key: 'en_name' },
        { label: '(As shown on HKID Card or Passport 按香港身份證或護照所示)', type: 'text', placeholder: 'hongkong-id', key: 'en_name' },
        { label: 'Date of Birth 出生日期', type: 'select-date', placeholder: 'Date of Birth 出生日期', key: 'en_name' },
        { label: 'Age年齡', type: 'input', placeholder: 'Age年齡', key: 'en_name' },
        { label: 'Sex性别', type: 'input', placeholder: 'Sex性别', key: 'en_name' },
        { label: 'HKID/Passport No.香港身份證/護照號碼', type: 'input', placeholder: 'HKID/Passport No.香港身份證/護照號碼', key: 'en_name' },
        { label: 'Tel. No.(Day)電話(日)', type: 'input', placeholder: 'Tel. No.(Day)電話(日)', key: 'en_name' },
        { label: 'Mobile手提電話', type: 'input', placeholder: '（必須填寫）', key: 'en_name' },
        { label: 'Nationality國籍', type: 'input', placeholder: 'Nationality國籍', key: 'en_name' },
        { label: 'Email Address電郵地址', type: 'input', placeholder: 'Email Address電郵地址', key: 'en_name' },
        { label: 'Mailing Address通訊地址', type: 'input', placeholder: 'Mailing Address通訊地址', key: 'en_name' },
        { label: 'Present Employer 現職公司/僱主名稱', type: 'input', placeholder: 'Present Employer 現職公司/僱主名稱', key: 'en_name' },
        { label: 'Position 職位', type: 'input', placeholder: 'Position 職位', key: 'en_name' },
        { label: 'Academic Qualifications 教育程度 :', type: 'radio', optionItems: [
                    { label: "Primary/Secondary 小學/中學", value: "Primary/Secondary 小學/中學" }, 
                    { label: "Technical Institute 工業學院", value: "Technical Institute 工業學院" },
                    { label: "College/University 專上學院/大學", value: "College/University 專上學院/大學"},
                    { label: "Others", value: "Others"} ],
                    key: 'Qualifications'
                  },
        { label: 'Professional Qualifications 專業資格 :', type: 'input', placeholder: 'Professional Qualifications 專業資格', key: 'en_name' },
        { label: 'Payment method 付款方式 :', type: 'radio', optionItems: [
                    { label: "Cash 現金", value: "Cash 現金" }, 
                    { label: "Octopus 八達通", value: "Octopus 八達通" },
                    { label: "FPS 轉數快", value: "FPS 轉數快"},
                    { label: "PayMe 香港汇丰", value: "PayMe 香港汇丰"} ],
                    key: 'Payment'
                  },
      ],
      form: {
        name: ""
      },
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
.login-container{
  padding: 10px;
}
.el-form-item__label{
  padding: 0 !important;
}
.el-form-item{
  margin-bottom: 5px;
}

</style>
