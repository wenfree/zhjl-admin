<template>
  <div class="app-container" style="background-color: #f1f1f1;">
    

      <el-row :gutter="20" class="panel-group">
        <el-col :span="16">
          <el-main style="background-color: #fff;">
            <svg-icon icon-class="table"/> 托管器具预警
            <el-divider></el-divider>

            <el-row :gutter="20" class="panel-group">
              <el-col :span="5">
                <div class="card-panel">
                  <div class="card-panel-icon-wrapper icon-people">
                    <i class="el-icon-alarm-clock icon" />
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">
                      已超期
                    </div>
                    <count-to :start-val="0" :end-val="22" :duration="2600" class="card-panel-num" />
                  </div>
                </div>
              </el-col>
      
            </el-row>

   


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
  margin-left: 5px;
  text-align: center;
  
}
.card-panel-icon-wrapper i {
  font-size: 48px;
  padding: 5px;
  background-color: #7cccad4d;
}
</style>