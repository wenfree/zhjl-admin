<template>
  <div class="login-container">
    <div class="banner_img" style="display: flex;justify-content: center">
      <el-image style="height: 100px;" src="https://hongkongidcard.wenfree.cn/anqi/banner.png" fit="contain"></el-image>
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
            <el-date-picker v-model="form[item.key]" type="date" placeholder="選擇生日" value-format="yyyy年 MM月 dd日"
              @change="birthday_age">
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-if="item.type == 'radio'">
          <el-form-item :label="item.label" :key="item.key" :class="item.class ? item.class : ''">
            <el-radio-group v-model="form[item.key]">
              <el-radio v-for="citem in item.optionItems" :label="citem.value" :key="citem.value">{{
                citem.label
              }}</el-radio>
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
        <template v-if="item.type == 'idcard'">
          <el-form-item :label="item.label" :key="item.key" :class="item.class ? item.class : 'noidcard'">
            <el-input v-model="form[item.key]" :placeholder="item.placeholder"></el-input> - ( <el-input
              v-model="form['idm']"></el-input> )
          </el-form-item>
        </template>

      </template>

      <XhyAutograph :config="options" @receive="receiveQmValue"></XhyAutograph>

      <el-form-item label="Date">
        <el-date-picker v-model="form['date']" type="date" placeholder="選擇日期" value-format="yyyy年 MM月 dd日">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="">
        <el-checkbox v-model="agree">I already read Personal Data Collection Statement
          <p>我已閱讀收集個人資料聲明</p>
          <el-button type="" @click="dialogVisible = true">
            查看詳細內容
          </el-button>
        </el-checkbox>
      </el-form-item>

      <el-form-item class="idcard_img">
        <el-upload :file-list="fileList" :data="dataObj" :multiple="true" :before-upload="beforeUpload"
          :on-error="uploadError" accept="image/jpeg, image/jpg, image/png" action="http://up-z2.qiniup.com"
          :on-success="handleSuccess" drag>
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            <em>拍照或者選擇相冊</em>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="">
        <el-checkbox v-model="form['msg']">I do not wish to receive any information from the MLife Human
          Resources
          Development
          Centre in relation to its activities
          or developments in the construction industry.
          <p>本人不同意日後接收由德鑄人力資源發展中心發出有關議會或學院活動和與建造業相關的資訊.</p>
        </el-checkbox>
      </el-form-item>

      <el-form-item label="">
        <el-checkbox v-model="form['self']">報名表是否通過電郵發給自己</el-checkbox>
      </el-form-item>

      <el-form-item>
        <div class="submit" style="display:flex">
          <el-button type="primary" :disabled="is_submit_ing" @click="submit()">{{ submit_state }}</el-button>
        </div>
      </el-form-item>

    </el-form>


  </div>
</template>

<script>
import XhyAutograph from "./components/autograph"
import { SaveImg, SaveInfo } from '@/api/upload'
import { getToken } from '@/api/qiniu'

export default {

  name: 'Registration',
  components: {
    XhyAutograph
  },
  data() {
    return {
      formJosn: [
        { label: 'Class Arrangement', type: 'title', placeholder: '', key: 'Arrangement' },

        { label: 'Name (Chinese) 姓名 (中文)', type: 'input', placeholder: 'Name (Chinese) 姓名 (中文)', key: 'names' },

      ],
      form: {

      },
      Rules: {
        name: [
          { required: true, message: '請輸入姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '長度在 3 到 5 個字符', trigger: 'blur' }
        ],
      },
      options: {
        penColor: 'black', //筆刷顔色
        minWidth: 2 //最小寬度
      },
      qmValue: '',
      save_key: false,
      agree: false,
      dialogVisible: false,
      dataObj: { token: '', key: '', data: {}, bucket: 'hongkongidcard' },
      image_uri: [],
      fileList: [],
      suffix: '',
      is_submit_ing: false,
      submit_state: '提交報名'
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

      if (!this.agree) {
        this.$alert('請同意收集聲明', '提示', {
          confirmButtonText: '確定',
        })
        return
      }


      if (!this.form.courses) {
        this.$alert('請選擇課程', '提示', {
          confirmButtonText: '確定',
        })
        return
      }

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

      this.is_submit_ing = true
      this.submit_state = '正在提交'

      SaveInfo(this.form).then(response => {
        console.log('保存數據', response)

        let data = response
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
          this.is_submit_ing = false
          this.submit_state = '提交成功'
        }
        // if (  ) { }
      })
    },
    beforeUpload(file) {
      console.log(file.name, file)
      console.log(this.fileList)

      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          const key = response.data.key
          const token = response.data.token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key

          _self._data.dataObj.key = `hongkongidcard/upload_pic_${new Date().getTime()}_${file.name}`

          console.log('_self', _self.dataObj)
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    handleSuccess(val) {
      console.log('成功', val)
      this.form.idcard_img = 'https://hongkongidcard.wenfree.cn/' + val.key
      console.log(this.form.idcard_img)
    },
    uploadError(val) {
      console.log('uploadError', val)
    },
    handleRemove(val) {
      console.log('handleRemove', val)
    },
    birthday_age(val) {
      console.log('birthday', val, new Date())
      let now = (new Date().getFullYear())
      let set = val.replace(/年.*/, '')
      console.log(set)
      console.log(now)
      this.form.age = now - set
      // let nowyear = (new Date()).replace(/^\d{4}/g, '')
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


.idcard_img .el-upload {
  background: url('https://hongkongidcard.wenfree.cn/hongkongidcard.png') no-repeat !important;
  background-size: 100% 100% !important;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='https://hongkongidcard.wenfree.cn/hongkongidcard.png', sizingMethod='scale');
  opacity: 1;
  // border: 1px #000 solid;
  // border-radius: 10px;
}

.el-upload-dragger {
  opacity: 0.8;
}

@media screen and (max-width: 500px) {
  .el-message {
    min-width: 300px !important;
  }
}

@media screen and (max-width: 500px) {
  .el-message-box {
    width: 300px !important;
  }
}

@media screen and (max-width: 500px) {
  .el-dialog__wrapper .el-dialog {
    width: 90% !important;

    .el-dialog__body {
      padding: 10px 20px !important;

      .el-form-item__label {
        width: 68px !important;
      }

      .el-select,
      .el-input {
        width: 180px !important;
      }
    }
  }
}
</style>
