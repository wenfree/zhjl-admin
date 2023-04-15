<template>
  <div class="app-container" style="background-color: #f1f1f1;">
    

      <el-row :gutter="20" class="panel-group">
        <el-col :span="16">
          <el-main style="background-color: #fff;">
            <svg-icon icon-class="table"/> 托管器具预警
            <el-divider></el-divider>

            <el-row :gutter="20" class="panel-group">
              <el-col :span="6" v-for="(item, index) in iconJson" :key="index" class="card-panel-col">
                <div class="card-panel">
                  <div class="card-panel-icon-wrapper icon-people">
                    <i :class="item.icon" />
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">
                      {{ item.name }}
                    </div>
                    <count-to :start-val="0" :end-val="item.count" :duration="2600" class="card-panel-num" />
                  </div>
                </div>
              </el-col>
            </el-row>

          </el-main>

          <el-main style="background-color: #fff;margin-top: 20px;">
            <svg-icon icon-class="table" /> 最新报检记录 (数据来自业务系统受理记录)
            <el-divider></el-divider>

            <lineText>
              <div class="step-title" style="margin-bottom: 5px;"><i class="el-icon-discount" style="color: red;" />委托单号: 123123</div>
              
              <el-steps :active="3">
                <el-step title="登记" description="2022-07-15"></el-step>
                <el-step title="检测中" description="2022-07-15"></el-step>
                <el-step title="检测完毕" description="2022-07-15"></el-step>
                <el-step title="证书出库" description="2022-07-15"></el-step>
              </el-steps>
            </lineText>





          </el-main>

        </el-col>
        <el-col :span="4">other</el-col>

      </el-row>

  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getName, getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Peoples',
  components: { Pagination,CountTo },
  directives: { waves },

  data() {
    return {
      username:'',
      iconJson: [
        { icon: 'el-icon-alarm-clock', name: '已超期', count: 22 },
        { icon: 'el-icon-paperclip', name: '15天预警', count: 35 },
        { icon: 'el-icon-orange', name: '30天预警', count: 60 },
        { icon: 'el-icon-timer', name: '3个月预警', count: 152 },
      ]

    }
  },
  created() {
    this.username = getName()
    if (this.username == 'wenfree') {
      this.username = ''
    }

  },
  methods: {
    
  }
}
</script>
<style lang="scss" scoped>
.card-panel{
  display: flex;
  align-items: center;
}
.card-panel-description{
  margin-left: 10px;
  text-align: center;
}
.card-panel-icon-wrapper i {
  font-size: 48px;
  padding: 5px;
  background-color: #e6abd74d;
  color: #e480bdd8;
  border-radius: 5px;
}
</style>