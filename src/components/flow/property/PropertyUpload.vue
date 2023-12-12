<template>
  <div>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="节点名称:">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
	  
	  <el-form-item label="元素类型:" >
	     <el-select v-model="formData.pathType" placeholder="请选择" style="width: 100%;">
	        <el-option
	          v-for="item in options"
	          :key="item.value"
	          :label="item.label"
	          :value="item.value">
	        </el-option>
	      </el-select>
	  </el-form-item>
	  
	  <el-form-item label="元素路径:" >
	    <el-input v-model="formData.path"></el-input>
	  </el-form-item>
	  
	  <el-form-item label="文件路径:" >
	    <el-input v-model="formData.fliePath"></el-input>
	  </el-form-item>
	  
	  <el-form-item label="文件名:" >
	    <el-input v-model="formData.flieName"></el-input>
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
	   options: [{
			value: '1',
			label: '1-xpath'
		  }, {
			value: '2',
			label: '2-cssPath'
		 }],
		operaTypes: [
			{
				value: '1',
				label: '1-新增'
			},
			{
				value: '2',
				label: '2-更新'
			},
		],
		dataTypes:[
			{
				value: '1',
				label: '1-copy到剪贴板'
			},
			{
				value: '2',
				label: '2-元素text'
			},
			{
				value: '3',
				label: '3-元素value'
			},
		],
		textTypes: [
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
				value: '8',
				label: '8-邮箱'
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
			sleepSecond: 1,
			maxSecond: 18,
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
