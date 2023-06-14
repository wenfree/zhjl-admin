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
      </template>

      <el-button v-waves class="filter" type="primary" icon="el-icon-search" @click="getList">
        查詢
      </el-button>

      <el-button
        v-waves
        :loading="downloadLoading"
        type="success"
        icon="el-icon-plus"
        class="filter"
        @click="addPeople"
      >新增人员</el-button>

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
              <el-form-item v-else-if="item.type == 'autocomplete'" :key="item.prop" :label="item.label" :prop="item.prop">
                <el-autocomplete
                  v-model="form[item.prop]"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入内容"
                  @select="handleSelect"
                  @change="handleChange"
                  @input="handleInput"
                ></el-autocomplete>
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
import { fetchList,fetchZhjl, deleteById, upDateInfo } from '@/api/index'
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
        table: 'phalapi_user',
        where: {}
      },
      where: {

      },
      whereJson: [
        { prop: 'username', placeholder: '登录名' },
        { prop: 'unit', placeholder: '公司' },
        { prop: 'nickname', placeholder: '昵称' }
      ],
      columnJson: [
        // { prop: 'id', label: 'id' },
        { prop: 'username', label: '登录名' },
        { prop: 'fullName', label: '名称' },
        { prop: 'nickname', label: '昵称' },
        { prop: 'roles', label: '角色', type: 'tag' },
        // { prop: 'sign', label: '签名', type:'tag' },
        { prop: 'unit', label: '公司' },
        { prop: 'update_time', label: '时间' }
      ],
      downloadLoading: false,
      drawer: false,
      form: {
        username: '',
        password: '123456',
        fullName: '',
        nickname: '',
        roles: [],
        sign: []
      },
      formJson: [
        { label: '登录名', prop: 'username', disable: true },
        { label: '密码', prop: 'password' },
        { label: '姓名', prop: 'fullName' },
        { label: '昵称', prop: 'nickname' },
        {
          label: '角色', prop: 'roles', type: 'selects', options: [
            { label: 'admin', value: 'admin' },]
        },
        { label: '公司', prop: 'unit', type: 'autocomplete' },
      ],
      button_name: '新增人员',
      editedId: '',
      restaurants: []
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

        for (let i = 0; i < this.list.length; i++) {
          this.list[i].roles = JSON.parse(this.list[i].roles)
        }

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
        table: 'phalapi_user'
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
      this.form.roles = JSON.stringify(this.form.roles)
      var postdata = {
        id: this.editedId,
        json: JSON.stringify(this.form)
      }

      console.log('postdata', postdata)

      upDateInfo(postdata).then(response => {
        console.log('更新接口', response.data)

        this.$notify({
          title: '返回提示',
          message: response.data
        })
        this.getList()
      })
    },
    addPeople() {
      this.button_name = '新增人员'
      this.editedId = ''
      this.drawer = true
      this.form = {
        username: '',
        password: '123456',
        fullName: '',
        nickname: '',
        roles: [],
        sign: [],
        unit: ''
      }
      this.formJson[0].disable = false
    },
    editById(row) {
      this.form = row
      this.form.password = ''
      this.editedId = row.id
      this.button_name = '更新信息'
      this.drawer = true
      this.formJson[0].disable = true
    },
    formatterRoles(row, column) {
      const ch = { fibrpro: '员工', 'fibrpro-admin': '管理员' }
      const res = []
      for (let i = 0; i < row.roles.length; i++) {
        res.push(ch[row.roles[i]])
      }
      return res
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 2000);
    },
    createStateFilter(queryString) {
      return (state) => {
        return state.qymc
        // return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    handleChange(item) {
      console.log('公司Change', item);
      console.log('公司Change-this', this.form.unit )
    },
    handleInput(item) {
      console.log('公司Input', item);
      console.log('公司Input-this', this.form.unit )

      const postData = {
        page:1,
        size:30,
        table: 'qyjbqkb',
        where: JSON.stringify({
          'qymc like ?': `%${item}%`
        })
      }
      fetchZhjl(postData).then(response => {
        console.log('公司数据', response)

        this.restaurants = response.data.data
        console.log('restaurants', this.restaurants)
        this.listLoading = false
      })

    },
  }
}
</script>
