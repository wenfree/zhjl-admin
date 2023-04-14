<template>
  <el-upload :data="dataObj" :multiple="true" :before-upload="beforeUpload" action="https://qiniu.region.z2" drag>
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
      dataObj: { token: '', key: 'xcloaEa4X3XzqXKDmz_1U1AFtNI1jlbodaHoNOQ4' },
      image_uri: [],
      fileList: []
    }
  },
  methods: {
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          const key = response.data.key
          const token = response.data.token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key

          console.log('_self', _self.dataObj)
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    }
  }
}
</script>
