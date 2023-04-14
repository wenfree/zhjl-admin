<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="where.name" placeholder="Title" style="width: 200px;margin-right: 10px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查詢
      </el-button>
      <el-button v-waves class="filter-item" type="success" icon="el-icon-plus" @click="addItem">
        添加物料
      </el-button>
      <el-button v-waves class="filter-item" type="danger" icon="el-icon-delete" @click="deleteAll"
        :disabled="detel_state">
        批量删除
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange" @selection-change="handleSelectionChange">

      <el-table-column type="selection" align="center" />

      <template v-for="item in columnJson">
        <el-table-column v-if="item.type && item.type == 'img'" :key="item.label" :label="item.label">
          <template slot-scope="scope">
            <!-- {{ scope.row.signature }} -->
            <el-image :src="scope.row.signature" fit="fit" />
          </template>
        </el-table-column>

        <el-table-column v-else :key="item.lalel" :prop="item.prop" :label="item.label" :show-overflow-tooltip="true" />
      </template>

      <el-table-column>
        <template slot-scope="scope">
          <el-button type="danger" icon="detel" size="mini" @click="delById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
      @pagination="getList" />


    <el-drawer title="添加物料" :visible.sync="drawer" direction="ltr">

    </el-drawer>
  </div>
</template>

<script>
import { fetchList, deleteById, fetchPv, createArticle, updateArticle } from '@/api/ti'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
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
        size: 20,
        table: 'ti_com_cn_goods',
        where: {},
        s: 'App.Index.Select_where'
      },
      where: {

      },
      columnJson: [
        { prop: 'id', label: 'id' },
        { prop: 'name', label: '物料名称' },
        { prop: 'device_id', label: '设备id' },
        { prop: 'device_name', label: '设备名' },
        { prop: 'pay', label: '付款ti_id' },
        { prop: 'price', label: '单价' },
        { prop: 'update_time', label: 'time' }
      ],
      downloadLoading: false,
      selectList: [],
      detel_state: true,
      drawer: false
    }
  },
  watch: {
    selectList(newstr, oldstr) {
      if (newstr.length > 0) {
        this.detel_state = false
      } else {
        this.detel_state = true
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log('取参数', response.data)

        this.list = response.data.data
        this.total = response.data.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    delById(id) {
      this.listLoading = true
      const postdata = {
        id: id,
        table: 'ti_com_cn_goods'
      }
      deleteById(postdata).then(response => {
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
          this.getList()
        }, 0.2 * 1000)
      })
    },
    handleSelectionChange(val) {
      console.log('select', val)
      this.selectList = val
    },
    addItem() {
      console.log('增加物料')
      this.drawer = true
    },
    deleteAll() {
      console.log('准备批量删除', this.selectList)
      for (var i = 0; i < this.selectList.length; i++) {
        this.delById(this.selectList[i]['id'])
        // console.log('id', this.selectList[i]['id'])
      }
    }
  }
}
</script>
