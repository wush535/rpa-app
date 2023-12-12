<template>
	<el-select v-model="selectValue" placeholder="请选择" style="width: 100%;" @change="selectChange">
	    <el-option v-for="item in dictList" :key="item.value" :label="item.label" :value="item.value">
			 {{item.label}}
	    </el-option>
	</el-select>
</template>

<script>

import { list } from "@/api/dict/dict"

export default {
  props: {
	dictType: String,
	dictValue: String,
  },
  data () {
	return {
		dictList: [],
		dataDictList: [],
		selectValue: undefined,
	}
  },
  watch: {
	dictValue: {
		handler (val) {
		  //console.log("val111==="+val)
		  this.selectValue = val
		  //console.log("this.selectValue11==="+this.selectValue)
		},
		immediate: true
	}
  },
  created() {
  	this.listByDictType();
  },
  methods: {
	selectChange(){
		//console.log("this.selectValue222222======="+this.selectValue)
		this.$emit("dictChange", this.selectValue);
	},
	listByDictType(){
		let that = this;
		list({"dictType":this.dictType}).then(res=>{
			if(res.code == 200){
				if(res.data && res.data.length > 0){
					this.dictList = [];
					this.dataDictList = res.data;
					//console.log("this.dictType14124124===="+this.dictType);
					that.$emit("getDictList",that.dataDictList);
					for(let i = 0; i < res.data.length ; i++){
						this.dictList.push({ "value": res.data[i].dictValue, "label": res.data[i].dictValue + "-" + res.data[i].dictLabel })
					}
				}
			}else{
				this.$message.error(res.msg);
			}
		}).catch(error=>{
			//console.log("错误："+JSON.stringify(error))
		});
	},
  },
}
</script>

<style>
</style>