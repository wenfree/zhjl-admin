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
          <el-upload class="avatar-uploader" :data="dataObj" action="http://up-z2.qiniup.com" :show-file-list="false"
            :on-success="handleSuccess" :on-error="uploadError" :before-upload="beforeUpload">
            <div v-if="form.filePath">
              <el-image style="width: 100%; " :src="form.filePath" fit="contain" class="avatar"></el-image>
              点击图片重新上传
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon">身份证正面</i>
          </el-upload>
        </el-form-item>

        <el-form-item class="idcard_img">
          <el-upload class="pic-uploader" :data="dataObj" action="http://up-z2.qiniup.com" :show-file-list="false"
            :on-success="handleSuccessPic" :on-error="uploadError" :before-upload="beforeUploadPic">
            <div v-if="form.pic">
              <el-image style="width: 100%; " :src="form.pic" fit="contain" class="">点击图片重新上传</el-image>
              点击图片重新上传
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon">人像正面</i>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <div class="submit" style="display:flex">
            <el-button type="primary" :disabled="is_submit_ing" @click="submit()">展示二维码</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="《Personal Data Collection Statement》 《收集個人資料聲明》" :visible.sync="dialogVisible" width="95%">
      <ul>
        <li>1.The information you provide to the MLife Human Resources Development Centre (“MLife”), including
          any
          personal data as
          defined in the Personal Data (Privacy) Ordinance (the Ordinance), will be used solely for purposes
          related to
          the
          activities of the MLife.
          <br>你嚮德鑄人力資源發展中心〔「德鑄」〕所提供的資料，包括《個人資料〔私隱〕條例》所指的個人資料，隻會用於相關德鑄之活動。
        </li>
        <li>2.MLife will disclose the personal data you have provided to Labour Department for the following
          purposes:
          <br>德鑄會將你提供的個人資料嚮勞工處透露，用作以下用途：
          <ul>
            <li>a.activities relating to the administration of the Occupational Safety and Health Ordinance
              and
              Factories and
              Industrial
              Undertakings Ordinance and their subsidiary regulations;
              <br>有關執行職業安全及健康條例、工廠及工業經營條例及其附例；
            </li>
            <li>b.communication regarding the course you attended; and
              <br>方便勞工處與你聯絡有關其出席的課程事宜；及
            </li>
            <li>c.carrying on relevant research and compilation of statistical data.
              <br>將有關資料用作研究及統計分析。
            </li>
          </ul>
        </li>
        <li>3.To keep you informed of MLife activities and industry developments which may be of interest, the
          MLife
          would like to
          use your personal data, including your name, phone number and correspondence and email addresses, to
          update
          you in
          relation to training courses, trade testing, registration, events and other aspects of its work and
          the
          construction
          industry.
          <br>為讓你得知最新的德鑄活動和行業內發展情況，德鑄將使用你的個人資料，包括你的姓名、電話號碼、郵寄和電郵地址，將有關訓練課程、測試、註冊、活動項目、議會或中心工作和建造業其他方麵的最新資訊提供給你。
        </li>
        <li>4.The MLife will not transfer your personal data to any third parties without your prior consent.
          <br>在未得你的事先同意前，德鑄不會將你的個人資料轉移給任何第三方。
        </li>
        <li>5.It is obligatory for you to supply the MLife with complete information. The MLife may be unable to
          process
          and/or
          consider your application if you do not provide complete information. You are free to decide whether
          you wish
          to receive
          such information. If you choose not to do so, please put a “”in the box below.
          <br>你必須嚮德鑄提供完整的資料。如你未能提供完整的資料，德鑄或無法處理及/或考慮你的申請。你可選擇是否同意接收上述資訊。若不同意的話，請於下列有關拒收資訊一欄之空格內加上「」號。
        </li>
        <li>6.You are also entitled to request access to and correction of any errors in your personal data. If
          you wish
          to do so
          please write to the MLife at Flat A, 16/F, Wing Hong Centre, 18 Wing Hong Street, Cheung Sha Wan,
          KLN, Hong
          Kong.
          <br>你有權要求查閱及修正你的個人資料。有關申請須以書麵嚮德鑄提出，地址為香港長沙灣永康街18號永康中心 16樓A室。
        </li>
      </ul>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">確 定</el-button>
      </span>
    </el-dialog>

  </div>



  <!-- 未登录之前 -->
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
      id: '',
      code_Verify: '',
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
      formJosn2: [
        { label: '禁毒身份码', type: 'title', placeholder: '', key: 'dis' },
        { label: '', type: 'input', placeholder: '请输入姓名', key: 'Name' },
        { label: '', type: 'input', placeholder: '请输入手机号', key: 'phone' },
        { label: '', type: 'input', placeholder: '请输入身份证号', key: 'IdNum' },
      ],
      form: {
        Name: '文虹',
        phone: '18128823268',
        IdNum: '423400198611253257',
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
  watch: {
    'form.filePath'() {
      console.log('filePath', this.form.filePath)
    },
    deep: true
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
        this.id = response.data.id
        this.form = response.data
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

          _self._data.dataObj.key = `jdIdcard/filePath/anqi_${_self.form.IdNum}_${file.name}`

          console.log('_self', _self.dataObj)
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    beforeUploadPic(file) {
      console.log(file.name, file)
      console.log(this.fileList)

      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          const key = response.data.key
          const token = response.data.token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key

          _self._data.dataObj.key = `jdIdcard/Pic/anqi_${_self.form.IdNum}_${file.name}`

          console.log('_self', _self.dataObj)
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    handleSuccess(val) {
      let self = this
      console.log('成功', val)
      let filePath = 'https://hongkongidcard.wenfree.cn/' + val.key
      self.form.filePath = filePath
      console.log('this.form.filePath', self.form.filePath)
      // Just to simulate the time of the request
      setTimeout(() => {
        console.log('更新')
        this.submit()
        this.$forceUpdate()
      }, 0.2 * 1000)
    },
    handleSuccessPic(val) {
      let self = this
      console.log('成功', val)
      let pic = 'https://hongkongidcard.wenfree.cn/' + val.key
      self.form.pic = pic
      console.log('this.form.filePath', self.form.pic)
      // Just to simulate the time of the request
      setTimeout(() => {
        console.log('更新')
        this.submit()
        this.$forceUpdate()
      }, 0.2 * 1000)
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
  width: 56%;
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

.pic-uploader .el-upload,
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
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
