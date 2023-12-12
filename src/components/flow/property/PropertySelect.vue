<template>
  <div>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="节点名称:">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
	  
      <el-form-item label="元素类型:">
         <el-select v-model="formData.pathType" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
	  
      <el-form-item label="元素路径:">
        <el-input v-model="formData.path"></el-input>
      </el-form-item>
	  
	  
	  <el-form-item label="选择类型:">
	     <el-select v-model="formData.selectType" placeholder="请选择" style="width: 100%;">
	        <el-option v-for="item in selectTypes" :key="item.value"
	          :label="item.label" :value="item.value">
	        </el-option>
	      </el-select>
	  </el-form-item>
	  
		<el-form-item label="类型值:" >
			<el-input v-model="formData.selectTypeValue"></el-input>
		</el-form-item>
		
		<el-form-item label="保留位数:" v-if="formData.descType == 2">
			<el-input type="number" v-model="formData.descNum"></el-input>
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
  name: 'Property',
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
		selectTypes: [
			{
				value: '1',
				label: '1-内容'
			}, 
			{
				value: '2',
				label: '2-值'
			},
			{
				value: '3',
				label: '3-索引'
			}
		],
		formData:{
			text: undefined,
			pathType: '1',
			path: undefined,
			descType: '1',
			desc: undefined,
			isExit: true,
			sleepSecond: 1,
			maxSecond: 18,
			resourceType: '1',
			walletType: undefined,
			selectType: '1'
		}
    }
  }, 
  methods: {
    onSubmit() {
      const { id } = this.$props.nodeData;
      this.$props.lf.setProperties(id, {
        ...this.$data.formData
      });
      console.log(6666, this.$data.formData);
      this.$props.lf.updateText(id, this.$data.formData.text);
      this.$emit('onClose')
    },
	dictMyChange(val){
		console.log("535353535======"+val)
		this.$data.formData.walletType = val
	}
  }
}
</script>
<style scoped>
</style>
