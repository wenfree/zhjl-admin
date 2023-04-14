<template>
  <div>

  </div>
</template>



<script>

export default {
  name: "Sign",
  components: {},
  data() {
    return {
      formJson: {
        widgetList: [],
        formConfig: {
          labelWidth: 80,
          labelPosition: "left",
          size: "",
          labelAlign: "label-left-align",
          cssCode: "",
          customClass: "",
          functions: "",
          layoutType: "H5",
          onFormCreated: "",
          onFormMounted: "",
          onFormDataChange: "",
        },
      },
      formData: {},
      optionData: {},
    };
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  methods: {
    submitForm() {
      this.$refs.vFormRef
        .getFormData()
        .then((formData) => {
          // Form Validation OK
          alert(JSON.stringify(formData));
        })
        .catch((error) => {
          // Form Validation failed
          this.$message.error(error);
        });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */


</style>
