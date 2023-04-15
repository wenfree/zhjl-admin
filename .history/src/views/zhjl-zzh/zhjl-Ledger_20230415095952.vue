<template>
  <div class="app-container">
    <div class="filter-container">
      <template v-for="(item,index) in whereJson">
        <template v-if="item.type == 'date'">
          <el-date-picker
            :key="index"
            v-model="where[item.prop]"
            type="date"
            :placeholder="item.placeholder"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 160px;margin-right: 5px;"
            class="filter-item"
          />
        </template>

        <template v-else-if="item.type == 'time'">
          <el-date-picker
            :key="index"
            v-model="where[item.prop]"
            type="datetime"
            :placeholder="item.placeholder"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 260px;margin-right: 5px;"
            class="filter-item"
          />
        </template>

        <template v-else-if="item.type == 'daterange'">
          <el-date-picker
            :key="index"
            v-model="where[item.prop]"
            type="daterange"
            range-separator="至"
            :start-placeholder="item.placeholder"
            :end-placeholder="item.placeholder"
            style="width: 260px;margin-right: 5px;"
            class="filter-item"
            >
          </el-date-picker>
        </template>

        <template v-else>
          <el-input :key="index" v-model="where[item.prop]" clearable :placeholder="item.placeholder" style="width: 160px;margin-right: 5px;" class="filter-item" />
        </template>

      </template>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查詢
      </el-button>

    </div>

    <div class="filter-container">
      <el-button v-waves type="primary" icon="el-icon-plus" @click="handleFilter">
        新增
      </el-button>
      <el-button v-waves type="primary" icon="el-icon-collection" @click="handleFilter">
        保存
      </el-button>
      <el-button v-waves type="primary" icon="el-icon-delete" @click="handleFilter">
        删除
      </el-button>
      <el-button v-waves type="primary" icon="el-icon-upload2" @click="handleFilter">
        提交
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
      @sort-change="sortChange"
    >
      <el-table-column type="index"></el-table-column>
      <template v-for="item in columnJson">
        <el-table-column v-if="item.type && item.type == 'img'" :key="item.label" :label="item.label">
          <template slot-scope="scope">
            <!-- {{ scope.row.signature }} -->
            <el-image :src="scope.row.signature" fit="fit" />
          </template>
        </el-table-column>

        <el-table-column v-else :key="item.lalel" :prop="item.prop" :label="item.label" />
      </template>

      <el-table-column label="操作" width="222">
        <template slot-scope="scope">
          <el-button size="mini" icon="detel" @click="lookAll(scope.row.id)">查看详情</el-button>
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
        table: 'phalapi_user',
        where: {}
      },
      where: {

      },
      whereJson: [
        { prop: 'todoDate', placeholder: '委托日期', type: 'daterange' },
        { prop: 'name', placeholder: '仪器名称' },
        { prop: 'state', placeholder: '订单状态' },
        { prop: 'doneDate', placeholder: '完工日期', type: 'daterange' }
      ],
      columnJson: [
        // { prop: 'id', label: 'id' },
        { prop: '委托单号', label: '委托单号' },
        { prop: '联系人', label: '联系人' },
        { prop: '证书单位', label: '证书单位' },
        { prop: '仪器名称', label: '仪器名称' },
        { prop: '联系电话', label: '联系电话' },
        { prop: '委托日期', label: '委托日期' },
        { prop: '仪器数量', label: '仪器数量' },
        { prop: '订单状态', label: '订单状态' },
        { prop: '完工日期', label: '完工日期' },
        { prop: '备注', label: '备注' }
      ],
      downloadLoading: false
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

      var list = [
        {
          委托单号:'20-1043345-002',
          联系人:'',
          证书单位:'泽恒计量检',
          联系电话:'联系电话',
          委托日期:'委托日期',
          仪器数量:'仪器数量',
          订单状态:'订单状态',
          完工日期:'完工日期',
          备注:'备注',
        }
      ]

      this.list = list
      this.total = 10

      

    },
    delById(id) {

    },
    lookAll(id) {
      
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
    }
  }
}
</script>
