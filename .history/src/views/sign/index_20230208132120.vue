<template>

  <div>
    表名表
  </div>
</template>
<script>


export default {
  name: "Sign",
  components: {},
  data() {
    return {
      formJson: {

      },
      formData: {},
      optionData: {}
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  methods: {
    submitForm() {
      console.log('提交')
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */


</style>
