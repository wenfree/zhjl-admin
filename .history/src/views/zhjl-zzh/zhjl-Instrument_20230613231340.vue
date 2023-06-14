<template>
  <div class="app-container">

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="查询选项" name="serach">
        <div class="filter-container">
          <el-form ref="where" :model="where" label-width="80px" :inline="true">
            <template v-for="(item,index) in whereJson">
              <el-form-item :label="item.label" :key="index">
                <template v-if="item.type == 'daterange'">
                  <el-date-picker
                    :key="index"
                    v-model="where[item.prop]"
                    type="daterange"
                    :placeholder="item.placeholder"
                    format="yyyyMMdd"
                    value-format="yyyy-MM-dd"
                    class="filter"
                    style="width:240px;margin-right:5px;"
                    :start-placeholder="item.start"
                    :end-placeholder="item.end"
                  />
                </template>
    
                <template v-else-if="item.type == 'time'">
                  <el-date-picker
                    :key="index"
                    v-model="where[item.prop]"
                    type="datetime"
                    :placeholder="item.placeholder"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    class="filter"
                  />
                </template>

                <template v-else-if="item.type == 'select'">
                  <el-select v-model="where[item.prop]" placeholder="请选择" style="width:120px;margin-right:5px;">
                    <el-option
                      v-for="select in item.options"
                      :key="select"
                      :label="select"
                      :value="select"
                    >
                    </el-option>
                  </el-select>
                </template>
    
                <template v-else>
                  <el-input
                    :key="index"
                    v-model="where[item.prop]"
                    clearable
                    :placeholder="item.placeholder"
                    style="width:120px;margin-right:5px;"
                    class="filter"
                  />
                </template>
              </el-form-item>
            </template>
          
            <el-button v-waves class="filter" type="primary" icon="el-icon-search" @click="getList">
              查詢
            </el-button>
          </el-form>
        </div>



        <div class="filter-container">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-document-add" @click="handleFilter">
            导入
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleFilter">
            新建
          </el-button>
        </div>


      </el-tab-pane>
      <el-tab-pane label="预约配置" name="yuyue">预约配置</el-tab-pane>
    </el-tabs>

    


    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="setSelectRows"
    >
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column type="index"></el-table-column>
      <template v-for="item in columnJson">
        <el-table-column :key="item.lalel" :prop="item.prop" :label="item.label" />
      </template>

      
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" icon="detel" @click="history(scope.row)">历史证书</el-button>
          <el-button size="mini" icon="detel" @click="delById(scope.row.id)">编辑</el-button>
          <el-button size="mini" icon="detel" @click="delById(scope.row.id)">删除</el-button>
          <el-button size="mini" icon="detel" @click="delById(scope.row.id)">预约</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      :page-sizes="[20, 100, 200, 300, 400, 500, 1000, 5000, 10000]"
      @pagination="getList"
    />

    <el-drawer
      title="仪器校验历史"
      :visible.sync="drawer"
      direction="ltr"
      size="90%"
      >
      <el-main>
        <div>仪器名称：  {{ historyList.仪器名称 }}</div>
        <div>型号规格：  {{ historyList.型号规格 }}</div>
        <div>制造厂家：  {{ historyList.制造厂家 }}</div>
        <div>出厂编号：  {{ historyList.出厂编号 }}</div>
        <div>出厂编号：  {{ historyList.出厂编号 }}</div>
        <br>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="historyArr"
          border
          fit="true"
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
        >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column v-for="(item, index) in columnHistory" :key="index" :prop="item.prop" :label="item.label" />
          
        </el-table>

        <el-button style="margin-top: 15px;" v-waves class="filter-item" type="success" icon="el-icon-plus" @click="handleFilter">
          证书上传
        </el-button>

      </el-main>
    </el-drawer>
  </div>
</template>

<script>
import { fetchList, deleteById, fetchPv, createArticle, updateArticle } from '@/api/fibrpro'
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        table: 'phalapi_instrument',
        where: {}
      },
      where: {

      },
      whereJson: [
        { prop: 'department', placeholder: '使用部门', label:'使用部门', type: '' },
        { prop: 'instrument_name', placeholder: '仪器名称', label:'仪器名称', type: '' },
        { prop: 'instrument_level', placeholder: '仪器级别',  label:'仪器级别', type: '' },
        { prop: 'calibration_date', placeholder: '校验日期', label:'校验日期', type: 'daterange',start:'启始日期', end:'结束日期' },
        { prop: 'validity_period', placeholder: '有效日期',label:'有效日期', type: 'daterange',start:'启始日期', end:'结束日期' },
        { prop: 'management_status', placeholder: '管理状态',label:'管理状态', type: '' },
        { prop: 'manufacturer', placeholder: '制造厂家',label:'制造厂家', type: '' },
        { prop: 'service_type', placeholder: '服务方式',label:'服务方式', type: 'select',  options: ['送检','现场','转送'] },
      ],
      columnJson: [
        {prop:'sn', label:'序号'},
        {prop:'department', label:'使用部门'},
        {prop:'instrument_level', label:'仪器级别'},
        {prop:'instrument_name', label:'仪器名称'},
        {prop:'model_specifications', label:'型号规格'},
        {prop:'manufacturer', label:'制造厂家'},
        {prop:'factory_number', label:'出厂编号'},
        {prop:'management_number', label:'管理编号'},
        {prop:'installation_location', label:'安装位置'},
        {prop:'maximum_level', label:'准确度等级或最大允许误差'},
        {prop:'number_of_instruments', label:'仪器数量'},
        {prop:'calibration_date', label:'校准日期'},
        {prop:'calibration_cycle', label:'周期'},
        {prop:'measurement_range', label:'测量范围'},
        {prop:'validity_period', label:'有效日期'},
        {prop:'service_type', label:'服务方式'},
        {prop:'certificate_number', label:'证书编号'},
        {prop:'remarks', label:'备注'},
        {prop:'expiration_progress', label:'到期进度'},
        {prop:'management_status', label:'管理状态'},
        {prop:'person_in_charge', label:'负责人'},
        {prop:'traceability_institution', label:'溯源机构'},
      ],
      columnHistory: [
        { prop: '校准日期', label: '校准日期' },
        { prop: '溯源机构', label: '溯源机构' },
        { prop: '有效日期', label: '有效日期' },
        { prop: '校准证书', label: '校准证书' },
        { prop: '操作', label: '操作' },
        { prop: '证书确认', label: '证书确认' },
      ],
      historyArr: [
        {
          校准日期:'20220415',
          溯源机构:'泽恒计量检测（北京）有限公司',
          有效日期:'20230414',
          校准证书:'ZHJL-CA-202204150244',
          操作:'申请修改',
          证书确认: '证书信息'
        },
        {
          校准日期:'20220415',
          溯源机构:'赛多利斯',
          有效日期:'20230414',
          校准证书:'ZHJL-CA-202204150244',
          操作:'下载',
          证书确认: '证书信息'
        },
      ],
      downloadLoading: false,
      drawer: false,
      historyList: [],
      activeName: 'serach',
      selectRows:[]
    }
  },
  created() {
    this.username = getName()
    if (this.username == 'wenfree') {
      this.username = ''
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 需要搜索的部分格式化
      console.log('where', this.where)
      this.listQuery.where = JSON.stringify(this.where)
      fetchList(this.listQuery).then(response => {
        console.log('取参数', response.data)
        this.list = response.data.data
        console.log('this.list', this.list)
        this.total = Number(response.data.count)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 200)
      })
    },
    delById(id) {

    },
    history(val){
      this.drawer = true
      this.historyList = val
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    setSelectRows(val) {
      console.log(val)
      this.selectRows = val
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateList() {
      this.listLoading = true
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['日期', '左耳', '右耳']
        const filterVal = ['date', 'leftbaddr', 'rightbaddr']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '耳机数据' + new Date().toLocaleString()
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>


<style scoped>
  .filter-container .el-form-item{
    margin-bottom: 8px;
  }
</style>

