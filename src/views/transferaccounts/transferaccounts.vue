<template>
  <!-- 转账记录 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        label-width="60px"
        class="demo-form-inline"
      >

        <el-form-item label="时间" prop="order_time">
          <!-- <el-date-picker
            v-model="queryForm.order_time"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="时间"
          ></el-date-picker> -->
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
          ></el-date-picker>
        </el-form-item><el-form-item label="金额">
          <el-col :span="24">
            <el-form-item prop="lowMoney">
              <el-input v-model="queryForm.lowMoney" placeholder="最小金额" class style="width:70px"></el-input>-
            </el-form-item>
            <el-form-item prop="highMoney">
              <el-input v-model="queryForm.highMoney" placeholder="最大金额" class style="width:70px"></el-input>元
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="转账人" prop="src_username">
          <el-input v-model="queryForm.src_username" placeholder="转账人" class="wid_140"></el-input>
        </el-form-item>
        <el-form-item label="转账人电话" prop="srcPhone" label-width="90px">
          <el-input v-model="queryForm.srcPhone" placeholder="转账人电话" class="wid_140"></el-input>
        </el-form-item>
        <el-form-item label="收款人" prop="to_username">
          <el-input v-model="queryForm.to_username" placeholder="收款人" class="wid_140"></el-input>
        </el-form-item>
        <el-form-item label="收款人电话" prop="toPhone" label-width="90px">
          <el-input v-model="queryForm.toPhone " placeholder="收款人电话" class="wid_140"></el-input>
        </el-form-item>
        <!-- 交易状态 -->
        <!-- <el-form-item label="交易状态" prop="order_status">
          <el-select v-model="queryForm.order_status" class="wid_140" placeholder="交易状态">
            <el-option
              v-for="(item, index) in queryForm.order_statuss"
              :key="index"
              :label=" item.txt "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
          <!-- <el-button
            v-if="$store.getters.roleId == 1"
            type="primary"
            size="mini"
            @click="exportData('/order/exportOrder')"
          >导出数据</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="src_username" label="转账人" width></el-table-column>
        <el-table-column  prop="srcPhone" label="转账人电话" width></el-table-column>
        <el-table-column prop="to_username" label="收款人" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column  prop="toPhone" label="收款人电话" width></el-table-column>
        <el-table-column prop label="金额(元)" :show-overflow-tooltip="true" width>
          <template slot-scope="scope">
            <span>{{ scope.row.order_src_amount / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_time" label="时间" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop label="付款方式" width>
          <!-- 0微信 1支付宝 2云闪付  3:代付 字段更改：trade_type_class-->
          <template slot-scope="scope">
            <span v-if="scope.row.consume_type == 0">微信</span>
            <span v-else-if="scope.row.consume_type == 1">支付宝</span>
            <span v-else-if="scope.row.consume_type == 2">云闪付</span>
            <span v-else-if="scope.row.consume_type == 3">代付</span>
            <span v-else-if="scope.row.consume_type == 4">系统转账</span>
            <span v-else-if="scope.row.consume_type == 5">银行转账</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button v-if="scope.row.order_status == 0" @click="handle_confirm_transaction(scope.row)" type="text" size="small">确认交易结果</el-button>
          </template>
        </el-table-column>-->
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
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
import { getToken } from "../../utils/auth.js";
import axios from "axios";
export default {
  name: "transferaccounts",
  data() {
    let validMobile = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确手机号"));
        } else {
          callback();
        }
      }
    };
    return {
      roleId: "",
      // 时间
      pickerOptions_register1: {
        disabledDate: time => {
          let vm = this;
          if (vm.queryForm.endTime != "") {
            return time.getTime() > new Date(vm.queryForm.endTime).getTime();
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions_register2: {
        disabledDate: time => {
          let vm = this;
          if (vm.queryForm.startTime != "") {
            // let minTime = new Date(vm.queryForm.startTime).getTime();
            // const day31 = (31 - 1) * 24 * 3600 * 1000;
            // let maxTime = minTime + day31;
            // if (maxTime > new Date()) {
            //   maxTime = new Date();
            // }
            return (
              time.getTime() < new Date(vm.queryForm.startTime).getTime() ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页
      pageTotal: 1,
      currentPage: 1,
      // 查询参数
      queryForm: {

        order_time: "",
        startTime: "",
        endTime: "",

        highMoney:'',
        lowMoney:'',

        src_username: "",
        srcPhone:'',
        to_username: "",
        toPhone:'',

      },
      value1: ""
    };
  },
  created() {
    // 获取roleId
    this.roleId = this.$store.getters.roleId;

    // 初始化 主列表数据
    this.getTableDataList(1);
  },
  methods: {
    // 初始化 主列表数据
    getTableDataList(pageNum) {
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 注册时间
          startTime:this.queryForm.startTime,
          endTime:this.queryForm.endTime,
          lowMoney: this.queryForm.lowMoney === ''?'': this.queryForm.lowMoney*100,
          highMoney: this.queryForm.highMoney=== ''?'': this.queryForm.highMoney*100,

          src_username: this.queryForm.src_username,
          srcPhone:this.queryForm.srcPhone,
          to_username: this.queryForm.to_username,
          toPhone:this.queryForm.toPhone,
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/order/selecTransferAccounts`, param)
        .then(res => {
          if (res.data.code == "0000") {

            this.tableLoading = false;
            this.tableData = res.data.data.withdrawList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }else{
            this.tableLoading = false;
            this.m_message(res.data.msg, 'warning');
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
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            // pageNum: pageNum,
            // pageSize: 10,
            // 注册时间
            // startTime:this.queryForm.startTime,
            // endTime:this.queryForm.endTime,
            order_time: this.queryForm.order_time,
            userName: this.queryForm.userName,
            upUsername: this.queryForm.upUsername,
            grandUsername: this.queryForm.grandUsername,
            agent_name: this.queryForm.agent_name,
            order_status: this.queryForm.order_statusF
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
    // 查询按钮
    queryData() {
      if (this.queryForm.order_time.length > 0) {
        // 修正 开始 和结束 时间
        this.queryForm.startTime = this.queryForm.order_time[0];
        this.queryForm.endTime = this.queryForm.order_time[1];
      }
      // 参数
      let param = {
        member_status: this.queryForm.member_status,
        userName: this.queryForm.userName
      };
      // console.log(param);
      // console.log(this.queryForm)
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 重置按钮
    resetData(formName) {
      // this.queryForm.userName = "";
      // this.queryForm.member_status = "";

      this.$refs[formName].resetFields();
      // 对于queryForm 下拉
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(this.currentPage);
      // this.currentPage = 1;
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
      //console.log(`当前页: ${val}`);
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
    },

  }
};
</script>
