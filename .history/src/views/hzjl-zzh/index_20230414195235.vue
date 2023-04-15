<template>
  <div class="app-container" style="background-color: #f1f1f1;">
    <el-main style="background-color: #fff;">

      <el-row :gutter="40" class="panel-group">
        <el-col :span="30">
          <svg-icon icon-class="table" class-name="card-panel-icon" />
          托管器具预警
          <el-divider></el-divider>
        </el-col>
        <el-col :span="10"><div class="grid-content bg-purple"></div></el-col>

      </el-row>
    </el-main>
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
