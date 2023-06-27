<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form ref="where" :model="where" label-width="80px" :inline="true">
        <template v-for="(item,index) in whereJson">
          <el-form-item :key="index" :label="item.label" :class="item.prop">
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
                />
              </el-select>
            </template>

            <template v-else-if="item.type == 'textarea'">
              <el-input
                v-model="where[item.prop]"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
              />
            </template>

            <template v-else>
              <el-input
                :key="index"
                v-model="where[item.prop]"
                clearable
                :placeholder="item.placeholder"
                class="filter"
              />
            </template>
          </el-form-item>
        </template>

        <el-button v-waves class="filter" type="primary" icon="el-icon-search" @click="getList">
          查詢
        </el-button>
        <el-button v-waves class="filter" type="" icon="el-icon-refresh-right" @click="where={}">
          重置
        </el-button>
      </el-form>
    </div>

    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="createNew('one')">
        新建
      </el-button>
      <el-button v-waves class="filter-item" type="info" icon="el-icon-delete" @click="handleFilter">
        批量删除
      </el-button>
      <el-button v-waves class="filter-item" type="" icon="el-icon-upload2" @click="handleFilter">
        批量提交
      </el-button>
    </div>

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
      <el-table-column type="index" />
      <template v-for="item in columnJson">
        <el-table-column :key="item.lalel" :prop="item.prop" :label="item.label" />
      </template>

      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" @click="history(scope.row)">查看</el-button>
          <el-button size="mini" icon="el-icon-edit" @click="EditRow(scope.row)">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" @click="">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      :page-sizes="[10, 20, 100, 200, 300, 400, 500, 1000, 5000, 10000]"
      @pagination="getList"
    />

    <el-drawer
      title="新增预约订单"
      :visible.sync="drawer"
      direction="ltr"
      size="90%"
    >
      <el-main>
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
          <el-table-column type="index" label="#" />
          <el-table-column v-for="(item, index) in columnHistory" :key="index" :prop="item.prop" :label="item.label" />

        </el-table>

        <el-button v-waves style="margin-top: 15px;" class="filter-item" type="success" icon="el-icon-plus" @click="handleFilter">
          证书上传
        </el-button>

      </el-main>
    </el-drawer>


    <!-- //新增预约 -->
    <el-drawer :title="create.title" :visible.sync="create.drawer" direction="ltr" size="95%">
      <el-main>
        <div class="filter-container">
          <el-button
            :loading="listLoading"
            type="success"
            icon="el-icon-orange"
            class="filter-item"
            size="mini"
            @click="UpDateInfo"
          >
            {{ create.button }}
          </el-button>

          <el-button
            :loading="listLoading"
            type=""
            icon="el-icon-back"
            class="filter-item"
            size="mini"
            @click="create.drawer = false"
          >
            返回
          </el-button>
        </div>

        <el-form ref="form" :model="form" label-width="80px" class="form_createNew">
          <template v-for="(item, index) in formJson">
            <el-form-item :key="index" :label="item.label + ':'" :prop="item.prop" :class="item.prop">
              <template v-if="item.type == 'Checkbox'">
                <el-checkbox-group v-model="form[item.prop]">
                  <el-checkbox v-for="check in item.opration" :key="check" :label="check">{{ check }}</el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-else-if="item.type == 'selects'">
                <el-checkbox-group v-model="form[item.prop]">
                  <el-checkbox v-for="check in item.opration" :key="check" :label="check">{{ check }}</el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-else-if="item.type == 'textarea'">
                <el-input v-model="form[item.prop]" type="textarea" :rows="4" :placeholder="item.placeholder" :disabled="item.disable" />
              </template>

              <template v-else>
                <el-input v-model="form[item.prop]" :placeholder="item.placeholder" :disabled="item.disable" :style="item.style" />
              </template>

            </el-form-item>

          </template>
        </el-form>
      </el-main>
    </el-drawer>
    <!-- //新增预约结束 -->

  </div>
</template>

<script>
import { fetchList, deleteById, updateArticle, UpdateById, GetOrder } from '@/api/index'
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
        table: '',
        where: {}
      },
      where: {

      },
      form: {},
      whereJson: [
        { prop: 'dh', placeholder: '预约单号', label: '预约单号', type: '' },
        { prop: 'instrument_name', placeholder: '仪器名称', label: '仪器名称', type: '' },
        { prop: 'lxr', placeholder: '业务员', label: '业务员', type: '' },
        { prop: 'sjrq', placeholder: '预约日期', label: '预约日期', type: 'daterange', start: '启始日期', end: '结束日期' },
        { prop: 'validity_period', placeholder: '完工日期', label: '完工日期', type: 'daterange', start: '启始日期', end: '结束日期' },
        { prop: 'management_status', placeholder: '状态', label: '状态', type: '' },
      ],
      reservationJson: [
        { prop: 'department', placeholder: '业务员', label: '业务员', type: '' },
        { prop: 'instrument_name', placeholder: '联系电话', label: '联系电话', type: '' },
        { prop: 'instrument_name', placeholder: '预约日期', label: '预约日期', type: '' },
        { prop: 'instrument_name', placeholder: '仪器数量', label: '仪器数量', type: '' },
        { prop: 'instrument_name', placeholder: '服务器', label: '仪器数量', type: '' },
        { prop: 'service_type', placeholder: '服务方式', label: '服务方式', type: 'select', options: ['送检', '现场', '转送'] },
        { prop: 'service_type', placeholder: '证书单位', label: '证书单位', type: 'select', options: ['A', 'B', 'C'] },
        { prop: 'manufacturer', placeholder: '证书地址', label: '证书地址', type: '' },
        { prop: 'manufacturer', placeholder: '备注', label: '备注', type: 'textarea' }
      ],
      columnJson: [
        { prop: 'dh', label: '预约单号' },
        { prop: 'sjrq', label: '预约日期' },
        { prop: 'xsmc', label: '仪器数量' },
        { prop: 'jssj', label: '结束时间' },
        { prop: 'lxr', label: '提交人' },
        { prop: 'state', label: '订单状态' },
      ],
      columnHistory: [
        { prop: '校准日期', label: '校准日期' },
        { prop: '溯源机构', label: '溯源机构' },
        { prop: '有效日期', label: '有效日期' },
        { prop: '校准证书', label: '校准证书' },
        { prop: '操作', label: '操作' },
        { prop: '证书确认', label: '证书确认' }
      ],
      formJson: [
        { prop: 'lxr', label: '业务员' },
        { prop: 'instrument_level', label: '联系电话' },
        { prop: 'instrument_name', label: '预约日期' },
        { prop: 'model_specifications', label: '仪器数量' },
        { prop: 'manufacturer', label: '服务方式' },
        { prop: 'factory_number', label: '证书单位' },
        { prop: 'management_number', label: '证书地址' },
        { prop: 'installation_location', label: '证书类型' },      
        { prop: 'remarks', label: '备注', placeholder: '多行输入', type: 'textarea', style: 'width:50%;' }
      ],
      historyArr: [
        {
          校准日期: '20220415',
          溯源机构: '泽恒计量检测（北京）有限公司',
          有效日期: '20230414',
          校准证书: 'ZHJL-CA-202204150244',
          操作: '申请修改',
          证书确认: '证书信息'
        },
        {
          校准日期: '20220415',
          溯源机构: '赛多利斯',
          有效日期: '20230414',
          校准证书: 'ZHJL-CA-202204150244',
          操作: '下载',
          证书确认: '证书信息'
        }
      ],
      downloadLoading: false,
      drawer: false,
      historyList: [],
      activeName: 'serach',
      selectRows: [],
      create: {
        drawer: false,
        title: '新增预约',
        button: '保存'
      }
    }
  },
  created() {
    this.username = getName()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 需要搜索的部分格式化
      console.log('where', this.where)
      this.listQuery.where = JSON.stringify(this.where)

      const postdata ={
        page: this.listQuery.page,
        size: this.listQuery.size,
        username: this.username
      }

      GetOrder(postdata).then(response => {
        console.log('取list', response)

        this.list = response.data.data
        this.total = Number(response.data.count)

        setTimeout(() => {
          this.listLoading = false
        }, 200)
      })
    },
    delById(id) {

    },
    history(val) {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    UpDateInfo() {
      this.drawer = false

      var postdata = {
        id: '',
        table: 'phalapi_instrument',
        arr: JSON.stringify(this.form)
      }

      console.log('postdata', postdata)

      UpdateById(postdata).then(response => {
        console.log('更新和新增接口', response)

        this.$notify({
          title: '返回提示',
          message: response.data
        })
        this.getList()
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
      console.log(tab, event)
    },
    createNew(type) {
      console.log(type)
      this.create.title = '新增预约'
      this.create.drawer = true
    },
    EditRow(row) {
      this.form = row
      this.create.drawer = true
      this.create.title = '编辑仪器信息'
    }
  }
}
</script>

<style scoped>
  .filter-container .el-form-item{
    margin-bottom: 8px;
  }

  .reservation{
    padding: 5px 10px;
    padding-top: 10px;
    border: 1px solid #DCDFE6;
    margin-bottom: 10px;
  }

  .form_createNew .el-form-item{
    margin-bottom: 5px;
    /* width: 40%; */
    float: left;
  }
  .form_createNew .person_in_charge{
    width: 80%;
  }
  .form_createNew .remarks{
    width: 71.5%;
  }
</style>

