<template>

  <div class="app-container">
    <div class="filter-container">
      <el-form ref="where" :model="where" label-width="80px" :inline="true">
        <template v-for="(item,index) in whereJson">
          <el-form-item :key="index" :label="item.label">
            <template v-if="item.type == 'date'">
              <el-date-picker
                :key="index"
                v-model="where[item.prop]"
                type="date"
                :placeholder="item.placeholder"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                style="width: 160px;margin-right: 5px;"
                class="filter"
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
                class="filter"
              />
            </template>

            <template v-else>
              <el-input
                :key="index"
                v-model="where[item.prop]"
                clearable
                :placeholder="item.placeholder"
                style="width: 160px;margin-right: 5px;"
                class="filter"
              />
            </template>
          </el-form-item>
        </template>

        <el-button v-waves class="filter" type="primary" icon="el-icon-search" @click="getList">
          查詢
        </el-button>
      </el-form>

      <!-- <el-divider><i class="el-icon-mobile-phone"></i></el-divider> -->
      <!-- <el-divider></el-divider> -->

      <el-button
        v-waves
        :loading="downloadLoading"
        type="success"
        icon="el-icon-plus"
        class="filter"
        @click="addPeople"
      >新增</el-button>

      <el-drawer title="人员管理" :visible.sync="drawer" direction="ltr" size="80%">

        <el-main>
          <el-form ref="form" :model="form" label-width="150px">
            <template v-for="(item, index) in formJson">

              <el-form-item v-if="item.type == 'Checkbox'" :key="index" :label="item.label" :prop="item.prop">
                <el-checkbox-group v-if="item.IsIf" v-model="form[item.prop]">
                  <el-checkbox v-for="check in item.opration" :key="check" :label="check">{{ check == item.if[0] ?
                    item.if[1]:item.if[2] }}</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-else v-model="form[item.prop]">
                  <el-checkbox v-for="check in item.opration" :key="check" :label="check">{{ check }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item v-else-if="item.type == 'selects'" :key="item.prop" :label="item.label" :prop="item.prop">
                <el-select
                  v-model="form[item.prop]"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择"
                >
                  <el-option v-for="item_ in item.options" :key="item_.value" :label="item_.label" :value="item_.value" />
                </el-select>
              </el-form-item>
              <el-form-item v-else-if="item.type == 'img'" :key="item.prop" :label="item.label" :prop="item.prop">
                <el-input v-model="form[item.prop]" />
              </el-form-item>
              <el-form-item v-else :key="item.label" :label="item.label" :prop="item.prop">
                <el-input v-model="form[item.prop]" :disabled="item.disable" />
              </el-form-item>
            </template>

            <el-form-item>
              <el-button
                :loading="listLoading"
                type="success"
                icon="el-icon-orange"
                class="filter-item"
                @click="UpDateInfo"
              >
                {{ button_name }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-main>

      </el-drawer>

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
      <el-table-column type="index" label="#" />
      <template v-for="item in columnJson">
        <el-table-column v-if="item.type && item.type == 'img'" :key="item.label" :label="item.label">
          <template slot-scope="scope">
            <!-- {{ scope.row.signature }} -->
            <el-image :src="scope.row.signature" fit="fit" />
          </template>
        </el-table-column>
        <el-table-column v-if="item.type && item.type == 'tag'" :key="item.label" :label="item.label">
          <template slot-scope="scope">
            <el-tag v-for="tag in scope.row[item.prop]" :key="tag" size="mini" style="margin-right: 4px;">{{ tag
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column v-else :key="item.lalel" :prop="item.prop" :label="item.label" />
      </template>

      <el-table-column>
        <template slot-scope="scope">
          <el-button icon="detel" size="mini" type="info" @click="editById(scope.row)">编辑</el-button>
          <el-button icon="detel" size="mini" type="danger" @click="delById(scope.row.id)">删除</el-button>
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
import { fetchList, deleteById, upDateInfo, UpdateById } from '@/api/index'
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
        size: 20,
        table: 'phalapi_user_organization',
        where: {}
      },
      where: {

      },
      whereJson: [
        { prop: 'cm_code', placeholder: '机构代码', label: '机构代码' },
        { prop: 'cm_name', placeholder: '机构名称', label: '机构名称' },
      ],
      columnJson: [
        // { prop: 'id', label: 'id' },
        { prop: 'cm_code', label: '机构代码' },
        { prop: 'cm_name', label: '机构名称' },
      ],
      downloadLoading: false,
      drawer: false,
      form: {
        u_code: '',
        u_name: ''
      },
      formJson: [
        { label: '机构代码', prop: 'cm_code' },
        { label: '机构名称', prop: 'cm_name' },
      ],
      button_name: '新增',
      editedId: ''
    }
  },
  created() {
    this.username = getName()
    this.getList()
  },
  methods: {
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
      this.listLoading = true
      const postdata = {
        id: id,
        table: this.listQuery.table
      }
      deleteById(postdata).then(response => {
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
          this.getList()
        }, 0.5 * 1000)
      })
    },
    UpDateInfo() {
      this.drawer = false

      const filteredData = this.form.filter((item) => !item.hasOwnProperty("id"));

      var postdata = {
        id: this.editedId,
        table: this.listQuery.table,
        arr: JSON.stringify(this.form)
      }

      console.log('postdata', postdata)

      UpdateById(postdata).then(response => {
        console.log('更新接口', response.data)

        this.$notify({
          title: '返回提示',
          message: response.data
        })
        this.getList()
      })
    },
    addPeople() {
      this.button_name = '新增'
      this.editedId = ''
      this.drawer = true
      this.formJson[0].disable = false
    },
    editById(row) {
      this.form = row
      this.editedId = row.id
      this.button_name = '更新'
      this.drawer = true
      // this.formJson[0].disable = true
    },
    formatterRoles(row, column) {
      const ch = { fibrpro: '员工', 'fibrpro-admin': '管理员' }
      const res = []
      for (let i = 0; i < row.roles.length; i++) {
        res.push(ch[row.roles[i]])
      }
      return res
    }
  }
}
</script>

<style scoped>
  .filter-container .el-form-item{
    margin-bottom: 8px;
  }
</style>
