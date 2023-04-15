<template>
  <div class="app-container" style="background-color: #f1f1f1;">
    

      <el-row :gutter="20" class="panel-group">
        <el-col :span="16">
          <el-main style="background-color: #fff;">
            <svg-icon icon-class="table"/> 托管器具预警
            <el-divider></el-divider>

            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="peoples" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  已超期
                </div>
                <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
              </div>
            </div>


          </el-main>
        </el-col>
        <el-col :span="4">other</el-col>

      </el-row>

  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getName, getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Peoples',
  components: { Pagination },
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
