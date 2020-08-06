<template>
  <!-- 收益查询 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no handle_timerange">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        label-width="80px"
        size="mini"
        class="demo-form-inline"
      >
        <!-- 交易时间 -->
        <el-form-item label="交易时间" prop="allTime">

          <el-date-picker
            v-model="queryForm.startTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            :picker-options="pickerOptions_register1"
          ></el-date-picker>
          <el-date-picker
            v-model="queryForm.endTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            :picker-options="pickerOptions_register2"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 订单号 -->
        <el-form-item label="订单号" prop="orderid">
          <el-input v-model="queryForm.orderid" placeholder="订单号" class="wid_140"></el-input>
        </el-form-item>
        <!-- 交易金额 -->
        <el-form-item label="交易金额">
          <el-col :span="24">
            <el-form-item prop="lowMoney">
              <el-input v-model="queryForm.lowMoney" placeholder="最小金额" class style="width:70px"></el-input>-
            </el-form-item>
            <el-form-item prop="highMoney">
              <el-input v-model="queryForm.highMoney" placeholder="最大金额" class style="width:70px"></el-input>元
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 受益人 -->
        <el-form-item label="受益人" prop="userName">
          <el-input v-model="queryForm.userName" placeholder="受益人" class="wid_140"></el-input>
        </el-form-item>
        <!-- 交易用户 -->
        <el-form-item label="交易用户" prop="src_username">
          <el-input v-model="queryForm.src_username" placeholder="交易用户" class="wid_140"></el-input>
        </el-form-item>
        <!-- 交易归属日期 -->
        <!-- <el-form-item label="交易归属日期" prop="finish_time" >
                  <el-date-picker
                    v-model="queryForm.finish_time"
                    type="date"
                    class="wid_140"
                    value-format="yyyy-MM-dd"
                    placeholder="交易归属日期">
                  </el-date-picker>
        </el-form-item>-->
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
          <el-button type="primary" size="mini" @click="exportData('/order/exportProfi')">导出数据</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <!-- 受益人 -->
        <el-table-column prop="userName" label="受益人" width="80"></el-table-column>
        <!-- 交易用户 -->
        <el-table-column prop="src_username" label="交易用户" width="80"></el-table-column>
        <!-- 交易时间 -->
        <el-table-column prop="order_time" label="交易时间" width></el-table-column>
        <!-- 交易渠道 -->
        <el-table-column prop label="交易渠道" width>
          <!-- 交易渠道 0微信 1支付宝 2云闪付 更改字段：trade_type_class-->
          <template slot-scope="scope">
            <span v-if="scope.row.trade_type_class == 0">微信</span>
            <span v-else-if="scope.row.trade_type_class == 1">支付宝</span>
            <span v-else-if="scope.row.trade_type_class == 2">云闪付</span>
          </template>
        </el-table-column>
        <!-- 交易订单号 -->
        <el-table-column prop="orderid" label="交易订单号" width></el-table-column>
        <!-- 交易金额 -->
        <el-table-column prop label="交易金额(元)" width>
          <template slot-scope="scope">
            <span>{{ scope.row.order_src_amount / 100 }}</span>
          </template>
        </el-table-column>
        <!-- 收益金额 -->
        <el-table-column prop label="收益金额(元)" width>
          <template slot-scope="scope">
            <span>{{ scope.row.order_amount / 100 }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block mar_t10">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :total="pageTotal"
          background
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import commonUrl from "../../utils/common";
import { getToken } from "../../utils/auth.js";

import axios from "axios";
export default {
  name: "incomeList",
  data() {
    return {
      roleId: "",
      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页
      pageTotal: 100,
      currentPage: 1,
      // 查询参数
      // 交易时间
      pickerOptions_register1: {
        disabledDate: time => {
          let vm  = this;
          if (vm.queryForm.endTime != "") {
            return time.getTime() > new Date(vm.queryForm.endTime).getTime() ;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions_register2: {
        disabledDate: time=>{
          let vm = this;
          if(vm.queryForm.startTime != ""){
            return time.getTime() < new Date(vm.queryForm.startTime).getTime() || time.getTime() > Date.now();
          }else{
            return time.getTime() > Date.now();
          }
        }
      },
      queryForm: {
        // 交易时间
        allTime: "",
        startTime: "",
        endTime: "",
        lowMoney: "",
        highMoney: "",
        orderid: "",
        // 受益人
        userName: "",
        src_username: ""
      }
    };
  },
  created() {
    // 初始化roleid
    this.roleId = this.$store.getters.roleId;
    // 初始化主列表
    this.getTabelDataList(1);
  },
  methods: {
    // 初始化主列表
    getTabelDataList(pageNum) {
      let param = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 私有
          startTime:this.queryForm.startTime,
          endTime:this.queryForm.endTime,
          lowMoney: this.queryForm.lowMoney === ''?'': this.queryForm.lowMoney*100,
          highMoney: this.queryForm.highMoney=== ''?'': this.queryForm.highMoney*100,

          orderid: this.queryForm.orderid,
          userName: this.queryForm.userName,
          src_username: this.queryForm.src_username
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/order/selectProfi`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // console.log(res)
            // debugger
            this.tableData = res.data.data.profiList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
            // 关闭加载
            this.tableLoading = false;
          } else {
            this.m_message(res.data.msg, "warning");
            // 关闭加载
            this.tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 导出数据
    exportData(url) {
      const token = getToken();
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      axios({
        method: "post",
        url: `${commonUrl.baseUrl}${url}`,
        // headers里面设置token
        headers: {
          Authorization: token
        },
        data: {
          data: {
            // 公有
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            // pageNum: pageNum,
            // pageSize: 10,
            // 私有
            startTime:this.queryForm.startTime,
            endTime:this.queryForm.endTime,
           lowMoney: this.queryForm.lowMoney === ''?'': this.queryForm.lowMoney*100,
          highMoney: this.queryForm.highMoney=== ''?'': this.queryForm.highMoney*100,

            orderid: this.queryForm.orderid,
            userName: this.queryForm.userName,
            src_username: this.queryForm.src_username
          }
        },
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
    },
    // 刷新
    handle_refresh() {
      this.getTabelDataList(this.currentPage);
      // this.currentPage = 1
    },

    // 查询按钮
    queryData() {
      this.getTabelDataList(1);
      this.currentPage = 1;
    },
    // 重置按钮
    resetData(formName) {
      this.$refs[formName].resetFields();
      // 对于queryForm 下拉
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTabelDataList(val);
      //console.log(`当前页: ${val}`);
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
