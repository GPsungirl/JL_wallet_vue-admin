<template>
  <div class="main_content">
    <el-row>
      <el-col :span="8" :offset="4">
        <div class="grid-content bg-purple box_shadow">
          <p class="jl_layout_center">上月收益</p>
          <el-row style="margin-bottom:10px;margin-top:30px">
            <el-col :span="10" style="text-align:right">
              <span>贝壳收入：</span>
            </el-col>
            <el-col :span="14" style="text-align:left;padding-left:10px">
              <span>{{ lastMonth_virtualamount }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" style="text-align:right">
              <span>出行收入：</span>
            </el-col>
            <el-col :span="14" style="text-align:left;padding-left:10px">
              <span>{{ lastMonth_accountamount }}</span>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple box_shadow">
          <p class="jl_layout_center">昨日收益</p>
          <el-row style="margin-bottom:10px;margin-top:30px">
            <el-col :span="10" style="text-align:right">
              <span>贝壳收入：</span>
            </el-col>
            <el-col :span="14" style="text-align:left;padding-left:10px">
              <span>{{ yesterday_virtualamount }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" style="text-align:right">
              <span>出行收入：</span>
            </el-col>
            <el-col :span="14" style="text-align:left;padding-left:10px">
              <span>{{ yesterday_accountamount }}</span>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <!-- <el-col :span="8">
        <div class="grid-content bg-purple box_shadow">
          <p class="jl_layout_center">本月收益</p>
        </div>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonUrl from '../../utils/common';
import qs from 'qs';
export default {
  name: 'Dashboard',
  data() {
    return {
      agent_name: "",
      agentid: "",
      // 昨日收益
      yesterday_virtualamount: "",
      yesterday_accountamount: "",
      // 上月收益
      lastMonth_virtualamount: "",
      lastMonth_accountamount: ""
    };
  },
  created() {
    // 初始化数据
    this.getEarnings()
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    // 获取昨日收益 上月收益
    getEarnings() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      })
      // 昨日收益 出行收益 贝壳收益
      let _param1 = {
        data: {
          signInRoleId: this.$store.getters.roleId,
          yesterday:this.getYestoday()
        }
      }
      let _pro1 = this.$http.post(`${commonUrl.baseUrl}/accountProfitPlatform/selectAccountProfitPlatform`,_param1)
      let _pro2 = this.$http.post(`${commonUrl.baseUrl}/virtualProfitPlatform/selectVirtualProfitPlatform`,_param1)

      // 上月收益 出行收益 贝壳收益
      let _param2 = {
        data: {
          signInRoleId: this.$store.getters.roleId,
          lastMonth: this.getLastMonth()
        }
      }
      let _pro3 = this.$http.post(`${commonUrl.baseUrl}/accountProfitPlatform/selectLastMonthAccountProfitPlatform`,_param2)
      let _pro4 = this.$http.post(`${commonUrl.baseUrl}/virtualProfitPlatform/selectLastMonthVirtualProfitPlatform`,_param2)

      Promise.all([_pro1,_pro2,_pro3,_pro4])
      .then(res => {
        let [res1, res2, res3, res4] = res
        // console.log(res);
        // debugger
        // 昨日 出行收益 贝壳收益
        if(res1.data.code == '0000'){
          let result = res1.data.data.accountProfitPlatform
          // 昨日出行
          this.yesterday_accountamount = result.amount / 100 + '元'
        }else{
          // setTimeout(()=>{this.m_message(res1.data.msg, 'warning')},1)
        }

        if(res2.data.code == '0000'){
          let result = res2.data.data.virtualProfitPlatform
          // 昨日贝壳
          this.yesterday_virtualamount = result.amount + '贝壳'
        }else{
          // setTimeout(()=>{this.m_message(res2.data.msg, 'warning')},1)
        }

        // 上月 出行收益 贝壳收益
        if(res3.data.code == '0000'){
          let result = res3.data.data.lastMonthAccountProfitPlatform
          // 上月 出行
          this.lastMonth_accountamount = result.account_amount_total / 100 + '元'
        }else{
          // setTimeout(()=>{this.m_message(res3.data.msg, 'warning')},1)
        }

        if(res4.data.code == '0000'){
          let result = res4.data.data.lastMonthVirtualProfitPlatform
          // 上月 贝壳
          this.lastMonth_virtualamount = result.virtual_amount_total +'贝壳'
        }else{
          // setTimeout(()=>{this.m_message(res4.data.msg, 'warning')},1)
        }

        loading.close();
      })
      .catch(err => { loading.close() })
    },
    // 获取 昨日 日期
    getYestoday() {
      var day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      var _month =
        day1.getMonth() + 1 < 10
          ? "0" + (day1.getMonth() + 1)
          : day1.getMonth() + 1;
      var _date = day1.getDate() < 10 ? "0" + day1.getDate() : day1.getDate();
      var s1 = day1.getFullYear() + _month + _date;
      return s1;
    },
    // 获取 上月
    getLastMonth() {
      /*默认显示上个月的日期*/
      var nowdays = new Date();
      var year = nowdays.getFullYear();
      var month = nowdays.getMonth();
      if (month == 0) {
        month = 12;
        year = year - 1;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var firstDay = year + month;
      return firstDay;
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
    },
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
.main_content {
  margin-top: 40px;
}
.title {
  color: #666;
  text-align: center;
}
.title span {
  color: #000;
}
</style>
<style scoped>
.box .myBtn {
  color: gray;
  background: gray;
}
</style>
