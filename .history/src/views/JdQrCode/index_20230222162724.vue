<template>
  <div class="login-container">
    <div class="banner_img" style="display: flex;justify-content: center">
      <el-image style="height: 100px;margin-top: 15%;" src="https://hongkongidcard.wenfree.cn/anqi/banner.png"
        fit="contain"></el-image>
    </div>


    <el-form ref="form" :model="form" :rules="loginRules" label-width="200px" label-position="top">

      <template v-for="item in formJosn">
        <template v-if="item.type == 'input'">
          <el-form-item :label="item.label" :key="item.key">
            <el-input v-model="form[item.key]" :placeholder="item.placeholder"></el-input>
          </el-form-item>
        </template>


        <template v-if="item.type == 'text'">
          <el-form-item label="" :key="item.key">
            <p style="font-size:12px;margin-top: 0px;line-height: 14px;">{{ item.label }}</p>
          </el-form-item>
        </template>
        <template v-if="item.type == 'title'">
          <el-form-item label="" :key="item.key">
            <p style="font-size:16px;margin-bottom: 0px; text-align: center;">{{ item.label }}</p>
          </el-form-item>
        </template>
      </template>

      <el-form-item label="请输入验证码" class="code">
        <el-input v-model="code" placeholder="验证码"></el-input>
        <el-image style="" :src="code_img" fit="contain"></el-image>
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
import { getCodeImg } from '@/api/jdApi'
import { getToken } from '@/api/qiniu'

export default {

  name: 'Registration',
  components: {
    XhyAutograph
  },
  data() {
    return {
      code_info: [],
      code_img: '',
      code: '',
      is_login: false,
      formJosn: [
        { label: '禁毒身份码', type: 'title', placeholder: '', key: 'dis' },
        { label: '姓名', type: 'input', placeholder: '请输入姓名', key: 'Name' },
        { label: '手机号', type: 'input', placeholder: '请输入手机号', key: 'phone' },
        { label: '身份证号', type: 'input', placeholder: '请输入身份证号', key: 'IdNum' },
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
      submit_state: '完善信息'
    }
  },

  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.getCodeImgByYesApi()
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
    submit() {
      let that = this

      console.log('提交報名', this.form)

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
    getCodeImgByYesApi() {
      getCodeImg().then(response => {
        console.log(response)
      }).catch(err => {
        console.log(err)
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
