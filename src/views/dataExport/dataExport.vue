<template>
  <!-- 导出数据 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no handle_timerange">
      <!-- 对账 -->
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        :rules="queryFormRule"
        label-width="80px"
        size="mini"
        class="demo-form-inline dui_form"
      >
        <!-- 交易日期 -->
        <el-form-item label="交易日期" prop="finish_time">
          <el-date-picker
            v-model="queryForm.finish_time"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="交易日期"
          ></el-date-picker>
        </el-form-item>
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="resetData('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2  -->
    <div>
      <el-button
        type="primary"
        size="mini"
        @click="exportData('/financeExport/exportLedger')"
      >导出每日台账数据</el-button>
      <el-button
        type="success"
        size="mini"
        @click="exportData('/financeExport/exportTransactionDetails')"
      >导出每日交易明细</el-button>
      <el-button type="warning" size="mini" @click="exportData('/order/exportPayment')">导出每日付款明细</el-button>
    </div>
  </div>
</template>
<script>
import commonUrl from "../../utils/common";
import { getToken } from "../../utils/auth.js";
import axios from "axios";
export default {
  name: "paymentCheck",
  data() {
    return {
      queryForm: {
        finish_time: ""
      },
      queryFormRule: {
        finish_time: [
          {
            type: "string",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    // 初始化roleid
    this.roleId = this.$store.getters.roleId;
    // 初始化主列表
    // this.getTabelDataList(1);
  },
  methods: {
    // 初始化主列表
    getTabelDataList(pageNum) {
      // 参数
      // let param = {
      //     data: {
      //         // 公有
      //         signInUserId: this.$store.getters.userId,
      //         signInRoleId: this.$store.getters.roleId,
      //         pageNum: pageNum,
      //         pageSize: 10,
      //         // 交易时间 交易渠道 订单号 交易金额 所属机构 交易归属日期
      //         startTime:this.queryForm.allTime[0],
      //         endTime:this.queryForm.allTime[1],
      //         transaction_type:this.queryForm.transaction_type,
      //         order_num:this.queryForm.order_num,
      //         transaction_money:this.queryForm.transaction_money,
      //         agent_name:this.queryForm.agent_name,
      //         finish_time:this.queryForm.finish_time,
      //     }
      // }
      // this.tableLoading = true
      // this.$http.post(`${ commonUrl.baseUrl }/withdrawInfo/getWithdrawInfo`, param).then(res=>{
      //   if(res.data.code == '0000'){
      //       // console.log(res)
      //       // debugger
      //       this.tableData =  res.data.data.withdrawList
      //       // 分页 总数
      //       this.pageTotal = res.data.data.page.pageTotal;
      //       // 关闭加载
      //       this.tableLoading = false
      //   }else{
      //     this.m_message(res.data.msg, 'warning')
      //     // 关闭加载
      //     this.tableLoading = false
      //   }
      // }).catch(err=>{})
    },
    // 刷新
    handle_refresh() {
      this.getTabelDataList(this.currentPage);
      // this.currentPage = 1
    },
    // 导出数据
    exportData(url) {
      if (this.m_valid_addForm("queryForm")) {
        const token = getToken();
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let data = {
          order_time: this.queryForm.finish_time
        };
        switch (url) {
          case "/financeExport/exportLedger":
            data = { data:{order_date: this.queryForm.finish_time} };
            break;
          case "/financeExport/exportTransactionDetails":
            data = { data:{order_date: this.queryForm.finish_time} };
            break;
          default:
            data = {
              order_time: this.queryForm.finish_time
            };
        }
        axios({
          method: "post",
          url: `${commonUrl.baseUrl}${url}`,
          // headers里面设置token
          headers: {
            Authorization: token
          },
          data,
          // 二进制流文件，一定要设置成blob，默认是json
          responseType: "blob"
        })
          .then(res => {
            loading.close();
            // console.log(res.headers['content-disposition'])
            let fileName = res.headers["content-disposition"];

            const link = document.createElement("a");
            const blob = new Blob([res.data], { type: "text/csv" });

            link.style.display = "none";
            link.href = URL.createObjectURL(blob);

            link.setAttribute("download", `${fileName}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch(err => {
            loading.close();
          });
      }

      // let data = {
      //   signInUserId: this.$store.getters.userId,
      //   signInRoleId: this.$store.getters.roleId,
      //   finish_time: this.queryForm.finish_time,
      //   Authorization: token
      // };
      // 导出出账
      // window.location.href = `${commonUrl.baseUrl}/order/exportOrder?order_time=${data.finish_time}`;
    },
    // 重置按钮
    resetData(formName) {
      this.$refs[formName].resetFields();
      // 对于queryForm 下拉
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";
    },
    // 新增 校验规则
    m_valid_addForm(formName) {
      let flag = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          flag = true;
          return true;
        } else {
          flag = false;
          return false;
        }
      });
      return flag;
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
    }
  }
};
</script>
<style>
.dui_form > div {
  margin-bottom: 15px !important;
}
</style>
