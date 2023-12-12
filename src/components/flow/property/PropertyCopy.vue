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
	  
	  <el-form-item label="文本类型:" >
	     <el-select v-model="formData.descType" placeholder="请选择" style="width: 100%;" 
				:disabled=" $props.nodeData.type == 'taskGo'" >
	        <el-option v-for="item in textTypes" :key="item.value"
	          :label="item.label" :value="item.value">
	        </el-option>
	      </el-select>
	  </el-form-item>
	  
		<el-form-item label="文本内容:" v-if="formData.descType != 3 &&  formData.descType != 4 && formData.descType != 5 
			&&  formData.descType != 6 &&  formData.descType != 7 &&  formData.descType != 8 && formData.descType != 9">
			<el-input v-model="formData.desc"></el-input>
		</el-form-item>
		
		<el-form-item label="保留位数:" v-if="formData.descType == 2">
			<el-input type="number" v-model="formData.descNum" ></el-input>
		</el-form-item>
	
		<el-form-item label="数据来源:" v-if="formData.descType == 3 || formData.descType == 5 
			|| formData.descType == 6 || formData.descType == 7 || formData.descType == 8" >
		   <el-select v-model="formData.resourceType" placeholder="请选择" style="width: 100%;" >
		      <el-option v-for="item in resourceTypes" :key="item.value" :label="item.label" :value="item.value">
		      </el-option>
		    </el-select>
		</el-form-item>
		
		<el-form-item label="钱包类型:" v-show="formData.resourceType == '2' && (formData.descType == 3 || formData.descType == 5 
			|| formData.descType == 6  || formData.descType == 8)">
		    <dict dictType="rpa_use_type" :dictValue="formData.walletType" @dictChange="dictMyChange"></dict>
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
  name: 'PropertyCopy',
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
		textTypes: [/* {
			value: '1',
			label: '1-文本'
		  }, 
		  {
			value: '2',
			label: '2-随机数'
			},
			{
				value: '3',
				label: '3-钱包地址'
			}, */
			{
				value: '5',
				label: '5-助记词'
			},
			/* {
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
			}, */
			{
				value: '9',
				label: '9-从剪贴板获取'
			},
			/* {
				value: '10',
				label: '10-密码'
			}, */
		],
		resourceTypes:[
			{
				value: '2',
				label: '2-数据库'
			}],
		formData:{
			text: undefined,
			pathType: '1',
			path: undefined,
			descType: '5',
			desc: undefined,
			isExit: true,
			sleepSecond: 1,
			maxSecond: 18,
			resourceType: '2',
			walletType: undefined,
		}
    }
  }, 
  methods: {
    onSubmit() {
      const { id } = this.$props.nodeData;
      this.$props.lf.setProperties(id, {
        ...this.$data.formData
      });
      //console.log(6666, this.$data.formData);
      this.$props.lf.updateText(id, this.$data.formData.text);
      this.$emit('onClose')
    },
	dictMyChange(val){
		//console.log("535353535======"+val)
		this.$data.formData.walletType = val
	}
  }
}
</script>
<style scoped>
</style>
