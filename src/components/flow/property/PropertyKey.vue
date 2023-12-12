<template>
  <div>
    <el-form label-width="88px" :model="formData">
      <el-form-item label="节点名称:">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
	  
	  <el-form-item label="键类型:" >
	  		<el-select v-model="formData.keyType" placeholder="请选择" style="width: 100%;">
	  		   <el-option v-for="item in keyTypes" :key="item.value" :label="item.label" :value="item.value">
	  		   </el-option>
	  		 </el-select>
	  </el-form-item>
	  
	  <el-form-item label="键值" v-show="formData.keyType == 'custom' || formData.keyType == 'CONTROL'">
			<el-input v-model="formData.keyValue" ></el-input>
	  </el-form-item>
	  
	  <el-form-item label="按键次数" >
	  		<el-input type="number" v-model="formData.keyNum" ></el-input>
	  </el-form-item>
	  
	  <el-form-item label="元素内按键" >
	  		<el-switch v-model="formData.inElment" ></el-switch>
	  </el-form-item>
	
	
	 <el-form-item label="元素类型:" v-show="formData.inElment">
		<el-select v-model="formData.pathType" placeholder="请选择" style="width: 100%;">
		   <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
		 </el-select>
	 </el-form-item>
	
	<el-form-item label="元素路径:" v-show="formData.inElment" >
		<el-input v-model="formData.path"></el-input>
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
		keyTypes: [{
			value: 'ENTER',
			label: '回车键'
		  }, {
			value: 'BACK_SPACE',
			label: '删除键'
		 }, {
			value: 'F5',
			label: 'F5'
		 }, {
			value: 'SPACE',
			label: '空格键'
		 }, {
			value: 'CONTROL',
			label: 'ctrl+组合键'
		 }, {
			value: 'leLeftMouse',
			label: '点击'
		 }, {
			value: 'doubleLeftMouse',
			label: '双击'
		 }, {
			value: 'rightMouse',
			label: '右键'
		 },{
			value: 'custom',
			label: '自定义'
		 }
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
