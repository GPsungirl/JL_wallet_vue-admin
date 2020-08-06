<template>
  <!-- 出款对账 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no handle_timerange">
      <!-- 对账 -->
      <el-form
        :inline="true"
        :model="dui_queryForm"
        :rules="rules_dui"
        ref="dui_queryForm"
        label-width="80px"
        size="mini"
        class="dui_form demo-form-inline"
      >
        <!-- 选择银行 -->
        <el-form-item label="选择银行" prop="channelid">
          <el-select
            v-model="dui_queryForm.channelid"
            class="wid_140"
            placeholder="选择银行"
          >
            <el-option
              v-for="(item, index) in dui_queryForm.channelids"
              :key="index"
              :label=" item.txt "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易日期" prop="date">
          <el-date-picker
            v-model="dui_queryForm.date"
            type="date"
            class="wid_140"
            format="yyyy-MM-dd"
            value-format="yyyyMMdd"
            placeholder="交易日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="duiAccount">对账</el-button>
        </el-form-item>
      </el-form>
      <!-- 查询 -->
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        label-width="100px"
        size="mini"
        class="demo-form-inline"
      >
        <el-form-item label="系统交易日期" prop="sys_createtime">
          <el-date-picker
            v-model="queryForm.sys_createtime"
            type="date"
            class="wid_140"
            value-format="yyyyMMdd"
            placeholder="交易日期"
          ></el-date-picker>
        </el-form-item>
        <!-- 订单号 -->
        <el-form-item label="银行订单号" prop="bank_out_trade_no">
          <el-input v-model="queryForm.bank_out_trade_no" placeholder="订单号" class="wid_140"></el-input>
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
        <!-- 对账状态 -->
        <el-form-item label="对账状态" prop="reconciliation_status">
          <el-select
            v-model="queryForm.reconciliation_status"
            class="wid_140"
            placeholder="交易状态"
            @change="changeOption_traveler_status($event)"
          >
            <el-option
              v-for="(item, index) in queryForm.reconciliation_statuss"
              :key="index"
              :label=" item.txt "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 渠道订单编号 -->
        <el-form-item label="系统订单号" prop="sys_consumeid">
          <el-input v-model="queryForm.sys_consumeid" placeholder="渠道订单编号" class="wid_140"></el-input>
        </el-form-item>
        <!-- 交易渠道 -->
        <!-- <el-form-item label="交易渠道" prop="trade_type" >
              <el-select v-model="queryForm.trade_type" placeholder="交易渠道" class="wid_140">
                <el-option
                  v-for="(item, index) of queryForm.trade_types"
                  :key="index"
                  :label="item.value"
                  :value="item.id"
                  >

                </el-option>
              </el-select>
        </el-form-item>-->
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
          <!-- <el-button type="success" size='mini' @click="easyUpload">上传</el-button> -->
          <!-- <el-button type="primary" size='mini' @click="duiAccount(1)">对账</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格2 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <!-- 系统交易时间 -->
        <el-table-column prop="sys_createtime" label="系统交易时间" width="120"></el-table-column>
        <!-- 系统订单号 -->
        <el-table-column prop="sys_order_no" show-overflow-tooltip label="系统订单号" width></el-table-column>
        <!-- 系统交易金额 -->
        <el-table-column prop="sys_payfor_amount" label="系统交易金额(元)" width="90"></el-table-column>
        <!-- 系统交易状态 -->
        <el-table-column prop label="系统交易状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.sys_payfor_status == 0">创建</span>
            <span v-if="scope.row.sys_payfor_status == 1">成功</span>
            <span v-else-if="scope.row.sys_payfor_status == 2">失败</span>
            <span v-else-if="scope.row.sys_payfor_status == 3">超时</span>
            <span v-else-if="scope.row.sys_payfor_status == 4">已受理</span>
            <span v-else-if="scope.row.sys_payfor_status == 5">挂起</span>
          </template>
        </el-table-column>
        <!-- 账单交易时间 -->
        <el-table-column prop="bank_tran_date" label="银行交易时间" width="120"></el-table-column>
        <!-- 账单订单编号 -->
        <el-table-column
          prop="bank_requestor_tran_seq_no"
          show-overflow-tooltip
          label="银行订单号"
          width
        ></el-table-column>
        <!-- 账单交易金额 -->
        <el-table-column prop="bank_money" label="银行交易金额(元)" width="90"></el-table-column>
        <!-- 交易手续费 -->
        <el-table-column prop="bank_service_charge" label="交易手续费(元)" width="90"></el-table-column>

        <!-- 交易渠道 -->
        <!-- <el-table-column prop="" label="交易渠道" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.trade_type == 'pay.alipay.jspay'">支付宝</span>
                <span v-else-if="scope.row.trade_type == 'pay.weixin.jspayv2'">微信</span>
                <span v-else-if="scope.row.trade_type == 'pay.unionpay.native'">银联</span>
              </template>
        </el-table-column>-->
        <!-- 对账状态 -->
        <el-table-column prop label="对账状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.reconciliation_status == 1">平账</span>
            <span v-else-if="scope.row.reconciliation_status == 2">短款</span>
            <span v-else-if="scope.row.reconciliation_status == 3">长款</span>
            <span v-else-if="scope.row.reconciliation_status == 4">人工平账</span>
          </template>
        </el-table-column>
         <!-- 操作 v-if="roleId == 11"财务：有权平账-->
        <el-table-column v-if="roleId == 11"  prop label="操作" width>
          <template slot-scope="scope">
            <el-button v-if="scope.row.reconciliation_status != 1 && scope.row.reconciliation_status != 4"  @click="handle_balanceAccount(scope.row)" type="text" size="small">人工平账</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页2 -->
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
import $ from "jquery";
export default {
  name: "transactionCheck",
  data() {
    return {
      roleId: "",
      // 主列表
      tableLoading: false,
      tableData: [],
      // 对账列表
      tableLoading2: false,
      tableData2: [],
      pageTotal2: 1,
      currentPage2: 1,
      // 分页
      pageTotal: 100,
      currentPage: 1,
      // 查询参数
      queryForm: {
        // 交易时间
        allTime: "",
        startTime: "",
        endTime: "",
        lowMoney: "",
        highMoney: "",
        bank_out_trade_no: "",
        sys_createtime: "",
        // 渠道订单编号
        sys_consumeid: "",
        transaction_user: "",
        // 对账状态
        reconciliation_statuss: [
          {
            id: "1",
            txt: "平账"
          },
          {
            id: "2",
            txt: "短款"
          },
          {
            id: "3",
            txt: "长款"
          }
        ],
        reconciliation_status: "",
        // 交易渠道
        trade_types: [
          { id: "pay.alipay.jspay", value: "支付宝" },
          { id: "pay.weixin.jspayv2", value: "微信" },
          { id: "pay.unionpay.native", value: "银联" }
        ],
        trade_type: ""
      },
      isDui: false,
      // 对账参数
      dui_queryForm: {
        channelids:[
          {
            txt:'平安银行',
            id:'1001'
          },
          // {
          //   txt:'快捷通',
          //   id:'1003'
          // }
        ],
        channelid:'',
        date: ""
      },
      rules_dui: {
        channelid:[
          {
            type: "string",
            required: true,
            message: "请选择银行",
            trigger: "change"
          }
        ],
        date: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
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
    this.getTabelDataList(1);
  },

  methods: {
    // 文件上传
    easyUpload() {
      var input = document.createElement("input");
      input.type = "file";
      input.click();
      let _this = this;
      input.onchange = function() {
        var file = input.files[0];
        var form = new FormData();
        form.append("file", file); //第一个参数是后台读取的请求key值
        // form.append("fileName", file.name);
        // form.append("other", "666666"); //实际业务的其他请求参数
        _this.$http
          .post(`${commonUrl.baseUrl}/paymentRecon/savePaymentRecon`, form)
          .then(res => {})
          .catch(err => {});
      };
    },

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
          // 私有
          // 系统交易时间
          sys_createtime: this.queryForm.sys_createtime,
          // 银行订单号
          bank_requestor_tran_seq_no: this.queryForm.bank_out_trade_no,
          // 对账状态
          reconciliation_status: this.queryForm.reconciliation_status,

          lowMoney: this.queryForm.lowMoney,
          highMoney: this.queryForm.highMoney,
          // 系统订单号
          sys_order_no: this.queryForm.sys_consumeid
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/reconSum/selectReconciliationSum`, param)
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res);
            // debugger
            this.tableData = res.data.data.reconciliationSumList;
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
    // 对账
    duiAccount() {
      let param = {
        data: {
          // signInUserId: this.$store.getters.userId,
          // signInRoleId: this.$store.getters.roleId,
          date: this.dui_queryForm.date,
          channelid:this.dui_queryForm.channelid
        }
      };

      if (this.m_valid_addForm("dui_queryForm")) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .post(`${commonUrl.baseUrl}/pinganRecon/savePinganRecon`, param)
          .then(res => {
            if (res.data.code == "0000") {
              loading.close();
              this.m_message(res.data.msg, "success");
              this.handle_refresh();
            } else {
              // 关闭加载
              loading.close();
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      }
    },

    // 人工平账
    handle_balanceAccount(row){

      let param = {
        data:{
          id:row.id,
          reconciliation_status:'4'
        }
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .post(`${commonUrl.baseUrl}/reconSum/updateReconStatus`, param)
        .then(res => {
          if (res.data.code == "0000") {
            loading.close();
            this.m_message(res.data.msg, "success");
            // 刷新
            this.handle_refresh();
          } else {
            loading.close();
            this.m_message(res.data.msg, "warning");
          }
        })
        .catch(err => {});
    },
    // 导出数据
    exportData() {
      const token = getToken();
      let data = {
        signInUserId: this.$store.getters.userId,
        signInRoleId: this.$store.getters.roleId,
        travelerName: this.queryForm.travelerName,
        cardno: this.queryForm.cardno,
        sys_createtime: this.queryForm.sys_createtime,
        phone: this.queryForm.phone,
        withdraw_type: this.queryForm.withdraw_type,
        withdraw_status: this.queryForm.withdraw_status,
        Authorization: token
      };
      // let testStr = `${commonUrl.baseUrl}/withdrawInfo/exportWithdrawInfo?signInUserId=${data.signInUserId}&signInRoleId=${data.signInRoleId}&travelerName=${data.travelerName}&cardno=${data.cardno}&sys_createtime=${data.sys_createtime}&phone=${data.phone}&withdraw_type=${data.withdraw_type}&withdraw_status=${data.withdraw_status}`
      // console.log(data)
      // console.log(testStr)
      // debugger
      // 导出出账
      window.location.href = `${commonUrl.baseUrl}/withdrawInfo/exportWithdrawInfo?travelerName=${data.travelerName}&cardno=${data.cardno}&phone=${data.phone}&withdraw_type=${data.withdraw_type}&withdraw_status=${data.withdraw_status}&sys_createtime=${data.sys_createtime}`;
      // travelerName=${data.travelerName}&cardno=${data.cardno}&sys_createtime=${data.sys_createtime}&phone=${data.phone}&withdraw_type=${data.withdraw_type}&withdraw_status=${data.withdraw_status}
    },
    // 确认交易结果
    handle_confirm_transaction(row) {
      // console.log(row);
      this.$confirm("是否确认交易结果?", "确认交易结果", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
        size: "mini",
        center: true
      }).then(() => {
        let _flag = "";
        if (row.traveler_status == 1) {
          _flag = 3;
        } else {
          _flag = 1;
        }
        // let param = {
        //   data: {
        //     traveler_status: _flag,
        //     travelerid: row.travelerid
        //   }
        // };
        // this.$http
        //   .post(`${commonUrl.baseUrl}/travelerInfo/updateTravelerStatus`, param)
        //   .then(res => {
        //     if (res.data.code == "0000") {
        //       this.m_message(res.data.msg, "success");

        //       // 刷新
        //       this.handle_refresh();
        //     } else {
        //       this.m_message(res.data.msg, "warning");
        //     }
        //   })
        //   .catch(err => {});
      });
    },
    // 刷新
    handle_refresh() {
      this.getTabelDataList(this.currentPage);
      // this.currentPage = 1
    },

    // 查询按钮
    queryData() {
      // console.log(this.queryForm)
      if (this.queryForm.allTime.length > 0) {
        // 修正 开始 和结束 时间
        this.queryForm.startTime = this.queryForm.allTime[0];
        this.queryForm.endTime = this.queryForm.allTime[1];
      }
      console.log(this.queryForm);

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
    // 分页1
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTabelDataList(val);
      //console.log(`当前页: ${val}`);
    },
    // 分页2
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.duiAccount(val);
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
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
    }
  }
};
</script>

<style>
.dui_form > div {
  margin-bottom: 15px !important;
}
</style>
