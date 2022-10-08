<?php
/**
 * 添加全局字段
 */
class AddGlobalFields {
	private $id;
	private $title;
	private $page = 'general';
	private $message;
	/**
	 * 字段为二维数组
	 * @param array $fields
	 */
	public function __construct(array $fields){
		foreach($fields as $item){
			if( empty($item['id']) || empty($item['title']) ){
				continue;
			}
			$this->parse($item);
			add_settings_field($this->id, $this->title, [$this, 'field_callback'], $this->page, 'default', [$this->id]);
			register_setting($this->page, $this->id);
		}
	}
	/**
	 * 分析字段是否设置正确
	 * @param array $field
	 * @return void
	 */
	private function parse(array $field){
		foreach($field as $key =>$value){
			if(property_exists($this, $key)){
				$this->$key = $value;
			}
		}
	}
	/**
	 * 字段前端输入html
	 * @param array $args
	 * @return void
	 */
	public function field_callback(array $args){
		$option = get_option($args[0]);
		$html = '<input type="text" id="'. $args[0] .'" name="'. $args[0] .'" value="' . $option . '" class="regular-text" />';
		if($this->message){
			$html.= sprintf('<p class="description" id="new-admin-email-description">%s</p>', $this->message);
		}
		echo $html;
	}
}

add_action( 'admin_init', function(){
	$fields = array(
		['id'=>'google_tag_manager_id', 'title'=>'谷歌标签管理器ID', 'message'=>'留空前台不输出代码'],
	);
	new AddGlobalFields($fields);
});
$gtm_id = get_option('google_tag_manager_id');
if($gtm_id){
	// 谷歌标签管理器Head
	add_action('wp_head', function() use ($gtm_id){
		?>
		<!-- Google Tag Manager -->
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','<?php echo $gtm_id; ?>');</script>
		<!-- End Google Tag Manager -->
		<?php
	});
	// 谷歌标签管理器Body
	add_action('wp_body_open', function() use ($gtm_id){
		?>
		<!-- Google Tag Manager (noscript) -->
		<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo $gtm_id;?>"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<!-- End Google Tag Manager (noscript) -->
		<?php
	});
}

