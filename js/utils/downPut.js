let $ = jQuery

/**
 *  使用方法 给 Elementor挂件 
 * 	1. 添加 .downput 类  (必须)
 * 	2. 添加以下属性
 *		# 初始化高度 数字 或者 指定参考容器  (必须)
 *		dp-init-height|.t38 img
 *		# 按钮文字颜色  (可选, 默认 继承)
 *		dp-color|#fff
 *		# 按钮背景颜色  (可选, 默认 #FFF)
 *		dp-btn-bg|#690 
 *		# 按钮容器背景  (可选, 默认 #FFF)
 *		dp-wrap-bg|#abc 
 *		# 按钮高度      (可选, 默认值 30)
 *		dp-btn-height|50
 */
export class DownPut{
	// 构造函数
	constructor (dp){
		// DP容器
		this.dp   = dp
		this.more = 'More'
		this.less = 'Less'
		$(this.dp).each( (index, ele) => {
			// raw_height 内容原始高度  init_height 初始化高度 container 当前展开收起容器
			let [raw_height, init_height, container] = this.initd(ele)
			if(raw_height > init_height){
				let button = this.button(init_height, raw_height, ele)
				$(container).css('height', init_height).append(button)
			}
		})
	}
	// 创建按钮
	button(init_height, raw_height, ele){
		let dp_color   = $(ele).attr('dp-color')
		let wrap_bg    = $(ele).attr('dp-wrap-bg')
		let btn_bg	   = $(ele).attr('dp-btn-bg')
		let btn_height = $(ele).attr('dp-btn-height')
		btn_height = parseFloat(btn_height) ? btn_height*1 : 30
		let wrap = `<div class="dp-btn-wrap"><i>....</i></div>`
		let btn  = $(`<span class="dp-btn" dp-status="1" raw-height="${raw_height + btn_height +10}" init-height="${init_height}">${this.more}</span>`).css({'background':btn_bg, 'height': btn_height})
		return $(wrap).css({'background': wrap_bg, 'color':dp_color, 'padding': '5px'}).append(btn)
	}
	// 初始化配置参数
	initd(ele){
		let data_id    = $(ele).attr('data-id')
		let container  = `[data-id="${data_id}"]`
		let raw_height = $(ele).height()
		let init_height= $(ele).attr('dp-init-height')
		init_height = parseFloat(init_height) ? init_height : $(init_height).height()
		return [raw_height, init_height, container]
	}
	// 切换
	toggle(){
		$(this.dp).on('click', '.dp-btn', event => {
			let ele 	= event.currentTarget
			let status 	= $(ele).attr('dp-status')
			if (status == 1) {
				let raw_height = $(ele).attr('raw-height')
				$(ele).attr('dp-status', 2).text(this.less).parents(this.dp).animate({'height': raw_height}, 'fast')
			}else {
				let init_height = $(ele).attr('init-height')
				$(ele).attr('dp-status', 1).text(this.more).parents(this.dp).animate({'height': init_height}, 'fast')
			}
		})
	}
}