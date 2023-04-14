<template>
  <div v-if="is_login">
    <div class="login-container">
      <div class="banner_img" style="display: flex;justify-content: center">
      </div>

      <el-form ref="form" :model="form" :rules="Rules" label-width="200px" label-position="top">

        <template v-for="item in formJosn2">
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

        <el-form-item class="idcard_img">
          <el-upload :file-list="fileList" :data="dataObj" :multiple="true" :before-upload="beforeUpload"
            :on-error="uploadError" accept="image/jpeg, image/jpg, image/png" action="http://up-z2.qiniup.com"
            :on-success="handleSuccess" drag>
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              拍照或相册: <em>身份证证面</em>
            </div>
          </el-upload>

          <el-upload class="avatar-uploader" :data="dataObj" action="http://up-z2.qiniup.com" :show-file-list="false"
            :on-success="handleSuccess" :on-error="uploadError" :before-upload="beforeUpload">
            <img v-if="form.filePath" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <div class="submit" style="display:flex">
            <el-button type="primary" :disabled="is_submit_ing" @click="submit()">{{ submit_state }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div v-else>
    <div class="login-container">
      <div class="banner_img" style="display: flex;justify-content: center">
        <el-image style="height: 100px;margin-top: 15%;" src="https://hongkongidcard.wenfree.cn/anqi/banner.png"
          fit="contain"></el-image>
      </div>

      <el-form ref="form" :model="form" :rules="Rules" label-width="200px" label-position="top">

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
          <el-input class="code_input" v-model="code" placeholder="验证码"></el-input>
          <el-image style="margin-left: 20px;" :src="code_img" fit="contain" @click="getCodeImgByYesApi"></el-image>
        </el-form-item>


        <el-form-item>
          <div class="submit" style="display:flex">
            <el-button type="primary" :disabled="is_submit_ing" @click="submit()">{{ submit_state }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>

import { checkInfo, getCodeImg } from '@/api/jdApi'
import { getToken } from '@/api/qiniu'

export default {

  name: 'Registration',
  components: {

  },
  data() {
    return {
      code_Verify: '',
      code_info: [],
      code_img: '',
      code: '',
      is_login: true,
      formJosn: [
        { label: '禁毒身份码', type: 'title', placeholder: '', key: 'dis' },
        { label: '姓名', type: 'input', placeholder: '请输入姓名', key: 'Name' },
        { label: '手机号', type: 'input', placeholder: '请输入手机号', key: 'phone' },
        { label: '身份证号', type: 'input', placeholder: '请输入身份证号', key: 'IdNum' },
      ],
      formJosn2: [
        { label: '禁毒身份码', type: 'title', placeholder: '', key: 'dis' },
        { label: '', type: 'input', placeholder: '请输入姓名', key: 'Name' },
        { label: '', type: 'input', placeholder: '请输入手机号', key: 'phone' },
        { label: '', type: 'input', placeholder: '请输入身份证号', key: 'IdNum' },
      ],
      form: {

      },
      Rules: {
        Name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在2到4个字符', trigger: 'blur' }
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
    this.getCodeImgByYesApi()
  },
  mounted() {
    // this.getCodeImgByYesApi()
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

      console.log('准备展示', this.code, 'code_Verify', this.code_Verify, this.form)
      if (this.code != this.code_Verify) {
        this.$alert('验证码错误', '提示', {
          confirmButtonText: '确定',
        })
        return
      }

      checkInfo(this.form).then(response => {
        console.log(response)

        this.is_login = true
      }).catch(err => {
        console.log(err)

      })

      this.is_submit_ing = true
      this.submit_state = '正在提交'

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

          _self._data.dataObj.key = `jdIdcard/anqi_pic_${new Date().getTime()}_${file.name}`

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
      let sefl = this
      console.log('准备生成验证码')
      getCodeImg({}).then(response => {
        console.log('验证码', response)
        sefl.code_info = response
        sefl.code_img = response.data.img_url
        sefl.code_Verify = response.data.code
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

.code_input {
  width: 58%;
}

.code .el-form-item__content {
  display: flex;
}

.code img {
  border-radius: 4px;
}

.el-upload-dragger {
  opacity: 1;
  // background: #373737d6;
  width: 100% !important;
}

.idcard_img .el-upload {
  width: 100%;
}

.el-upload-dragger .el-upload__text {
  color: #fff;
}

.idcard_img .el-upload {
  // background: url('https://hongkongidcard.wenfree.cn/idcard.png') no-repeat !important;
  background-size: 100% 100% !important;
  // filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='https://hongkongidcard.wenfree.cn/idcard.png', sizingMethod='scale');
  opacity: 0.8;
  // border: 1px #000 solid;
  // border-radius: 10px;
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
