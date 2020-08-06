<template>
  <!-- 分润查询 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no handle_timerange">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        class="demo-form-inline"
      >
        <!-- 交易时间 -->
        <el-form-item label="交易时间" prop="allTime">
          <!-- <el-date-picker
            v-model="queryForm.allTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>-->
          <el-date-picker
            v-model="queryForm.startOrderTime"
            type="date"
            class="wid_140"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions0"
          ></el-date-picker>
          <el-date-picker
            v-model="queryForm.endOrderTime"
            type="date"
            class="wid_140"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1"
          ></el-date-picker>
        </el-form-item>
        <!-- 交易渠道 -->
        <el-form-item label="交易渠道" prop="consume_type">
          <el-select v-model="queryForm.consume_type" placeholder="交易渠道" class="wid_140">
            <el-option
              v-for="(item, index) of queryForm.consume_types"
              :key="index"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 订单号 -->
        <el-form-item label="订单号" prop="consume_no">
          <el-input v-model="queryForm.consume_no" placeholder="订单号" class="wid_140"></el-input>
        </el-form-item>
        <!-- 交易金额 -->
        <el-form-item label="交易金额">
          <el-col :span="24">
            <el-form-item prop="startAmount">
              <el-input v-model="queryForm.startAmount" placeholder="最小金额" class style="width:70px"></el-input>-
            </el-form-item>
            <el-form-item prop="endAmount">
              <el-input v-model="queryForm.endAmount" placeholder="最大金额" class style="width:70px"></el-input>元
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 所属机构 -->
        <el-form-item label="所属机构" prop="agent_name">
          <el-input v-model="queryForm.agent_name" placeholder="所属机构" class="wid_140"></el-input>
        </el-form-item>
        <!-- 交易归属日期 -->
        <el-form-item label="交易归属日期" prop="bankTransactionTime">
          <el-date-picker
            v-model="queryForm.bankTransactionTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="交易归属日期"
          ></el-date-picker>
        </el-form-item>
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
          <el-button type="primary" size="mini" @click="exportData('queryForm')">导出数据</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <!-- 收款用户 -->
        <el-table-column prop="username" label="收款用户" width="80"></el-table-column>
        <!-- 所属机构 -->
        <el-table-column prop="agent_name" label="所属机构" width></el-table-column>
        <!-- 所属合伙人 -->
        <el-table-column v-if="roleId != 4 && roleId != 3" prop="parter_name" label="所属合伙人" width></el-table-column>
        <!-- 所属业务员 -->
        <el-table-column v-if="roleId != 4" prop="saler_name" label="所属业务员" width></el-table-column>
        <!-- 交易订单号 -->
        <el-table-column prop="consume_no" show-overflow-tooltip label="交易订单号" width></el-table-column>
        <!-- 交易时间 -->
        <el-table-column prop="order_time" show-overflow-tooltip label="交易时间" width></el-table-column>
        <!-- 交易归属日期 -->
        <el-table-column prop="bankTransactionTime" show-overflow-tooltip label="交易归属日期" width></el-table-column>
        <!-- 交易渠道 -->
        <el-table-column prop label="交易渠道" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.consume_type == 0">微信</span>
            <span v-else-if="scope.row.consume_type == 1">支付宝</span>
            <span v-else-if="scope.row.consume_type == 2">云闪付</span>
            <span v-else-if="scope.row.consume_type == 3">代付</span>
            <span v-else-if="scope.row.consume_type == 6">扫码支付</span>
          </template>
        </el-table-column>
        <!-- 交易金额  原字段：userAmount 修改后字段：checkAmount-->
        <el-table-column prop label="交易金额(元)" width>
          <template slot-scope="scope">
            <span>{{ scope.row.checkAmount}}</span>
          </template>
        </el-table-column>
        <!-- 提成比例 -->
        <el-table-column prop="agentRate" label="提成比例(%)" width></el-table-column>
        <!-- 提成金额 -->
        <el-table-column prop="agentAmount" label="提成金额(元)" width></el-table-column>
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
export default {
  name: "payoffList",
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
      queryForm: {
        // 交易时间
        allTime: "",
        startOrderTime: "",
        endOrderTime: "",
        // 交易渠道
        consume_types: [
          { id: 0, value: "微信" },
          { id: 1, value: "支付宝" },
          { id: 2, value: "云闪付" },
          { id: 3, value: "代付" },
          { id: 6, value: "扫码支付" },
        ],
        consume_type: "",
        // 订单号
        consume_no: "",
        startAmount: "",
        endAmount: "",
        agent_name: "",
        bankTransactionTime: ""
      },
      // 交易时间
      pickerOptions0: {
        disabledDate: time => {
          let vm  = this;
          if (vm.queryForm.endOrderTime != "") {
            return time.getTime() > new Date(vm.queryForm.endOrderTime).getTime() ;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions1: {
        disabledDate: time=>{
          let vm = this;
          if(vm.queryForm.startOrderTime != ""){
            return time.getTime() < new Date(vm.queryForm.startOrderTime).getTime() || time.getTime() > Date.now();
          }else{
            return time.getTime() > Date.now();
          }
        }
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
      // 参数
      let param = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 交易时间 交易渠道 订单号 交易金额 所属机构 交易归属日期
          startOrderTime: this.queryForm.startOrderTime,
          endOrderTime: this.queryForm.endOrderTime,

          consume_type: this.queryForm.consume_type,
          consume_no: this.queryForm.consume_no,

          startAmount: this.queryForm.startAmount == ''? '':this.queryForm.startAmount * 100,
          endAmount: this.queryForm.endAmount == ""? '': this.queryForm.endAmount * 100,

          //userAmount:this.queryForm.userAmount,
          agent_name: this.queryForm.agent_name,
          bankTransactionTime: this.queryForm.bankTransactionTime
        }
      };
      this.tableLoading = true;
      this.$http
        .post(
          `${commonUrl.baseUrl}/accountProfitInfo/accountProfitInfoList`,
          param
        )
        .then(res => {
          if (res.data.code == "0000") {
            // console.log(res)
            // debugger
            this.tableData = res.data.data.agentProfitList;
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
    exportData() {
      const token = getToken();
      let data = {
        signInUserId: this.$store.getters.userId,
        signInRoleId: this.$store.getters.roleId
      };
      // 导出出账
      window.location.href = `${commonUrl.baseUrl}/accountProfitInfo/exportAccountProfit?signInUserId=${data.signInUserId}&signInRoleId=${data.signInRoleId}`;
    },
    // 刷新
    handle_refresh() {
      this.getTabelDataList(this.currentPage);
      // this.currentPage = 1
    },

    // 查询按钮
    queryData() {
      // console.log(this.queryForm)
      // if (this.queryForm.allTime.length > 0) {

      //   this.queryForm.startOrderTime = this.queryForm.allTime[0];
      //   this.queryForm.endOrderTime = this.queryForm.allTime[1];
      // }
      // console.log(this.queryForm);
      this.getTabelDataList(1);
      this.currentPage = 1;
    },
    // 重置按钮
    resetData(formName) {
      this.$refs[formName].resetFields();
      // 对于queryForm 下拉
      this.queryForm.startOrderTime = "";
      this.queryForm.endOrderTime = "";
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
