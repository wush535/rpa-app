<template>
  <div>
    <el-form label-width="88px" :model="formData">
      <el-form-item label="节点名称:">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
	  
	  <el-form-item label="软件标题" >
	  		<el-input v-model="formData.winTitle" ></el-input>
	  </el-form-item>
	  
	 <el-form-item label="组件class" >
	 		<el-input v-model="formData.winClassName" ></el-input>
	 </el-form-item>
	 
	 <el-form-item label="文本类型:" >
	    <el-select v-model="formData.descType" placeholder="请选择" style="width: 100%;" >
	       <el-option v-for="item in textTypes" :key="item.value" :label="item.label" :value="item.value"> </el-option>
	     </el-select>
	 </el-form-item>
	 
	<el-form-item label="文本内容:">
		<el-input v-model="formData.desc"></el-input>
	</el-form-item>
	  
	  <el-form-item label="失败退出:">
		<el-switch v-model="formData.isExit" active-text="失败退出" style="width: 100%;">
		</el-switch> 
	  </el-form-item>
	  
	  <el-form-item label="等待最大时间:">
	  		<el-input v-model="formData.maxSecond"></el-input>
	  </el-form-item>
	  
	  <el-form-item label="休眠时间:">
		  <el-input v-model="formData.sleepSecond"></el-input>
	  </el-form-item>
	  
       <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import dict from "../../comm/dict.vue"
export default {
  name: 'PropertyJdbc',
  components: { dict },
  props: {
    nodeData: Object,
    lf: Object || String,
  },
  mounted() {
    const { properties, text } = this.$props.nodeData;
    if (properties) {
      this.$data.formData = Object.assign({}, this.$data.formData, properties)
    }
    if (text && text.value) {
      this.$data.formData.text = text.value
    }
    if (text && text.value) {
      this.$data.text = text.value
    }
	
	const nodeData = this.$props.nodeData;
	nodeData.properties = this.$data.form;
	this.$props.lf.setProperties(nodeData.id, this.$data.form);
  },
  data () {
    return {
		textTypes: [{
			value: '1',
			label: '1-文本'
		  }, 
		  {
			value: '2',
			label: '2-随机数格式:[1.1-3.5]'
			},
			{
				value: '3',
				label: '3-钱包地址'
			},
			{
				value: '5',
				label: '5-助记词'
			},
			{
				value: '6',
				label: '6-私钥'
			},
			{
				value: '7',
				label: '7-名称'
			},
			{
				value: '8',
				label: '8-邮箱'
			},
			{
				value: '10',
				label: '10-密码'
			},
		],
		formData:{
			text: undefined,
			pathType: '1',
			operaType: '2',
			path: undefined,
			descType: '3',
			desc: undefined,
			isExit: true,
			sleepSecond: 2,
			maxSecond: 18,
			keyNum: 1,
			resourceType: undefined,
			walletType: undefined,
		}
    }
  }, 
  methods: {
	dictMyChange(val){
		this.$data.formData.walletType = val
	},
    onSubmit() {
      const { id } = this.$props.nodeData;
      this.$props.lf.setProperties(id, {
        ...this.$data.formData
      });
      console.log(6666, this.$data.formData);
      this.$props.lf.updateText(id, this.$data.formData.text);
      this.$emit('onClose')
    },
  }
}
</script>
<style scoped>
</style>
