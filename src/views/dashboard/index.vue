<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple box_shadow ">
          <p class="jl_layout_center">上月收益</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple box_shadow">
          <p class="jl_layout_center">昨日收益</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple box_shadow">
          <p class="jl_layout_center">本月收益</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonUrl from '../../utils/common';
import qs from 'qs';
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    async getData(){
      let userId = this.$store.getters.userId;
      
      let  obj = {
        pageNum:1,
        pageSize:10
      }
      const res = await this.$http.post(`${ commonUrl.baseUrl }/sysUser/selectSysUser`,{data:obj});
      console.log(res);
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style scoped>
.box .myBtn {
  color: gray;
  background: gray;
}
</style>
