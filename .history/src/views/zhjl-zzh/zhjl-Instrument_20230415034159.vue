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
        查询
      </el-button>



    </div>
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-document-add" @click="handleFilter">
        导入
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleFilter">
        新建
      </el-button>
    </div>


    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit="true"
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
        table: 'phalapi_user',
        where: {}
      },
      where: {

      },
      whereJson: [
        { prop: 'door', placeholder: '部门', type: '' },
        { prop: 'name', placeholder: '仪器名称' },
        { prop: 'categroy', placeholder: '设备类别' },
        { prop: 'checkDate', placeholder: '校验日期', type: 'daterange' },
        { prop: 'Havedate', placeholder: '有效日期', type: 'daterange' },
        { prop: 'state', placeholder: '管理状态', type: '' }
      ],
      columnJson: [
        { prop: 'id', label: 'id' },
        { prop: '部门', label: '部门' },
        { prop: '设备类型', label: '设备类型' },
        { prop: '仪器名称', label: '仪器名称' },
        { prop: '型号规格', label: '型号规格' },
        { prop: '制造厂家', label: '制造厂家' },
        { prop: '出厂编号', label: '出厂编号' },
        { prop: '安装位置', label: '安装位置' },
        { prop: '数量', label: '数量' },
        { prop: '校准日期', label: '校准日期' },
        { prop: '周期', label: '周期' },
        { prop: '测量范围', label: '测量范围' },
        { prop: '有效日期', label: '有效日期' },
        { prop: '到期进度', label: '到期进度' },
        { prop: '溯源方式', label: '溯源方式' },
        { prop: '溯源机构', label: '溯源机构' },
        { prop: '收件备注', label: '收件备注' },
        { prop: '负责人', label: '负责人' },
        { prop: '管理状态', label: '管理状态' }
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
          溯源机构:'赛多利斯',
          有效日期:'20220415',
          校准证书:'123123123',
          操作:'修改，下载',
          证书确认: '证书信息'
        },
        {
          校准日期:'20220415',
          溯源机构:'赛多利斯',
          有效日期:'20220415',
          校准证书:'123123123',
          操作:'修改，下载',
          证书确认: '证书信息'
        },
      ],
      downloadLoading: false,
      drawer: false,
      historyList: [],
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
      // this.listLoading = true

      var list = [
        { 
          id: 1, 
          部门: '质检中心', 
          仪器名称: '电子天平', 
          型号规格: "BT457A5",
          制造厂家: "赛多利斯",
          出厂编号: "4004A07023",
          安装位置: "实验室1",
          数量: "1",
          校准日期: "20220415",
          周期: "12",
          测量范围: "",
          有效日期: "20230414",
          到期进度: "",
          溯源方式: "校准",
          溯源机构: "泽恒计量检测（北京）有限公司",
          收件备注: "",
          负责人: "",
          管理状态: "正常",
        },
        { 
          id: 2, 
          部门: '质检中心', 
          仪器名称: '压力表', 
          型号规格: "(0～1)Mpa",
          制造厂家: "BRIGHTY",
          出厂编号: "/",
          安装位置: "灭菌锅",
          数量: "1",
          校准日期: "20230112",
          周期: "6",
          测量范围: "",
          有效日期: "20230414",
          到期进度: "",
          溯源方式: "校准",
          溯源机构: "泽恒计量检测（北京）有限公司",
          收件备注: "",
          负责人: "",
          管理状态: "正常",
        },
        { 
          id: 3, 
          部门: '质检中心', 
          仪器名称: '高效液相色谱仪', 
          型号规格: "1260 Infinity",
          制造厂家: "Agilent",
          出厂编号: "DEAB809772",
          安装位置: "实验室1",
          数量: "1",
          校准日期: "20220415",
          周期: "12",
          测量范围: "",
          有效日期: "20230414",
          到期进度: "",
          溯源方式: "校准",
          溯源机构: "泽恒计量检测（北京）有限公司",
          收件备注: "",
          负责人: "",
          管理状态: "正常",
        },
        { 
          id: 4, 
          部门: '设备部', 
          仪器名称: '电子天平', 
          型号规格: "BT457A5",
          制造厂家: "4004A07023",
          出厂编号: "BT457A5",
          安装位置: "设备部",
          数量: "1",
          校准日期: "20220415",
          周期: "12",
          测量范围: "",
          有效日期: "20230414",
          到期进度: "",
          溯源方式: "校准",
          溯源机构: "泽恒计量检测（北京）有限公司",
          收件备注: "",
          负责人: "",
          管理状态: "正常",
        },
        { 
          id: 5, 
          部门: '设备部', 
          仪器名称: '压力表', 
          型号规格: "(0～1)Mpa",
          制造厂家: "BRIGHTY",
          出厂编号: "/",
          安装位置: "灭菌锅",
          数量: "1",
          校准日期: "20220415",
          周期: "6",
          测量范围: "",
          有效日期: "20230414",
          到期进度: "",
          溯源方式: "校准",
          溯源机构: "泽恒计量检测（北京）有限公司",
          收件备注: "",
          负责人: "",
          管理状态: "正常",
        },
      ]

      this.list = list
      this.total = 5



      this.listLoading = false
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
