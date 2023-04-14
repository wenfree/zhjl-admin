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

                <el-table-column v-else :key="item.lalel" :prop="item.prop" :label="item.label" :show-overflow-tooltip="true"/>
            </template>

            <el-table-column width="180">
                <template slot-scope="scope">
                    <el-button icon="detel" @click="generate(scope.row)">导出</el-button>
                    <el-button icon="detel" @click="edit(scope.row)">编辑</el-button>
                    <!-- <el-button icon="detel" @click="delById(scope.row.id)">删除</el-button> -->
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
            class="formDrawer"
            >
            <el-main class="price-box">
                <el-form ref="form" class="formWarp" :model="form" label-width="160px">

<el-row :gutter="20">
    <el-col :span="12">
        <el-form-item label="File Name：">
            <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Proposal/Project：">
            <el-radio v-model="form.pj" label="MPP" @change="changeLast">MPP</el-radio>
            <el-radio v-model="form.pj" label="MPJ" @change="changeLast">MPJ</el-radio>
        </el-form-item>

        <el-form-item label="Year：">
            <el-input v-model="form.year" placeholder="" @change="changeLast"></el-input>
        </el-form-item>

        <el-form-item label="Project Name：">
            <el-input v-model="form.project" placeholder="" @change="changeLast"></el-input>
        </el-form-item>

        <el-form-item label="Drafting Person：">
            <el-checkbox-group v-model="form.who" @change="changeLast">
                <el-checkbox label="ET"></el-checkbox>
                <el-checkbox label="TW"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Letter No.：">
            <el-input v-model="form.l" placeholder="" @change="changeLast"></el-input>
        </el-form-item>

        <el-form-item label="Corroleation：">
            <el-radio v-model="form.last" label="R" @change="changeLast">R</el-radio>
            <el-radio v-model="form.last" label="R1" @change="changeLast">R1</el-radio>
            <el-radio v-model="form.last" label="R2" @change="changeLast">R2</el-radio>
            <el-radio v-model="form.last" label="R3" @change="changeLast">R3</el-radio>
            <el-radio v-model="form.last" label="other" @change="changeLast">other</el-radio>
        </el-form-item>

        <el-form-item label="Customer Name：">
            <el-input v-model="form.companyname"></el-input>
        </el-form-item>

        <el-form-item label="Customer Address：">
            <el-input v-model="form.companyaddress"></el-input>
        </el-form-item>

        <el-form-item label="Phone No.:">
            <el-input v-model="form.companyphone"></el-input>
        </el-form-item>

        <el-form-item label="Fax No.:">
            <el-input v-model="form.companyfax"></el-input>
        </el-form-item>

        <el-form-item label="Atten: ">
            <el-radio v-model="form.sexTtitle" v-for="item in AttnJson" :label="item.label" :key="item.label" @change="sexChange">{{item.label}}</el-radio>
        </el-form-item>

        <el-form-item label="Attn. Name: ">
            <el-input v-model="form.attn"></el-input>
        </el-form-item>


        <el-form-item label="Subject: ">
            Quotation of the<el-input v-model="form.title" style="width: 120px;"></el-input>
            For<el-input v-model="form.desc" style="width: 120px;"></el-input>
        </el-form-item>

        <el-form-item label="Scope: ">
            <el-checkbox-group v-model="form.todo" >
                <el-checkbox v-for="item in todoJson" :label="item.label" :key="item.label"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <!-- 新按钮 -->
        <el-form-item label="PRODUCT：">

            <el-tag style="margin-right: 3px;"
                v-for="(tag,index) in form.product"
                :key="tag.model"
                closable
                @close="handleClose(index)">
                {{tag.model}}
            </el-tag>

            <div class="products">
                <div v-for="(item, index) in product" :key="index">
                    <div v-if="item.Category" class="product_title">{{ item.Category }}</div>
                    <div class="product_title_span">{{ item.label }}</div>
                    <span v-for="buttons in item.options" :key="buttons.model" style="margin-right: 5px;">
                        <el-button type="primary" size="mini" @click="addProducts(buttons)">{{ buttons.model }}</el-button>
                    </span>
                </div>
            </div>
        </el-form-item>

        <el-form-item v-for="(pr, index) in form.product" :label="pr.model + '：'" :key="index">
            <el-form-item label="Qty.">
                <el-input v-model="pr.acount" placeholder="請輸入數量" @change="ProductPrice(index)" ></el-input>
            </el-form-item>
            <el-form-item label="Length">
                <el-radio v-model="pr.opration.lenght" v-for="item in pr.lenght" :label="item" :key="item">{{ item }}</el-radio>
            </el-form-item>
            <el-form-item label="Width">
                <el-input v-model="pr.opration.width"></el-input>
            </el-form-item>
            <el-form-item label="Thickness">
                <el-radio v-model="pr.opration.thinkness" v-for="item in pr.thinkness" :label="item" :key="item">{{ item }}</el-radio>
            </el-form-item>
            <el-form-item label="color">
                <el-input v-model="pr.opration.color"></el-input>
            </el-form-item>
            <el-form-item label="slip">
                <el-radio v-model="pr.opration.slip" v-for="item in slipJson" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
            </el-form-item>
            <el-form-item label="Max. Span">
                <el-input v-model="pr.opration.max"></el-input>
            </el-form-item>
            <el-form-item label="Loading Level">
                <el-radio v-model="pr.opration.level" v-for="item in levelJson" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
            </el-form-item>
            <el-form-item label="Price">
                {{ pr.price }}
            </el-form-item>
            <el-form-item label="Total">
                {{ pr.productTotal }}
            </el-form-item>
        </el-form-item>

        <el-form-item label="PRODUCT Total：">
            {{form.productTotal}}
        </el-form-item>

    </el-col>

    <el-col :span="8">
        <el-form-item label="Our Ref Date：">
            <el-input v-model="form.ref_date"></el-input>
        </el-form-item> 
        <el-form-item label="By Email：">
            <el-checkbox-group v-model="form.sendtype" >
                <el-checkbox v-for="item in sendTypeJson" :label="item.label" :key="item.label"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Mold Charge">
            <el-switch
                v-model="form.mold_charge"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
        
            <template v-if="form.mold_charge">
                <el-form-item label="Qty." style="margin-bottom: 5px;">
                    <el-input v-model="form.mold_charge_qty"></el-input>
                </el-form-item>
                <el-form-item label="Unit Rate" style="margin-bottom: 5px;">
                    <el-input v-model="form.mold_charge_price"></el-input>
                </el-form-item>
                <el-form-item label="Total Mold Charge">
                    <el-input v-model="form.mold_charge_total"></el-input>
                </el-form-item>
            </template>
        </el-form-item>

        <el-form-item label="Delivery Trip Qty.：">
            <el-input type="text" v-model="form.trip"></el-input>
        </el-form-item>
        <el-form-item label="Delivery Trip Rate：">
            <el-input type="text" v-model="form.tripPrice" @change="tripPrice()"></el-input>
        </el-form-item>
        <el-form-item label="Total Delivery Charge：">
            {{form.tripTatal}}
        </el-form-item>
        <el-form-item label="Amount：">
            {{form.amount}}
        </el-form-item>
        <el-form-item label="Deposit at 25-100%：">
            <el-input type="text" v-model="form.rate"></el-input>
        </el-form-item>

        <el-form-item label="">
            <el-button :loading="downloadLoading" type="success" icon="el-icon-plus" class="filter-item"
                    @click="addPirceInsert">
                    新增报价单
                </el-button>
        </el-form-item>
    </el-col>
</el-row>




</el-form>
            </el-main>
        </el-drawer>
    </div>
</template>

<script>
import { fetchList, deleteById, fetchPv, PriceInsert, updateArticle } from '@/api/fibrpro'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getName, getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Edit from '../example/edit.vue'
import 'docxtemplater/build/docxtemplater.js'
import 'pizzip/dist/pizzip.js'
import 'pizzip/dist/pizzip-utils.js'
import 'file-saver'


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
                name:"",
                ref: "",
                ref_date: "",
                date_txt: "",
                companyfax: "",
                attn: "",
                sex: "",
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
                rate:50,
                mold_charge_qty: 0,
                mold_charge_price: 0,
            },
            product: [
                {
                    Category: "PEDESTRIAN",
                    label: "STANDARD PRODUCT",
                    options: [
                        { model: "FPS-001", lenght: [500,600], width: '200', thinkness: [25,30,40],  hk: 620 },
                        { model: "FPS-002", lenght: [500,600], width: '300', thinkness: [25,30,40],  hk: 660 },
                        { model: "FPS-003", lenght: [500,600], width: '400', thinkness: [25,30,40],  hk: 700 },
                        { model: "FPS-004", lenght: [500,600], width: '500', thinkness: [30,40,50],  hk: 760 },
                        { model: "FPS-005", lenght: [500,600], width: '600', thinkness: [40,50,60],  hk: 850 },
                    ]
                },
                {
                    label: "CUSTOMER MADE PRODUCT",
                    options: [
                        { model: "FPC-001", lenght: [500,600], width: '200', thinkness: [25,30,40],  hk: 680 },
                        { model: "FPC-002", lenght: [500,600], width: '300', thinkness: [25,30,40],  hk: 720 },
                        { model: "FPC-003", lenght: [500,600], width: '400', thinkness: [25,30,40],  hk: 800 },
                        { model: "FPC-004", lenght: [500,600], width: '500', thinkness: [30,40,50],  hk: 880 },
                        { model: "FPC-005", lenght: [500,600], width: '600', thinkness: [40,50,60],  hk: 980 },
                    ]
                },
                {
                    Category: "LIGHT VEHICLE DRIVEWAY",
                    label: "STANDARD PRODUCT",
                    options: [
                        { model: "FLS-001", lenght: [500,600], width: '200', thinkness: [40,50,60],  hk: 800 },
                        { model: "FLS-002", lenght: [500,600], width: '300', thinkness: [40,50,60],  hk: 950 },
                        { model: "FLS-003", lenght: [500,600], width: '400', thinkness: [40,50,60],  hk: 1100 },
                        { model: "FLS-004", lenght: [500,600], width: '500', thinkness: [40,50,60],  hk: 1300 },
                        { model: "FLS-005", lenght: [500,600], width: '600', thinkness: [40,50,60],  hk: 1500 },
                    ]
                },
                {
                    label: "CUSTOMER MADE PRODUCT",
                    options: [
                        { model: "FLC-001", lenght: [500,600], width: '200', thinkness: [40,50,60],  hk: 1000 },
                        { model: "FLC-002", lenght: [500,600], width: '300', thinkness: [40,50,60],  hk: 1150 },
                        { model: "FLC-003", lenght: [500,600], width: '400', thinkness: [40,50,60],  hk: 1300 },
                        { model: "FLC-004", lenght: [500,600], width: '500', thinkness: [40,50,60],  hk: 1500 },
                        { model: "FLC-005", lenght: [500,600], width: '600', thinkness: [40,50,60],  hk: 1700 },
                    ]
                },
                {
                    Category: "E.V.A/HEAVY VEHICLE CARRIAGEWAY",
                    label: "STANDARD PRODUCT",
                    options: [
                        { model: "FHS-001", lenght: [500,600], width: '200', thinkness: [50,60,70], hk: 1600,  },
                        { model: "FHS-002", lenght: [500,600], width: '300', thinkness: [60,70,80], hk: 1900,  },
                        { model: "FHS-003", lenght: [500,600], width: '400', thinkness: [70,80,90], hk: 2400,  },
                        { model: "FHS-004", lenght: [500,600], width: '500', thinkness: [90,100,110], hk: 2900,  },
                        { model: "FHS-005", lenght: [500,600], width: '600', thinkness: [100,110,120], hk: 3500,  },
                    ]
                },
                {
                    label: "CUSTOMER MADE PRODUCT",
                    options: [
                        { model: "FHC-001", lenght: [500,600], width: '200', thinkness: [50,60,70], hk: 1900,  },
                        { model: "FHC-002", lenght: [500,600], width: '300', thinkness: [60,70,80], hk: 2300,  },
                        { model: "FHC-003", lenght: [500,600], width: '400', thinkness: [70,80,90], hk: 2800,  },
                        { model: "FHC-004", lenght: [500,600], width: '500', thinkness: [90,100,110], hk: 3400,  },
                        { model: "FHC-005", lenght: [500,600], width: '600', thinkness: [100,110,120], hk: 4000,  },
                    ]
                },
            ],
            sendTypeJson: [
                { value: 'Email', label: 'Email' },
                { value: 'Fax', label: 'Fax' },
                { value: 'Post', label: 'Post' },
                { value: 'Courier', label: 'Courier' },
                { value: 'Registerred', label: 'Registerred Post' },
                { value: 'Hand', label: 'Hand' },
            ],
            AttnJson: [
                { value: 'Mr.', label: 'Mr.' },
                { value: 'Ms.', label: 'Ms.' },
                { value: 'Miss', label: 'Miss' },
                { value: 'Other', label: 'Other' },
            ],
            todoJson: [
                { value: 'Design', label: 'Design' },
                { value: 'Supply', label: 'Supply' },
                { value: 'Fabrcation', label: 'Fabrcation' },
                { value: 'Delivery', label: 'Delivery' },
                { value: 'Placement', label: 'Placement' },
                { value: 'Installation', label: 'Installation' },
                { value: 'Modification', label: 'Modification' },
                { value: 'Rectrification', label: 'Rectrification' },
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
                { value: 'Other', label: 'Other' },
            ],
        }
    },
    watch: {
        'form.trip'(varl, var2) {
            this.totalProduct()
        },
        'form.tripPrice'(varl, var2) {
            this.totalProduct()
        },
        'form.mold_charge_qty'(varl, var2) {
            this.totalProduct()
        },
        'form.mold_charge_price'(varl, var2) {
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
                table: 'fibrpro_price'
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
            for (var i=0;i<this.form.product.length;i++){
                this.form.product[i].productTotal = this.form.product[i].acount * this.form.product[i].price
                this.form.productTotal = this.form.productTotal + this.form.product[i].productTotal
            }
            // 运输价格和次数
            var design = this.form.mold_charge_qty * this.form.mold_charge_price
            this.tripTatal = this.form.trip * this.form.tripPrice
            this.form.amount = this.form.productTotal + this.form.tripTatal + design
        },
        ProductPrice(val) {
            console.log('第几个产品输入了数量', val)
            this.form.product[val].productTotal = this.form.product[val].acount * this.form.product[val].price
            this.totalProduct()
        },
        tripPrice() {
            this.form.tripTatal = this.form.trip * this.form.tripPrice
            this.totalProduct()
        },
        changeLast() {
            if (this.form.who) {
                var who = this.form.who.join(":")
            }
            this.form.ref = this.form.pj + this.form.year + this.form.project + '/' + who + '/' + this.form.l + '/' + this.form.last
        },
        sexChange(){
            this.form.sex = this.form.sexTtitle
            if(this.form.sexTtitle == "Mr."){
                this.form.sex = 'Sir'
            }
            if(this.form.sexTtitle == "Ms." || this.form.sexTtitle == "Miss"){
                this.form.sex = 'Madam'
            }
        },
        addPirceInsert(){
            this.drawer = false
   
            // 需要搜索的部分格式化
            // this.username
            var data = {
                name: this.form.name,
                username: this.username,
                form_json: JSON.stringify(this.form),
            }

            console.log('data', data)

            PriceInsert(data).then(response => {
                console.log('保存', response)
                this.getList()
            })
        },
        addProducts(products){
            console.log('products', products)
            this.form.product.push(
                {
                    model:products.model, acount:'',productTotal:0, price:products.hk,
                    lenght: products.lenght,
                    thinkness: products.thinkness,
                    width: products.width,
                    opration:{ width: products.width, lenght: products.lenght[0], thinkness:products.thinkness[0], color:'1', slip:'R11', max: products.width - 100 ,level:'',}
                })
            console.log('this.form.product', this.form.product)
        },
        handleClose(index) {
            console.log("index", index)
            this.form.product.splice(index,1);
        },
        edit(row){
            this.drawer = true
            this.drawerTitle = '编辑报价单'
            this.form = JSON.parse(row.form_json)
        },
        // 导出函数
        loadFile(url, callback) {
            PizZipUtils.getBinaryContent(url, callback);
        },
        generate(val) {
            console.log('准备导出', val)
            var wordData = JSON.parse(val.form_json)
            console.log('wordData', wordData)
            if (wordData.companyphone) {
                wordData.companyphone = "Telephone No.:" + wordData.companyphone
            }
            if (wordData.companyfax) {
                wordData.companyfax = "Fax No.:" + wordData.companyfax
            }

            var that = this;
            this.loadFile("@/assets/static/word.docx", function (error, content) {
            if (error) {
                throw error
            };
            var zip = new PizZip(content);
            var doc = new window.docxtemplater().loadZip(zip)
            doc.setData({
                ...wordData
            });
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render()
            } catch (error) {
                var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
                }
                console.log(JSON.stringify({
                error: e
                }));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }
            var out = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                }) //Output the document using Data-URI
                saveAs(out, "output.docx")
            })
        },
    }
}
</script>
<style scoped>
.price-box{
    overflow-y: scroll;
    height: 900px;
}
.product_title_span{
    margin: 0px;
    padding: 0px;
    font-size: 12px;
    line-height: 14px;
}
</style>