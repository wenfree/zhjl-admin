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
                        style="width: 160px;margin-right: 5px;" class="filter-item"
                        >
                    </el-date-picker>
                </template>

                <template v-else-if="item.type == 'time'">
                    <el-date-picker
                        :key="index"
                        v-model="where[item.prop]"
                        type="datetime"
                        :placeholder="item.placeholder"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 260px;margin-right: 5px;" class="filter-item"
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

            <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-document" class="filter-item"
                @click="handleDownload">
                导出数据
            </el-button>

            <el-button :loading="downloadLoading" type="success" icon="el-icon-plus" class="filter-item"
                @click="addprice">
                新增报价单
            </el-button>
        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
            @sort-change="sortChange">
            <el-table-column type="index">#</el-table-column>
            <template v-for="item in columnJson">
                <el-table-column v-if="item.type && item.type == 'img'" :key="item.label" :label="item.label">
                    <template slot-scope="scope">
                        <!-- {{ scope.row.signature }} -->
                        <el-image :src="scope.row.signature" fit="fit" />
                    </template>
                </el-table-column>

                <el-table-column v-else :key="item.lalel" :prop="item.prop" :label="item.label" />
            </template>

            <el-table-column>
                <template slot-scope="scope">
                    <el-button icon="detel" @click="delById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
            @pagination="getList" :page-sizes="[20, 100, 200, 300, 400, 500, 1000, 5000, 10000]" />

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer"
            direction="ltr"
            size="85%"
            >
            <el-main class="price-box">
                <el-form ref="form" :model="form" label-width="120px">

<el-row :gutter="20">
    <el-col :span="10">
        <!-- <el-form-item label="Our Ref：">
            <el-input v-model="form.ref" :disabled="true" @change="changeLast"></el-input>
        </el-form-item> -->

        <el-form-item label="p-j：">
            <el-radio v-model="form.pj" label="MPP" @change="changeLast">MPP</el-radio>
            <el-radio v-model="form.pj" label="MPJ" @change="changeLast">MPJ</el-radio>
        </el-form-item>

        <el-form-item label="Year：">
            <el-input v-model="form.year" placeholder="" @change="changeLast"></el-input>
        </el-form-item>

        <el-form-item label="Project：">
            <el-input v-model="form.project" placeholder="" @change="changeLast"></el-input>
        </el-form-item>

        <el-form-item label="Who：">
            <el-checkbox-group v-model="form.who" @change="changeLast">
                <el-checkbox label="ET"></el-checkbox>
                <el-checkbox label="TW"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="L id：">
            <el-input v-model="form.l" placeholder="" @change="changeLast"></el-input>
        </el-form-item>

        <el-form-item label="LAST：">
            <el-radio v-model="form.last" label="F" @change="changeLast">F</el-radio>
            <el-radio v-model="form.last" label="P" @change="changeLast">P</el-radio>
        </el-form-item>

        <el-form-item label="CM Name：">
            <el-input v-model="form.companyname"></el-input>
        </el-form-item>

        <el-form-item label="CM Address：">
            <el-input v-model="form.companyaddress"></el-input>
        </el-form-item>

        <el-form-item label="CM phone:">
            <el-input v-model="form.companyphone"></el-input>
        </el-form-item>

        <el-form-item label="CM far:">
            <el-input v-model="form.companyfar"></el-input>
        </el-form-item>

        <el-form-item label="Attn: ">
            <el-radio v-model="form.sexTtitle" v-for="item in AttnJson" :label="item.label" :key="item.label">{{item.label}}</el-radio>
        </el-form-item>

        <el-form-item label="cient Name: ">
            <el-input v-model="form.attn"></el-input>
        </el-form-item>


        <el-form-item label="Title:">
            Quotation of the<el-input v-model="form.title" style="width: 120px;"></el-input>
            For<el-input v-model="form.project" style="width: 120px;"></el-input>
        </el-form-item>

        <el-form-item label="委托任务">
            <el-checkbox-group v-model="form.todo" >
                <el-checkbox v-for="item in todoJson" :label="item.label" :key="item.label"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Product：">
            <el-select v-model="form.product" multiple placeholder="請選擇" style="width: 100%;">
                <el-option-group v-for="item in product" :key="item.label" :label="item.label">
                    <el-option v-for="row in item.options" :key="row.model" :label="row.model"
                        :value="row.model">
                        <span style="float: left">{{ row.model }}</span>
                        <span style="float: left; margin-left: 16px;color: #bb9f43;">{{
                            row.lenght }}</span>
                        <span style="float: left; margin-left: 16px;color: #bb9f43;">{{
                            row.width }}</span>
                        <span style="float: left; margin-left: 16px;color: #bb9f43;">{{
                            row.thinkness}}</span>
                        <span style="float: right; color: #b65e9c; font-size: 13px">{{ row.hk
                            }}</span>
                    </el-option>
                </el-option-group>
            </el-select>
        </el-form-item>

        <el-form-item v-for="item in form.product" :label="item + '：'">
            <el-input v-model="qty[item]" placeholder="請輸入數量"
                @change="ProductPrice(item)" :key="item.label"></el-input>

            <el-form-item label="规格">
                <el-radio v-model="form.size" v-for="item in sizeJson" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
            </el-form-item>
            <el-form-item label="Thickness">
                <el-radio v-model="form.Thickness" v-for="item in thickJson" :label="item.value" >{{ item.label }}</el-radio>
            </el-form-item>
            <el-form-item label="color">
                <el-input v-model="form.color"></el-input>
            </el-form-item>
            <el-form-item label="slip">
                <el-radio v-model="form.slip" v-for="item in slipJson" :label="item.value" >{{ item.label }}</el-radio>
            </el-form-item>
            <el-form-item label="max">
                <el-input v-model="form.max"></el-input>
            </el-form-item>
            <el-form-item label="loading level">
                <el-radio v-model="form.level" v-for="item in levelJson" :label="item.value" >{{ item.label }}</el-radio>
            </el-form-item>
        </el-form-item>

        <el-form-item label="productTotal：">
            {{form.productTotal}}
        </el-form-item>

    </el-col>

    <el-col :span="6">
        <el-form-item label="Our Ref Date：">
            <el-input v-model="form.ref_date"></el-input>
        </el-form-item>
        <el-form-item label="By Email：">
            <el-checkbox-group v-model="form.sendtype" >
                <el-checkbox v-for="item in sendTypeJson" :label="item.label"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Mold Charge">
            <el-switch
                v-model="form.mold_charge"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
        
            <template v-if="form.mold_charge">
                <el-form-item label="qty" style="margin-bottom: 5px;">
                    <el-input v-model="form.mold_charge_qty"></el-input>
                </el-form-item>
                <el-form-item label="price">
                    <el-input v-model="form.mold_charge_price"></el-input>
                </el-form-item>
            </template>
   
        </el-form-item>

 


        <el-form-item label="trip：">
            <el-input type="text" v-model="form.trip"></el-input>
        </el-form-item>
        <el-form-item label="try Price：">
            <el-input type="text" v-model="form.tripPrice" @change="tripPrice()"></el-input>
        </el-form-item>
        <el-form-item label="tripTatal：">
            {{form.tripTatal}}
        </el-form-item>
        <el-form-item label="Amount：">
            {{form.amount}}
        </el-form-item>
    </el-col>
</el-row>




</el-form>
            </el-main>
        </el-drawer>
    </div>
</template>

<script>
import { fetchList, deleteById, fetchPv, createArticle, updateArticle } from '@/api/ipods'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getName, getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
    name: 'price',
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
                table: 'fibrpro_price',
                where: {}
            },
            where: {
                
            },
            columnJson: [
                { prop: 'id', label: 'id' },
                { prop: 'name', label: '名称' },
                { prop: 'form_json', label: '表单内容' },
                { prop: 'date', label: '日期' },
                { prop: 'receipt1', label: '收据1' },
                { prop: 'receipt2', label: '收据2' },
                { prop: 'send_state', label: '发送状态' },
            ],
            whereJson: [
                { prop: 'date', placeholder: '选择日期', type:'date' },
                { prop: 'name', placeholder: 'name' },       
            ],
            downloadLoading: false,
            drawer: false,
            drawerTitle: "新增报价单",
            form: {
                ref: '',
                ref_date: '',
                date_txt: '',
                attn: "",
                dear_txt: "",
                product: [],
                trip: 1,
                tripPrice: 0,
                tripTatal: 0,
                productTotal: 0,
                amount: 0,
                who: [],
                year: 23,
                sendtype: [],
                sexTtitle: [],
                todo: [],
            },
            product: [
                {
                    label: "PEDESTRIAN STANDARD PRODUCT",
                    options: [
                        { model: "FPS-001", lenght: '500/600', width: '200', thinkness: '25/30/40', drain: '', hk: 620 },
                        { model: "FPS-002", lenght: '500/600', width: '300', thinkness: '25/30/40', drain: 'Square Hole', hk: 660 },
                        { model: "FPS-003", lenght: '500/600', width: '400', thinkness: '25/30/40', drain: 'Round Hole', hk: 700 },
                        { model: "FPS-004", lenght: '500/600', width: '500', thinkness: '30/40/50', drain: 'Double Slot', hk: 760 },
                        { model: "FPS-005", lenght: '500/600', width: '600', thinkness: '40/50/60', drain: 'Single Slot', hk: 850 },
                    ]
                },
                {
                    label: "PEDESTRIAN CUSTOMER MADE PRODUCT",
                    options: [
                        { model: "FPC-001", lenght: '500/600', width: '200', thinkness: '25/30/40', drain: '', hk: 680 },
                        { model: "FPC-002", lenght: '500/600', width: '300', thinkness: '25/30/40', drain: 'Tailored', hk: 720 },
                        { model: "FPC-003", lenght: '500/600', width: '400', thinkness: '25/30/40', drain: 'To', hk: 800 },
                        { model: "FPC-004", lenght: '500/600', width: '500', thinkness: '30/40/50', drain: 'Selection', hk: 880 },
                        { model: "FPC-005", lenght: '500/600', width: '600', thinkness: '40/50/60', drain: '', hk: 980 },
                    ]
                },
                {
                    label: "LIGHT VEHICLE DRIVE WAY STANDARD PRODUCT",
                    options: [
                        { model: "FLS-001", lenght: '500/600', width: '200', thinkness: '40/50/60', drain: '', hk: 800 },
                        { model: "FLS-002", lenght: '500/600', width: '300', thinkness: '40/50/60', drain: 'Square Hole', hk: 950 },
                        { model: "FLS-003", lenght: '500/600', width: '400', thinkness: '40/50/60', drain: 'Round Hole', hk: 1100 },
                        { model: "FLS-004", lenght: '500/600', width: '500', thinkness: '40/50/60', drain: 'Double Slot', hk: 1300 },
                        { model: "FLS-005", lenght: '500/600', width: '600', thinkness: '40/50/60', drain: 'Single Slot', hk: 1500 },
                    ]
                },
                {
                    label: "LIGHT VEHICLE DRIVE WAY CUSTOMER MADE PRODUCT",
                    options: [
                        { model: "FLC-001", lenght: '500/600', width: '200', thinkness: '40/50/60', drain: '', hk: 1000 },
                        { model: "FLC-002", lenght: '500/600', width: '300', thinkness: '40/50/60', drain: 'Tailored', hk: 1150 },
                        { model: "FLC-003", lenght: '500/600', width: '400', thinkness: '40/50/60', drain: 'to', hk: 1300 },
                        { model: "FLC-004", lenght: '500/600', width: '500', thinkness: '40/50/60', drain: 'Selection', hk: 1500 },
                        { model: "FLC-005", lenght: '500/600', width: '600', thinkness: '40/50/60', drain: '', hk: 1700 },
                    ]
                },
                {
                    label: "E.V.A/HEAVY VEHICLE CARRIAGEWAY STANDARD PRODUCT",
                    options: [
                        { model: "FHS-001", lenght: '500/600', width: '200', thinkness: '50/60/70', hk: 1600, drain: '' },
                        { model: "FHS-002", lenght: '500/600', width: '300', thinkness: '60/70/80', hk: 1900, drain: 'Square Hole' },
                        { model: "FHS-003", lenght: '500/600', width: '400', thinkness: '70/80/90', hk: 2400, drain: 'Round Hole' },
                        { model: "FHS-004", lenght: '500/600', width: '500', thinkness: '90/100/110', hk: 2900, drain: 'Double Slot' },
                        { model: "FHS-005", lenght: '500/600', width: '600', thinkness: '100/110/120', hk: 3500, drain: 'Single Slot' },
                    ]
                },
                {
                    label: "E.V.A/HEAVY VEHICLE CARRIAGEWAY CUSTOMER MADE PRODUCT",
                    options: [
                        { model: "FHC-001", lenght: '500/600', width: '200', thinkness: '50/60/70', hk: 1900, drain: '' },
                        { model: "FHC-002", lenght: '500/600', width: '300', thinkness: '60/70/80', hk: 2300, drain: 'Tailored' },
                        { model: "FHC-003", lenght: '500/600', width: '400', thinkness: '70/80/90', hk: 2800, drain: 'to' },
                        { model: "FHC-004", lenght: '500/600', width: '500', thinkness: '90/100/110', hk: 3400, drain: 'Selection' },
                        { model: "FHC-005", lenght: '500/600', width: '600', thinkness: '100/110/120', hk: 4000, drain: '' },
                    ]
                },
            ],
            qty: {},
            amount: 0,
            price_list: {
                "FPS-001": 620,
                "FPS-002": 660,
                "FPS-003": 700,
                "FPS-004": 760,
                "FPS-005": 850,
                "FPC-001": 680,
                "FPC-002": 720,
                "FPC-003": 800,
                "FPC-004": 880,
                "FPC-005": 980,
                "FLS-001": 800,
                "FLS-002": 950,
                "FLS-003": 1100,
                "FLS-004": 1300,
                "FLS-005": 1500,
                "FLC-001": 1000,
                "FLC-002": 1150,
                "FLC-003": 1300,
                "FLC-004": 1500,
                "FLC-005": 1700,
                "FHS-001": 1600,
                "FHS-002": 1900,
                "FHS-003": 2400,
                "FHS-004": 2900,
                "FHS-005": 3500,
                "FHC-001": 1900,
                "FHC-002": 2300,
                "FHC-003": 2800,
                "FHC-004": 3400,
                "FHC-005": 4000,
            },
            sendTypeJson: [
                { value: 'email', label: 'email' },
                { value: 'far', label: 'far' },
                { value: 'post', label: 'post' },
                { value: 'carier', label: 'carier' },
                { value: 'posted', label: 'posted' },
                { value: 'hand', label: 'hand' },
            ],
            AttnJson: [
                { value: 'Ms', label: 'Ms' },
                { value: 'Miss', label: 'Miss' },
                { value: 'Sir', label: 'Sir' },
            ],
            todoJson: [
                { value: 'design', label: 'design' },
                { value: 'supply', label: 'supply' },
                { value: 'process', label: 'process' },
                { value: 'transport', label: 'transport' },
                { value: 'fix', label: 'fix' },
            ],
            sizeJson: [
                { value: '400', label: '400' },
                { value: '500', label: '500' },
                { value: '600', label: '600' },
            ],
            thickJson: [
                { value: '25', label: '25' },
                { value: '30', label: '30' },
                { value: '40', label: '40' },
                { value: '50', label: '50' },
            ],
            slipJson: [
                { value: 'R11', label: 'R11' },
                { value: 'R12', label: 'R12' },
            ],
            levelJson: [
                { value: '5KN', label: '5KN' },
                { value: 'A15(15KN)', label: 'A15(15KN)' },
                { value: '60KN', label: '60KN' },
                { value: 'B125(125KN)', label: 'B125(125KN)' },
                { value: 'C250(250KN)', label: 'C250(250KN)' },
                { value: 'D400(400KN)', label: 'D400(400KN)' },
            ],
        }
    },
    watch: {
        'form.product'(val1, val2) {
            console.log('form.product', val1, val2)
            for (let k in this.qty) {
                if (val1.indexOf(k) < 0) { console.log(k, '不在表里', delete this.qty[k]) }
            }
        },
        deep: true,
        qty: {
            handler(val1, val2) {
                console.log('计算一次价格', val1, val2)
            }
        },
        deep: true,
        'form.trip'(varl, var2) {
            this.totalProduct()
        },
        'form.tripPrice'(varl, var2) {
            this.totalProduct()
        }
    },
    created() {
        var monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ]
        var date = new Date()
        this.form.ref_date = date.getDate() + ' ' + monthNames[date.getMonth()+12] + ' ' + date.getFullYear()

        this.username = getName()
        if ( this.username == 'wenfree' ) {
            this.username = ''
        }
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            // 需要搜索的部分格式化
            this.where.username = this.username

            console.log('where', this.where)
            this.listQuery.where = JSON.stringify(this.where)
            fetchList(this.listQuery).then(response => {
                console.log('取参数', response.data)

                this.list = response.data.data
                this.total = response.data.count

                // Just to simulate the time of the request
                setTimeout(() => {
                    this.listLoading = false
                }, 0.5 * 1000)
            })
        },
        delById(id) {
            this.listLoading = true
            const postdata = {
                id: id,
                table: 'ipods_list_sz'
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
        addprice(){
            this.drawer = true
        },
        totalProduct() {
            this.form.productTotal = 0
            for (var key in this.qty) {
                console.log('数量', this.qty[key], '价格', this.price_list[key])
                this.form.productTotal = this.form.productTotal + this.qty[key] * this.price_list[key]
            }
            this.tripTatal = this.form.trip * this.form.tripPrice
            this.form.amount = this.form.productTotal + this.form.tripTatal
        },
        ProductPrice(item) {
            console.log('input', item, this.qty)
            if (!isNaN(parseFloat(this.qty[item]))) {
                this.qty[item] = parseFloat(this.qty[item])
            }
            this.totalProduct()
        },
        tripPrice(val) {
            this.form.tripTatal = this.form.trip * this.form.tripPrice
            this.totalProduct()
        },
        changeLast() {
            if (this.form.who) {
                who = this.form.who.join(":")
            }
            this.form.ref = this.form.pj + this.form.year + this.form.project + '/' + who + '/' + this.form.l + '/' + this.form.last
        }
    }
}
</script>
<style scoped>
.price-box{
    overflow-y: scroll;
    max-height: 700px;
    background: #ffffff;
}
</style>