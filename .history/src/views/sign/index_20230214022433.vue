<template>
  <div class="login-container">
    <el-image style="height: 100px;" src="https://img.wenfree.cn/images/b.wenfree.cn/banner.png"
      fit="contain"></el-image>


    <div class="title-container">
      <h3 class="title">Registration Form</h3>
    </div>

    <el-form ref="form" :model="form" :rules="loginRules" label-width="200px" label-position="top">

      <template v-for="item in formJosn">
        <template v-if="item.type == 'input'">
          <el-form-item :label="item.label" :key="item.key">
            <el-input v-model="form[item.key]" :placeholder="item.placeholder"></el-input>
          </el-form-item>
        </template>
        <template v-if="item.type == 'input-text'">
          <el-form-item :label="item.label" :key="item.key">
            <el-input v-model="form[item.key]" type="textarea" :rows="4" :placeholder="item.placeholder">
            </el-input>
          </el-form-item>
        </template>
        <template v-if="item.type == 'select-date'">
          <el-form-item :label="item.label" :key="item.key">
            <el-date-picker v-model="form[item.key]" type="date" placeholder="選擇日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-if="item.type == 'radio'">
          <el-form-item :label="item.label" :key="item.key" :class="item.class ? item.class : ''">
            <el-radio-group v-model="form[item.key]">
              <el-radio v-for="citem in item.optionItems" :label="citem.label"></el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-if="item.type == 'text'">
          <el-form-item label="" :key="item.key">
            <p style="font-size:12px;margin-top: 0px;line-height: 14px;">{{ item.label }}</p>
          </el-form-item>
        </template>
        <template v-if="item.type == 'title'">
          <el-form-item label="" :key="item.key">
            <p style="font-size:16px;margin-bottom: 0px;">{{ item.label }}</p>
          </el-form-item>
        </template>

      </template>

      <XhyAutograph :config="options" @receive="receiveQmValue"></XhyAutograph>

      <el-form-item label="Date">
        <el-date-picker v-model="form['date']" type="date" placeholder="選擇日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <div class="submit" style="display:flex">
          <el-button type="primary" @click="submit()">提交報名</el-button>
        </div>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
import XhyAutograph from "./components/autograph"
import { SaveImg, SaveInfo } from '@/api/upload'

export default {

  name: 'Registration',
  components: {
    XhyAutograph
  },
  data() {
    return {
      formJosn: [
        { label: 'Class Arrangement', type: 'title', placeholder: '', key: 'Arrangement' },
        { label: '課程安排 (Please mark  in the appropriate box 請在適當方格)', type: 'text', placeholder: '', key: 'appropriate' },

        {
          label: 'Courses報讀課程：', type: 'radio', class: 'courses', optionItems: [
            {
              label: 'Mandatory Basic Safety Training Course (Construction Work) (Course Fee HK$193) 1 day course (09:30 - 18:00)強制性基本安全訓練課程(建築工程) (學費 HK$193) 一天課程(09: 30 - 18: 00)', value: "Course Fee HK$193"
            },
            { label: "Mandatory Basic Safety Training Revalidation Course (Construction Work) (Course Fee HK$170) Half day course (18:30 - 22:00)", value: "Course Fee HK$170" },
          ], placeholder: 'courses', key: 'courses'
        },

        { label: 'Name (Chinese) 姓名 (中文)', type: 'input', placeholder: 'Name (Chinese) 姓名 (中文)', key: 'names' },
        // { label: '(English)(英文)', type: 'input', placeholder: '(English)(英文)', key: 'en_name' },
        { label: 'Surname (English) 姓 (英文)', type: 'input', placeholder: 'Surname (English) 姓 (英文)', key: 'hongkong_firstName' },
        { label: 'Given Names (English) 名 (英文)', type: 'input', placeholder: 'Given Names (English) 名 (英文)', key: 'hongkong_lastName' },
        { label: '(As shown on HKID Card or Passport 按香港身份證或護照所示)', type: 'text', placeholder: 'As shown on HKID Card or Passport', key: 'hongkong' },
        { label: 'Date of Birth 出生日期', type: 'select-date', placeholder: 'Date of Birth 出生日期', key: 'birthday' },
        { label: 'Age年齡', type: 'input', placeholder: 'Age年齡', key: 'age' },
        {
          label: 'Sex性別', type: 'radio', optionItems: [
            { label: "男", value: "男" },
            { label: "女", value: "女" },
            { label: "其它", value: "其它" },
          ], placeholder: 'Sex性別', key: 'sex'
        },
        { label: 'HKID/Passport No.香港身份證/護照號碼', type: 'input', placeholder: 'HKID/Passport No.香港身份證/護照號碼', key: 'idcard' },
        { label: 'Tel. No.(Day)電話(日)', type: 'input', placeholder: 'Tel. No.(Day)電話(日)', key: 'phone' },
        { label: 'Mobile手提電話', type: 'input', placeholder: '（必須填寫）', key: 'mobile' },
        { label: 'Nationality國籍', type: 'input', placeholder: 'Nationality國籍', key: 'nationality' },
        { label: 'Email Address電郵地址', type: 'input', placeholder: 'Email Address電郵地址', key: 'email' },
        { label: 'Mailing Address通訊地址', type: 'input', placeholder: 'Mailing Address通訊地址', key: 'address' },
        { label: 'Present Employer 現職公司/僱主名稱', type: 'input', placeholder: 'Present Employer 現職公司/僱主名稱', key: 'employer' },
        { label: 'Position 職位', type: 'input', placeholder: 'Position 職位', key: 'position' },
        {
          label: 'Academic Qualifications 教育程度 :', type: 'radio', optionItems: [
            { label: "Primary/Secondary 小學/中學", value: "Primary/Secondary 小學/中學" },
            { label: "Technical Institute 工業學院", value: "Technical Institute 工業學院" },
            { label: "College/University 專上學院/大學", value: "College/University 專上學院/大學" },
            { label: "Others", value: "Others" }],
          key: 'qualifications'
        },
        { label: 'Professional Qualifications 專業資格 :', type: 'input-text', placeholder: 'Professional Qualifications 專業資格', key: 'professional' },
        {
          label: 'Payment method 付款方式 :', type: 'radio', optionItems: [
            { label: "Cash 現金", value: "Cash 現金" },
            { label: "Octopus 八達通", value: "Octopus 八達通" },
            { label: "FPS 轉數快", value: "FPS 轉數快" },
            { label: "PayMe 香港匯豐", value: "PayMe 香港匯豐" }],
          key: 'payment'
        },
        { label: ' Declaration 聲明', type: 'title', placeholder: 'Declaration 聲明', key: 'Declaration' },
        { label: ' I declare that all information given in this application form is, to the best of my knowledge, accurate and complete. If any false information is given, the application is deemed to be invalid and I shall forfeit my right to apply for this course. I consent that if registered, I will conform to the regulations of Mlife Human Resources Development Centre.  本人聲明本報名錶內所載一切資料，依本人所知均屬真確，並無遺漏，並知道倘若虛報資料，申請即屬無效，且喪失其後報讀本課程的資格。本人同意如本人註冊入學，當遵守德鑄人力資源發展中心之學生守則。', type: 'text', placeholder: 'Declaration 聲明', key: 'Declaration-text' },
      ],
      form: {
        names: null,
        en_name: null,
        hongkong_firstName: null,
        hongkong_lastName: null,
        birthday: null,
        age: null,
        sex: null,
        idcard: null,
        phone: null,
        mobile: null,
        nationality: null,
        email: null,
        address: null,
        employer: null,
        position: null,
        professional: null,
        qualifications: null,
        payment: null,
        signature: null
      },
      loginRules: {
        names: [
          { required: true, message: '請輸入姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '長度在 3 到 5 個字符', trigger: 'blur' }
        ],
      },
      options: {
        penColor: 'black', //筆刷顔色
        minWidth: 2 //最小寬度
      },
      qmValue: '',
      save_key: false
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
    },
    receiveQmValue(val) {
      let that = this
      this.qmValue = val
      console.log(this.qmValue)
      if (!this.form.idcard) {
        this.$alert('請輸入身份證號', '提示', {
          confirmButtonText: '確定',
          // callback: action => {
          //   this.$message({
          //     type: 'info',
          //     message: `action: ${action}`
          //   })
          // }
        })
        return
      }

      const postData = {
        idcard: this.form.idcard,
        base64: this.qmValue
      }

      SaveImg(postData).then(response => {
        console.log('url', response.data)
        that.form.signature = response.data
      })
    },
    submit() {
      let that = this

      console.log('提交報名', this.form)

      if (!this.form.signature) {
        this.$alert('請確認簽名', '提示', {
          confirmButtonText: '確定',
          // callback: action => {
          //   this.$message({
          //     type: 'info',
          //     message: `action: ${action}`
          //   })
          // }
        })
        return
      }

      SaveInfo(this.form).then(response => {
        console.log('保存數據', response.data)

        let data = response.data
        if (data.code == 200) {
          that.save_key = true
          this.$alert('報名成功', '提示', {
            confirmButtonText: '確定',
            // callback: action => {
            //   this.$message({
            //     type: 'info',
            //     message: `action: ${action}`
            //   })
            // }
          })
        }
        // if (  ) { }
      })

    }
  }
}
</script>

<style lang="scss">
/* 修複input 背景不協調 和光標變色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.login-container {
  padding: 10px;
}

.el-form-item__label {
  padding: 0 !important;
}

.el-form-item {
  margin-bottom: 5px;
}

.submit {
  display: flex;
  margin-top: 15px;
  margin-bottom: 15px;

  button {
    width: 100%;
  }
}

.tables {
  border-bottom: 1px dashed rgb(63, 59, 59);
}


.courses .el-radio-group {
  width: 90%;
}
</style>
