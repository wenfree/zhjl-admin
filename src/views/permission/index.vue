<template>
  <!-- 菜单 -->
  <div class="app-container">
    <div class="filter-container">

      <el-button
        v-waves
        :loading="downloadLoading"
        type="success"
        icon="el-icon-plus"
        class="filter-item"
        size="mini"
        @click="addPeople"
      >
        新增菜单
      </el-button>

      <el-drawer
        title="菜单"
        :visible.sync="drawer"
        direction="ltr"
        size="80%"
      >

        <el-main>
          <el-form ref="form" :model="form" label-width="150px">
            <template v-for="(item, index) in formJson">

              <el-form-item v-if="item.type == 'Checkbox'" :key="index" :label="item.label" :prop="item.prop">
                <el-checkbox-group v-model="form[item.prop]">
                  <el-checkbox v-for="check in item.opration" :key="check" :label="check">{{ check }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item v-else-if="item.type == 'select'" :key="item.prop" :label="item.label" :prop="item.prop">
                <el-select v-model="form[item.prop]" placeholder="请选择">
                  <el-option
                    v-for="item_ in item.options"
                    :key="item_.title"
                    :label="item_.title"
                    :value="item_.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-else-if="item.type == 'selects'" :key="item.prop" :label="item.label" :prop="item.prop">
                <el-select v-model="form[item.prop]" multiple filterable allow-create default-first-option placeholder="请选择">
                  <el-option
                    v-for="item_ in item.options"
                    :key="item_.value"
                    :label="item_.label"
                    :value="item_.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-else-if="item.type == 'img'" :key="item.prop" :label="item.label" :prop="item.prop">
                <el-input v-model="form[item.prop]" />
              </el-form-item>
              <el-form-item v-else :key="item.label" :label="item.label" :prop="item.prop">
                <el-input v-model="form[item.prop]" :disabled="item.disable" />
              </el-form-item>

            </template>

            <el-form-item label="">
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

      row-key="id"
      lazy
      :load="Menu_load"
      show-overflow-tooltip
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @sort-change="sortChange"
    >
      <el-table-column type="index" label="#" />
      <template v-for="item in columnJson">

        <el-table-column v-if="item.type && item.type == 'tag'" :key="item.label" :label="item.label">
          <template slot-scope="scope">
            <el-tag v-for="tag in scope.row[item.prop]" :key="tag" size="mini" style="margin-right: 4px;">{{ tag }}</el-tag>
          </template>
        </el-table-column>

        <template v-else>
          <el-table-column v-if="item.formatter" :key="item.label" :label="item.label" :prop="item.prop" :formatter="formatter" />
          <el-table-column v-else :key="item.lalel" :prop="item.prop" :label="item.label" :width="item.width" />
        </template>

      </template>

      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button icon="detel" size="mini" @click="editById(scope.row)">编辑</el-button>
          <el-button icon="detel" size="mini" @click="delById(scope.row.id)">删除</el-button>
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
import { fetchList, UpdateById, deleteById } from '@/api/index'
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
        table: 'admin_portal_menu',
        where: {}
      },
      where: {

      },
      columnJson: [
        // { prop: 'id', label: 'id' },
        { prop: 'title', label: 'title' },
        { prop: 'sort_num', label: 'sort_num', formatter: 'sort_num' },
        { prop: 'orders', label: 'orders', width: '65px' },
        { prop: 'redirect', label: 'redirect' },
        { prop: 'component', label: 'component', width: '400px' },
        { prop: 'path', label: '路径' },
        { prop: 'icon', label: 'icon' }
        // { prop: 'assign_admin_roles', label: '角色', type:'tag' },
        // { prop: 'name', label: '名称' },
        // { prop: 'hidden', label: '隐藏' }
      ],
      downloadLoading: false,
      drawer: false,
      form: {

      },
      formJson: [
        { label: 'title', prop: 'title' },
        { label: 'name', prop: 'name' },
        { label: 'sort_num', prop: 'sort_num', type: 'select', options: [{ title: '1级菜单', id: 1 }, { title: '2级菜单', id: 2 }] },
        { label: 'parent_id', prop: 'parent_id', type: 'select', options: [] },
        { label: 'orders', prop: 'orders' },
        { label: 'hasChildren', prop: 'hasChildren' },
        { label: 'redirect', prop: 'redirect' },
        { label: 'component', prop: 'component' },
        { label: 'icon', prop: 'icon' },
        { label: 'path', prop: 'path' },
        { label: '角色', prop: 'assign_admin_roles', type: 'selects', options: [
          { label: 'admin', value: 'admin' },
          { label: 'jindu', value: 'jindu' },
          { label: 'fibrpro-admin', value: 'fibrpro-admin' },
          { label: 'fibrpro-user', value: 'fibrpro-user' },
          { label: 'fibrpro-agent', value: 'fibrpro-agent' },
          { label: 'ti', value: 'ti' },
          { label: 'ipodsz', value: 'ipodsz' },
          { label: 'telegram', value: 'telegram' }
        ] },
        { label: 'hidden', prop: 'hidden' }

      ],
      button_name: '新增人员',
      editedId: '',
      username: '',
      fristMeun: []
    }
  },
  created() {
    this.username = getName()
    this.getList()
    this.getFirstMenu()
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
    formatter(row, column, cellValue) {
      console.log('formatter', 'row', row.sort_num, 'column', column.label, 'cellValue', cellValue)
      if (column.label == 'sort_num') {
        const menu = { '1': '一级菜单', '2': '二级菜单' }
        return menu[row.sort_num]
      }
    },
    getList() {
      this.listLoading = true
      // 需要搜索的部分格式化

      console.log('where', this.where)
      this.where.sort_num = 1

      this.listQuery.where = JSON.stringify(this.where)
      this.listQuery.order = 'orders ASC'

      console.log('listQuery', this.listQuery)
      fetchList(this.listQuery).then(response => {
        console.log('取参数', response.data)

        this.list = response.data.data
        this.total = response.data.count

        for (var i = 0; i < this.list.length; i++) {
          console.log('i=>', i, this.list[i].assign_admin_roles)
          console.log('i=>', i, JSON.parse(this.list[i].assign_admin_roles))
          this.list[i].assign_admin_roles = JSON.parse(this.list[i].assign_admin_roles)
        }

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getFirstMenu() {
      const where = {
        sort_num: 1
      }
      const postData = {
        page: 1,
        size: 99,
        table: 'admin_portal_menu',
        where: JSON.stringify(where)
      }
      fetchList(postData).then(response => {
        console.log('取菜单', response.data)
        this.fristMeun = response.data.data

        this.formJson[3]['options'] = this.fristMeun
        console.log('fristMeun', this.fristMeun)
        console.log('formJson', this.formJson)
      })
    },
    Menu_load(tree, treeNode, resolve) {
      console.log('tree', tree, treeNode, resolve)
      setTimeout(() => {
        const data = {
          size: 99,
          page: 1,
          table: 'admin_portal_menu',
          where: JSON.stringify({ parent_id: tree.id })
        }
        fetchList(data).then(response => {
          console.log('取2级菜单', response.data)
          const data = response.data.data
          for (var i = 0; i < data.length; i++) {
            console.log('i=>', i, data[i].assign_admin_roles)
            console.log('i=>', i, JSON.parse(data[i].assign_admin_roles))
            data[i].assign_admin_roles = JSON.parse(data[i].assign_admin_roles)
          }
          resolve(data)
        })
      }, 200)
    },
    delById(id) {
      this.listLoading = true
      const postdata = {
        id: id,
        table: 'admin_portal_menu'
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
      this.form.assign_admin_roles = JSON.stringify(this.form.assign_admin_roles)
      var postdata = {
        id: this.editedId,
        arr: JSON.stringify(this.form),
        table: 'admin_portal_menu'
      }
      UpdateById(postdata).then(response => {
        console.log('更新接口', response)

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
      this.form.id = ''
      this.drawer = true
    },
    editById(row) {
      this.form = row
      this.editedId = row.id
      this.button_name = '更新信息'
      this.drawer = true
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
