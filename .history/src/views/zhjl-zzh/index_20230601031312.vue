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
                    <div class="card-panel-text" @click="wraning(item.name)">
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

            <div v-for="(item, index) in setpJson" :key="index" class="card-step">
              <div class="step-title" style="margin-bottom: 5px;"><i class="el-icon-discount" style="color: red;" />委托单号: <a href="">{{item.tickets}}</a></div>
              <el-steps :active="item.step" finish-status="success">
                <el-step title="登记" :description="item.time1"></el-step>
                <el-step title="检测中" :description="item.time2"></el-step>
                <el-step title="检测完毕" :description="item.time3"></el-step>
                <el-step title="证书出库" :description="item.time4"></el-step>
              </el-steps>
            </div>

          </el-main>

        </el-col>
        <el-col :span="4"></el-col>

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
      ],
      setpJson:[
        { tickets:123123, step:2, time1: '2022-07-15',time2: '2022-07-15',time3: '2022-07-15', time4: '', },
        { tickets:123124, step:3, time1: '2022-07-15',time2: '2022-07-15',time3: '2022-07-15', time4: '', },
        { tickets:123125, step:2, time1: '2022-07-15',time2: '2022-07-15',time3: '2022-07-15', time4: '', },
        { tickets:123126, step:2, time1: '2022-07-15',time2: '2022-07-15',time3: '2022-07-15', time4: '', },
        { tickets:123127, step:4, time1: '2022-07-15',time2: '2022-07-15',time3: '2022-07-15', time4: '2022-07-15', },
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
    wraning(name) {
      this.$notify({
        title: name,
      })

      this.$router.push('/home');
    }
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