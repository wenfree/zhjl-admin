<template>
    <div class="app-container">
        <div class="filter-container">

            <el-input v-for="item in whereJson" clearable v-model="where[item.prop]" :placeholder="item.placeholder"
                style="width: 160px;margin-right: 5px;" :key="item.label" class="filter-item" />

            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                查詢
            </el-button>

            <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-document" class="filter-item"
                @click="handleDownload">
                导出数据
            </el-button>
        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
            @sort-change="sortChange">
            <el-table-column type="index" label="#"></el-table-column>
            <template v-for="item in columnJson">
                <el-table-column v-if="item.type && item.type == 'img'" :key="item.label" :label="item.label">
                    <template slot-scope="scope">
                        <!-- {{ scope.row.signature }} -->
                        <el-image :src="scope.row.signature" fit="fit" />
                    </template>
                </el-table-column>

                <el-table-column v-else :key="item.lalel" :prop="item.prop" :label="item.label" />
            </template>

            <el-table-column width="240px">
                <template slot-scope="scope">
                    <el-button icon="edit" size="mini" @click="look(scope.row)">查看成员</el-button>
                    <el-button icon="edit" size="mini" @click="editById(scope.row)">编辑</el-button>
                    <el-button icon="detel" size="mini" @click="delById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
            @pagination="getList" :page-sizes="[20, 100, 200, 300, 400, 500, 1000, 5000, 10000]" />


        <el-drawer :title="drawerTitle" :visible.sync="drawer" direction="rtl" size="70%">
            <el-main>
                <el-table :key="tableKey" v-loading="listLoading" :data="groupInfo" border fit highlight-current-row
                    style="width: 100%;" @sort-change="sortChange">
                    <el-table-column type="index" label="#"></el-table-column>
                    <template v-for="item in groupInfoColumn">
                        <el-table-column v-if="item.type && item.type == 'img'" :key="item.label" :label="item.label">
                            <template slot-scope="scope">
                                <!-- {{ scope.row.signature }} -->
                                <el-image :src="scope.row.signature" fit="fit" />
                            </template>
                        </el-table-column>

                        <el-table-column v-else :key="item.lalel" :prop="item.prop" :label="item.label" />
                    </template>

                </el-table>

            </el-main>

        </el-drawer>
    </div>
</template>

<script>
import { fetchList, updateArticle } from '@/api/telegram'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getName, getToken } from '@/utils/auth'
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
                table: 'anqi_telegram_group',
                where: {}
            },
            where: {
                whos: this.username,
            },
            columnJson: [
                { prop: 'id', label: 'id' },
                { prop: 'ids', label: 'ids' },
                { prop: 'channel_id', label: '群id' },
                { prop: 'channel_username', label: '群名' },
                { prop: 'channel_title', label: '群昵称' },
                { prop: 'note', label: '备注' },
                { prop: 'update_time', label: '时间' }
            ],
            groupInfoColumn: [
                // { prop: 'id', label: 'id' },
                { prop: 'group_id', label: '群id' },
                { prop: 'group_username', label: '群名' },
                { prop: 'group_title', label: '群昵称' },
                { prop: 'group_user_id', label: '成员id' },
                { prop: 'group_user_username', label: '成员username' },
                { prop: 'group_first_name', label: '姓' },
                { prop: 'group_last_name', label: '名' },
                { prop: 'group_user_phone', label: '成员手机' },
                { prop: 'note', label: '备注' },
                { prop: 'update_time', label: '时间' }
            ],
            whereJson: [
                { prop: 'channel_title', placeholder: '昵称' },
                { prop: 'group_username', placeholder: '群名' },
                { prop: 'note', placeholder: '备注' },
            ],
            downloadLoading: false,
            username: '',
            drawer: false,
            drawerTitle: '',
            form: {

            },
            groupInfo: [],
            groupPage: {
                page: 1,
                size: 20,
                total: 0,
            },
        }
    },
    created() {
        this.getList()
        this.username = getName()
    },
    methods: {
        getList() {
            this.listLoading = true
            // 需要搜索的部分格式化
            this.listQuery.where = JSON.stringify(this.where)
            fetchList(this.listQuery).then(response => {
                console.log('取参数', response.data)



                this.list = response.data.data
                this.total = response.data.count

                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].keywords) {
                        var arrs = JSON.parse(this.list[i].keywords)
                        this.list[i].keywords = arrs.join('\n')
                    }
                }

                // Just to simulate the time of the request
                setTimeout(() => {
                    this.listLoading = false
                }, 0.2 * 1000)
            })
        },
        delById(id) {
            this.listLoading = true
            const postdata = {
                id: id,
                table: 'anqi_telegram_group'
            }

            deleteById(postdata).then(response => {
                // Just to simulate the time of the request
                setTimeout(() => {
                    this.listLoading = false
                    this.getList()
                }, 0.5 * 1000)
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
            this.drawer = false
            let postdata = {}
            postdata.table = 'anqi_telegram_group'
            postdata.id = this.form.id

            this.form.keywords = JSON.stringify(this.form.keywords.split('\n'))
            postdata.arr = JSON.stringify(this.form)

            updateArticle(postdata).then(r => {
                console.log('返回值', r.data)

                this.$notify({
                    title: 'Success',
                    message: '数据更新成功',
                    type: 'success',
                    duration: 2000
                })

                setTimeout(() => {
                    this.getList()
                }, 0.2 * 1000)

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
        getSortClass: function (key) {
            const sort = this.listQuery.sort
            return sort === `+${key}` ? 'ascending' : 'descending'
        },
        editById(row) {
            console.log(row)
            this.drawerTitle = "编辑帐号"
            this.form = row
            this.drawer = true
        },
        formatColunm(state) {
            if (state == 'id' || state == 'phone' || state == 'update_time' || state == 'keywords') {
                return false
            }
            return true
        },
        look(row) {
            console.log('准备查看群成员', row.channel_title, row.channel_id)
            this.drawer = true
            this.drawerTitle = '查看' + row.channel_title + '群成员',
                this.getGroupInfo(row.channel_id)
        },
        getGroupInfo(channel_id) {

            var postdata = {}
            postdata.table = 'anqi_telegram_group_info'
            postdata.page = 1
            postdata.size = 10
            postdata.where = JSON.stringify({ group_id: channel_id })

            fetchList(postdata).then(response => {
                console.log('取成员', response.data)
                // console.log('取参数', response)

                this.groupInfo = response.data.data
                this.groupPage.total = response.data.count


            })
        },
    }
}
</script>
