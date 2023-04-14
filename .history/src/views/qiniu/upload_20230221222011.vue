<template>
  <el-upload :file-list="fileList" :data="dataObj" :multiple="true" :before-upload="beforeUpload" :on-error="uploadError"
    accept="image/jpeg, image/jpg, image/png" action="http://up-z2.qiniup.com" :on-success="handleSuccess" drag>
    <i class="el-icon-upload" />
    <div class="el-upload__text">
      将文件拖到此处，或<em>点击上传</em>
    </div>
  </el-upload>
</template>

<script>
import { getToken } from '@/api/qiniu'
// 获取七牛token 后端通过Access Key,Secret Key,bucket等生成token
// 七牛官方sdk https://developer.qiniu.com/sdk#official-sdk

export default {
  data() {
    return {
      dataObj: { token: '', key: '', data: {}, bucket: 'hongkongidcard' },
      image_uri: [],
      fileList: [],
      suffix: ''
    }
  },
  methods: {
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
      let idcard_img = 'https://hongkongidcard.wenfree.cn/' + val.key
    },
    uploadError(val) {
      console.log('uploadError', val)
    }
  }
}
</script>
