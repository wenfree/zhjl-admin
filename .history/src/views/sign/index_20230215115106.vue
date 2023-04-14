<template>
	<div class="login-container">
		<el-image style="height: 100px;" src="https://img.wenfree.cn/images/b.wenfree.cn/banner.png"
			fit="contain"></el-image>

		<el-form ref="form" :model="form" :rules="loginRules" label-width="200px" label-position="top">

			<template v-for="item in formJosn">
				<template v-if="item.type == 'input'">
					<el-form-item :label="item.label" :key="item.key">
						<el-input v-model="form[item.key]" :placeholder="item.placeholder"></el-input>
					</el-form-item>
				</template>
				<template v-if="item.type == 'input-text'">
					<el-form-item :label="item.label" :key="item.key">
						<el-input v-model="form[item.key]" type="textarea" :rows="4" :placeholder="item.placeholder">
						</el-input>
					</el-form-item>
				</template>
				<template v-if="item.type == 'select-date'">
					<el-form-item :label="item.label" :key="item.key">
						<el-date-picker v-model="form[item.key]" type="date" placeholder="選擇生日" value-format="yyyy年 MM月 dd日"
							@change="birthday_age">
						</el-date-picker>
					</el-form-item>
				</template>
				<template v-if="item.type == 'radio'">
					<el-form-item :label="item.label" :key="item.key" :class="item.class ? item.class : ''">
						<el-radio-group v-model="form[item.key]">
							<el-radio v-for="citem in item.optionItems" :label="citem.value" :key="citem.value">{{
								citem.label
							}}</el-radio>
						</el-radio-group>
					</el-form-item>
				</template>
				<template v-if="item.type == 'text'">
					<el-form-item label="" :key="item.key">
						<p style="font-size:12px;margin-top: 0px;line-height: 14px;">{{ item.label }}</p>
					</el-form-item>
				</template>
				<template v-if="item.type == 'title'">
					<el-form-item label="" :key="item.key">
						<p style="font-size:16px;margin-bottom: 0px;">{{ item.label }}</p>
					</el-form-item>
				</template>
				<template v-if="item.type == 'idcard'">
					<el-form-item :label="item.label" :key="item.key" :class="item.class ? item.class : 'noidcard'">
						<el-input v-model="form[item.key]" :placeholder="item.placeholder"></el-input> - ( <el-input
							v-model="form['idm']"></el-input> )
					</el-form-item>
				</template>

			</template>

			<XhyAutograph :config="options" @receive="receiveQmValue"></XhyAutograph>

			<el-form-item label="Date">
				<el-date-picker v-model="form['date']" type="date" placeholder="選擇日期" value-format="yyyy年 MM月 dd日">
				</el-date-picker>
			</el-form-item>

			<el-form-item label="">
				<el-checkbox v-model="agree">I already read Personal Data Collection Statement
					<p>我已閱讀收集個人資料聲明" (必選項) 請加入鏈結到整個聲明內容</p>
					<el-button type="" @click="dialogVisible = true">
						查看詳細內容
					</el-button>
				</el-checkbox>

			</el-form-item>

			<el-form-item label="">
				<el-checkbox v-model="form['msg']">I do not wish to receive any information from the MLife Human
					Resources
					Development
					Centre in relation to its activities
					or developments in the construction industry.
					<p>本人不同意日後接收由德鑄人力資源發展中心發出有關議會或學院活動和與建造業相關的資訊. (可選項)</p>
				</el-checkbox>
			</el-form-item>

			<el-form-item label="">
				<el-checkbox v-model="form['self']">報名表是否通過電郵發給自己</el-checkbox>
			</el-form-item>

			<el-form-item>
				<div class="submit" style="display:flex">
					<el-button type="primary" @click="submit()">提交報名</el-button>
				</div>
			</el-form-item>

		</el-form>


		<el-dialog title="《Personal Data Collection Statement》 《收集個人資料聲明》" :visible.sync="dialogVisible" width="95%">
			<ul>
				<li>1.The information you provide to the MLife Human Resources Development Centre (“MLife”), including
					any
					personal data as
					defined in the Personal Data (Privacy) Ordinance (the Ordinance), will be used solely for purposes
					related to
					the
					activities of the MLife.
					<br>你向德鑄人力資源發展中心〔「德鑄」〕所提供的資料，包括《個人資料〔私隱〕條例》所指的個人資料，只會用於相關德鑄之活動。
				</li>
				<li>2.MLife will disclose the personal data you have provided to Labour Department for the following
					purposes:
					<br>德鑄會將你提供的個人資料向勞工處透露，用作以下用途：
					<ul>
						<li>a.activities relating to the administration of the Occupational Safety and Health Ordinance
							and
							Factories and
							Industrial
							Undertakings Ordinance and their subsidiary regulations;
							<br>有關執行職業安全及健康條例、工廠及工業經營條例及其附例；
						</li>
						<li>b.communication regarding the course you attended; and
							<br>方便勞工處與你聯絡有關其出席的課程事宜；及
						</li>
						<li>c.carrying on relevant research and compilation of statistical data.
							<br>將有關資料用作研究及統計分析。
						</li>
					</ul>
				</li>
				<li>3.To keep you informed of MLife activities and industry developments which may be of interest, the
					MLife
					would like to
					use your personal data, including your name, phone number and correspondence and email addresses, to
					update
					you in
					relation to training courses, trade testing, registration, events and other aspects of its work and
					the
					construction
					industry.
					<br>為讓你得知最新的德鑄活動和行業內發展情況，德鑄將使用你的個人資料，包括你的姓名、電話號碼、郵寄和電郵地址，將有關訓練課程、測試、註冊、活動項目、議會或中心工作和建造業其他方面的最新資訊提供給你。
				</li>
				<li>4.The MLife will not transfer your personal data to any third parties without your prior consent.
					<br>在未得你的事先同意前，德鑄不會將你的個人資料轉移給任何第三方。
				</li>
				<li>5.It is obligatory for you to supply the MLife with complete information. The MLife may be unable to
					process
					and/or
					consider your application if you do not provide complete information. You are free to decide whether
					you wish
					to receive
					such information. If you choose not to do so, please put a “”in the box below.
					<br>你必須向德鑄提供完整的資料。如你未能提供完整的資料，德鑄或無法處理及/或考慮你的申請。你可選擇是否同意接收上述資訊。若不同意的話，請於下列有關拒收資訊一欄之空格內加上「」號。
				</li>
				<li>6.You are also entitled to request access to and correction of any errors in your personal data. If
					you wish
					to do so
					please write to the MLife at Flat A, 16/F, Wing Hong Centre, 18 Wing Hong Street, Cheung Sha Wan,
					KLN, Hong
					Kong.
					<br>你有權要求查閱及修正你的個人資料。有關申請須以書面向德鑄提出，地址為香港長沙灣永康街18號永康中心 16樓A室。
				</li>
			</ul>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import XhyAutograph from "./components/autograph"
import { SaveImg, SaveInfo } from '@/api/upload'

export default {

	name: 'Registration',
	components: {
		XhyAutograph
	},
	data() {
		return {
			formJosn: [
				{ label: 'Class Arrangement', type: 'title', placeholder: '', key: 'Arrangement' },
				{ label: '課程安排 (Please mark  in the appropriate box 請在適當方格)', type: 'text', placeholder: '', key: 'appropriate' },

				{
					label: 'Courses報讀課程：', type: 'radio', class: 'courses', optionItems: [
						{
							label: 'Mandatory Basic Safety Training Course (Construction Work) (Course Fee HK$193) 1 day course (09:30 - 18:00) 強製性基本安全訓練課程(建築工程) (學費 HK$193) 一天課程(09: 30 - 18: 00)', value: "Course Fee HK$193"
						},
						{ label: "Mandatory Basic Safety Training Revalidation Course (Construction Work) (Course Fee HK$170) Half day course (18:30 - 22:00) 強製性基本安全訓練重新甄審資格課程(建築工程) (學費 HK$170) 半天課程 (18:30 - 22:00)", value: "Course Fee HK$170" },
					], placeholder: 'courses', key: 'courses'
				},

				{ label: 'Medium of Instruction 上課語言', type: 'title', placeholder: '', key: 'Medium' },
				{ label: 'Cantonese 廣東話', type: 'text', placeholder: '', key: 'Cantonese' },

				{ label: 'Training Venue 上課地點', type: 'title', placeholder: '', key: 'Training' },
				{
					label: 'Flat A, 16/F, Wing Hong Centre, 18 Wing Hong Street, Cheung Sha Wan, KLN, Hong Kong香港長沙灣永康街18號永康中心 16樓A室', type: 'text', placeholder: '', key: 'Wing'
				},

				{ label: 'Personal Particulars 個人資料', type: 'title', placeholder: '', key: 'Personal' },
				{ label: 'Please write in capital letters and *cross out inappropriate items 請用正楷填寫及*刪去不適用的選項', type: 'text', placeholder: '', key: 'inappropriate' },


				{ label: 'Name (Chinese) 姓名 (中文)', type: 'input', placeholder: 'Name (Chinese) 姓名 (中文)', key: 'names' },
				// { label: '(English)(英文)', type: 'input', placeholder: '(English)(英文)', key: 'en_name' },
				{ label: 'Surname (English) 姓 (英文)', type: 'input', placeholder: 'Surname (English) 姓 (英文)', key: 'f_name' },
				{ label: 'Given Names (English) 名 (英文)', type: 'input', placeholder: 'Given Names (English) 名 (英文)', key: 'l_name' },
				{ label: '(As shown on HKID Card or Passport 按香港身份證或護照所示)', type: 'text', placeholder: 'As shown on HKID Card or Passport', key: 'hongkong' },
				{ label: 'Date of Birth 出生日期', type: 'select-date', placeholder: 'Date of Birth 出生日期', key: 'birthday' },
				{ label: 'Age年齡', type: 'input', placeholder: 'Age年齡', key: 'age' },
				{
					label: 'Sex性別', type: 'radio', optionItems: [
						{ label: "男", value: "男" },
						{ label: "女", value: "女" },
						{ label: "其它", value: "其它" },
					], placeholder: 'Sex性別', key: 'sex'
				},
				{ label: 'HKID/Passport No.香港身份證/護照號碼', type: 'idcard', placeholder: 'HKID/Passport No.香港身份證/護照號碼', key: 'idcard', class: 'idcard' },
				// { label: '', type: 'input', placeholder: '(最後一位)', key: 'idm' },
				{ label: 'Tel. No.(Day)電話(日)', type: 'input', placeholder: 'Tel. No.(Day)電話(日)', key: 'phone' },
				{ label: 'Mobile手提電話', type: 'input', placeholder: '（必須填寫）', key: 'mobile' },
				{ label: 'Nationality國籍', type: 'input', placeholder: 'Nationality國籍', key: 'nationality' },
				{ label: 'Email Address電郵地址', type: 'input', placeholder: 'Email Address電郵地址', key: 'email' },
				{ label: 'Mailing Address通訊地址', type: 'input', placeholder: 'Mailing Address通訊地址', key: 'address' },
				{ label: 'Present Employer 現職公司/僱主名稱', type: 'input', placeholder: 'Present Employer 現職公司/僱主名稱', key: 'employer' },
				{ label: 'Position 職位', type: 'input', placeholder: 'Position 職位', key: 'position' },
				// {
				//   label: 'Academic Qualifications 教育程度 :', type: 'radio', optionItems: [
				//     { label: "Primary/Secondary 小學/中學", value: "Primary/Secondary 小學/中學" },
				//     { label: "Technical Institute 工業學院", value: "Technical Institute 工業學院" },
				//     { label: "College/University 專上學院/大學", value: "College/University 專上學院/大學" },
				//     { label: "Others", value: "Others" }],
				//   key: 'qualifications'
				// },
				// { label: 'Professional Qualifications 專業資格 :', type: 'input-text', placeholder: 'Professional Qualifications 專業資格', key: 'professional' },
				{
					label: 'Payment method 付款方式 :', type: 'radio', optionItems: [
						{ label: "Cash 現金", value: "Cash" },
						{ label: "Octopus 八達通", value: "Octopus" },
						{ label: "PayMe", value: "PayMe" }],
					key: 'payment'
				},
				{ label: ' Declaration 聲明', type: 'title', placeholder: 'Declaration 聲明', key: 'Declaration' },
				{ label: ' I declare that all information given in this application form is, to the best of my knowledge, accurate and complete. If any false information is given, the application is deemed to be invalid and I shall forfeit my right to apply for this course. I consent that if registered, I will conform to the regulations of Mlife Human Resources Development Centre.  本人聲明本報名表內所載一切資料，依本人所知均屬真確，並無遺漏，並知道倘若虛報資料，申請即屬無效，且喪失其後報讀本課程的資格。本人同意如本人註冊入學，當遵守德鑄人力資源發展中心之學生守則。', type: 'text', placeholder: 'Declaration 聲明', key: 'Declaration-text' },
				{ label: '報名表是否通過電郵發給自己', type: 'checkbox', placeholder: '報名表是否通過電郵發給自己', key: 'self' },
			],
			form: {
				names: null,
				en_name: null,
				f_name: null,
				l_name: null,
				birthday: null,
				age: null,
				sex: null,
				idcard: null,
				phone: null,
				mobile: null,
				nationality: null,
				email: null,
				address: null,
				employer: null,
				position: null,
				professional: null,
				qualifications: null,
				payment: null,
				signature: null
			},
			loginRules: {
				names: [
					{ required: true, message: '請輸入姓名', trigger: 'blur' },
					{ min: 3, max: 5, message: '長度在 3 到 5 個字符', trigger: 'blur' }
				],
			},
			options: {
				penColor: 'black', //筆刷顔色
				minWidth: 2 //最小寬度
			},
			qmValue: '',
			save_key: false,
			agree: false,
			dialogVisible: false
		}
	},

	created() {
		// window.addEventListener('storage', this.afterQRScan)
	},
	mounted() {

	},
	destroyed() {
		// window.removeEventListener('storage', this.afterQRScan)
	},
	methods: {
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true
					this.$store.dispatch('user/login', this.loginForm)
						.then(() => {
							this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
							this.loading = false
						})
						.catch(() => {
							this.loading = false
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		receiveQmValue(val) {
			let that = this
			this.qmValue = val
			console.log(this.qmValue)
			if (!this.form.idcard) {
				this.$alert('請輸入身份證號', '提示', {
					confirmButtonText: '確定',
					// callback: action => {
					//   this.$message({
					//     type: 'info',
					//     message: `action: ${action}`
					//   })
					// }
				})
				return
			}

			const postData = {
				idcard: this.form.idcard,
				base64: this.qmValue
			}

			SaveImg(postData).then(response => {
				console.log('url', response.data)
				that.form.signature = response.data
			})
		},
		submit() {
			let that = this

			console.log('提交報名', this.form)

			if (!this.agree) {
				this.$alert('請同意收集聲明', '提示', {
					confirmButtonText: '確定',
				})
				return
			}


			if (!this.form.signature) {
				this.$alert('請確認簽名', '提示', {
					confirmButtonText: '確定',
					// callback: action => {
					//   this.$message({
					//     type: 'info',
					//     message: `action: ${action}`
					//   })
					// }
				})
				return
			}

			SaveInfo(this.form).then(response => {
				console.log('保存數據', response)

				let data = response
				if (data.code == 200) {
					that.save_key = true
					this.$alert('報名成功', '提示', {
						confirmButtonText: '確定',
						// callback: action => {
						//   this.$message({
						//     type: 'info',
						//     message: `action: ${action}`
						//   })
						// }
					})
				}
				// if (  ) { }
			})

		},
		birthday_age(val) {
			console.log('birthday', val, new Date())
			let str = (new Date())
			console.log(str)
			console.log(str.relace(/[\d]/g), '')

			// let nowyear = (new Date()).replace(/^\d{4}/g, '')
		}
	}
}
</script>

<style lang="scss">
/* 修複input 背景不協調 和光標變色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.login-container {
	padding: 10px;
}

.el-form-item__label {
	padding: 0 !important;
}

.el-form-item {
	margin-bottom: 5px;
}

.submit {
	display: flex;
	margin-top: 15px;
	margin-bottom: 15px;

	button {
		width: 100%;
	}
}

.tables {
	border-bottom: 1px dashed rgb(63, 59, 59);
}

.el-radio__label {
	display: inline-block;
	width: 96%;
	word-break: break-all;
	white-space: normal;
	margin-bottom: 15px;
}

.el-checkbox__label {
	display: inline-block;
	width: 96%;
	word-break: break-all;
	white-space: normal;
	margin-bottom: 15px;
}

.el-radio__inner {
	border-radius: 0 !important;
}

.idcard .el-input:first-child {
	width: 65%;
}

.idcard .el-input:last-child {
	width: 15%;
}

.el-checkbox {
	display: flex;
	align-items: center;
}

.el-dialog__body ul {
	margin: 0;
	padding: 0;

	li {
		margin-bottom: 15px;

		ul {
			padding-left: 10px;
		}
	}

}

@media screen and (max-width: 500px) {
	.el-message {
		min-width: 300px !important;
	}
}

@media screen and (max-width: 500px) {
	.el-message-box {
		width: 300px !important;
	}
}

@media screen and (max-width: 500px) {
	.el-dialog__wrapper .el-dialog {
		width: 90% !important;

		.el-dialog__body {
			padding: 10px 20px !important;

			.el-form-item__label {
				width: 68px !important;
			}

			.el-select,
			.el-input {
				width: 180px !important;
			}
		}
	}
}
</style>
