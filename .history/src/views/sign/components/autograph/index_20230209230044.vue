<template>
	<div class="xhy-autograph-box">
		<div class="autograph-box">
			<div class="inside">
				<!-- <van-icon class="icon-full" name="enlarge" color="#008cff" @click="fullScreenShow" /> -->
				<canvas class="xhy-canvas" />
			</div>
			<div class="btn-box">
				<el-button class="btn-clear" @click="againSignature">重新簽名</el-button>
				<el-button class="btn-confirm" plain type="primary" @click="confirm">Signature 簽名</el-button>
			</div>
		</div>
		<!-- <van-popup v-model="isShowFull" @close="closeFull" :close-on-click-overlay="false" close-on-popstate
			safe-area-inset-bottom closeable close-icon-position="bottom-right" position="left"
			:style="{ height: '100%', width: '100%' }">
			<div class="popup-box">
				<canvas class="xhy-canvasFull" />
				<div class="panel-full">
					<van-button class="btn-again" type="info" @click="againFull">重新签名</van-button>
					<van-button class="btn-confirm" plain type="primary" @click="confirmFull">确认签名</van-button>
				</div>
			</div>
		</van-popup> -->
	</div>
</template>

<script>
import SignaturePad from 'signature_pad';
export default {
	name: "xhy-autograph",
	props: {
		config: {
			type: Object,
			default: {
				penColor: 'green', //笔刷颜色
				minWidth: 1 //最小宽度
			}
		}
	},
	data() {
		return {
			isShowFull: false, // 是否横屏显示
			signaturePad: null, // 存放竖屏SignaturePad对象
			signaturePadFull: null, // 存放横屏SignaturePad对象
			value: '',
			fullValue: ''
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			if (!this.signaturePad) {
				let canvas = document.querySelector('.xhy-canvas');
				this.signaturePad = new SignaturePad(canvas, this.config);
				this.signaturePad.onEnd = () => {
					this.$emit('receive', this.signaturePad.toDataURL()); //通知父组件改变。
				}
				canvas.height = document.body.clientHeight / 3;
				canvas.width = document.body.clientWidth - 30;
			}
		},
		initFull() {
			if (!this.signaturePadFull) {
				let canvas = document.querySelector('.xhy-canvasFull');
				this.signaturePadFull = new SignaturePad(canvas, this.config);
				canvas.height = document.body.clientHeight * 0.82;
				canvas.width = document.body.clientWidth;
			}
		},
		closeFull() {

		},
		againFull() {
			this.signaturePadFull.clear();
		},
		confirm() {
			try {
				let _flag = this.signaturePad.isEmpty();
				// this.signaturePad.clear();
				if (!_flag) {
					this.fullValue = this.signaturePad.toDataURL();
					this.rotateBase64Img(this.fullValue, 0, res => {
						let _option = {
							width: document.body.clientWidth - 30,
							height: document.body.clientHeight / 3
						}
						this.signaturePad.fromDataURL(res, _option);
						this.$emit('receive', res); //通知父组件改变。
					})
				}
			} catch (error) {
				console.log(error);
				this.isShowFull = false;
			}
		},
		confirmFull() {
			try {
				let _flag = this.signaturePadFull.isEmpty();
				this.signaturePad.clear();
				if (!_flag) {
					this.fullValue = this.signaturePadFull.toDataURL();
					this.rotateBase64Img(this.fullValue, 270, res => {
						let _option = {
							width: document.body.clientWidth - 30,
							height: document.body.clientHeight / 3
						}
						this.signaturePad.fromDataURL(res, _option);
						this.$emit('receive', res); //通知父组件改变。
						this.isShowFull = false;
					})
				}
			} catch (error) {
				console.log(error);
				this.isShowFull = false;
			}
		},
		fullScreenShow() {
			this.isShowFull = true;
			setTimeout(() => {
				this.initFull();
				let _flag = this.signaturePad.isEmpty();
				this.signaturePadFull.clear();
				if (!_flag) {
					this.value = this.signaturePad.toDataURL();
					this.rotateBase64Img(this.value, 90, res => {
						let _option = {
							width: document.body.clientWidth,
							height: document.body.clientHeight * 0.82
						}
						this.signaturePadFull.fromDataURL(res, _option);
					})
				}
			}, 100)
		},
		againSignature() {
			this.signaturePad.clear();
			this.$emit('receive', ''); //通知父组件改变。
		},
		// base64图片旋转方法
		rotateBase64Img(src, edg, callback) {
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			var imgW; //图片宽度
			var imgH; //图片高度
			var size; //canvas初始大小
			if (edg % 90 != 0) {
				console.error("旋转角度必须是90的倍数!");
				throw '旋转角度必须是90的倍数!';
			}
			(edg < 0) && (edg = (edg % 360) + 360)
			const quadrant = (edg / 90) % 4; //旋转象限
			const cutCoor = {
				sx: 0,
				sy: 0,
				ex: 0,
				ey: 0
			}; //裁剪坐标
			var image = new Image();
			image.crossOrigin = "anonymous"
			image.src = src;
			image.onload = function () {
				imgW = image.width;
				imgH = image.height;
				size = imgW > imgH ? imgW : imgH;
				canvas.width = size * 2;
				canvas.height = size * 2;
				switch (quadrant) {
					case 0:
						cutCoor.sx = size;
						cutCoor.sy = size;
						cutCoor.ex = size + imgW;
						cutCoor.ey = size + imgH;
						break;
					case 1:
						cutCoor.sx = size - imgH;
						cutCoor.sy = size;
						cutCoor.ex = size;
						cutCoor.ey = size + imgW;
						break;
					case 2:
						cutCoor.sx = size - imgW;
						cutCoor.sy = size - imgH;
						cutCoor.ex = size;
						cutCoor.ey = size;
						break;
					case 3:
						cutCoor.sx = size;
						cutCoor.sy = size - imgW;
						cutCoor.ex = size + imgH;
						cutCoor.ey = size + imgW;
						break;
				}
				ctx.translate(size, size);
				ctx.rotate(edg * Math.PI / 180);
				ctx.drawImage(image, 0, 0);
				var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
				if (quadrant % 2 == 0) {
					canvas.width = imgW;
					canvas.height = imgH;
				} else {
					canvas.width = imgH;
					canvas.height = imgW;
				}
				ctx.putImageData(imgData, 0, 0);
				callback(canvas.toDataURL())
			};
		}
	}

}
</script>

<style lang="scss" scoped>

.xhy-autograph-box {
	.autograph-box {
		padding: 5px;
		width: 100%;
		height: auto;
		background-color: #fff;

		.inside {
			display: flex;
			position: relative;
			background-color: rgb(242, 242, 242);
			border: 1px dashed #666;
			margin: 0 0 5px 0;
			.icon-full {
                position: absolute;
                right: 0;
                top: 0;
                padding: 6px;
            }

			.xhy-canvas {}

			span.btn-clear {
                position: absolute;
                bottom: 0;
                padding: 6px;
			}
			span.btn-confirm{
				position: absolute;
                bottom: 0;
                padding: 6px;
			}

		}

	}

	.btn-box{
		display: flex;
		justify-content: space-evenly
	}
	.el-button--medium{
		border-radius: 0px !important;
		border-top: 0 !important;
		border-left: 0 !important;
		border-right: 0 !important;
	}

}

</style>

