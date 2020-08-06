<template>
<!-- 用户查询 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        label-width="100px"
        class="demo-form-inline"
      >
        <!-- 注册时间 -->
        <el-form-item label="注册时间" prop="createtime">
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
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="queryForm.username" placeholder="姓名" class="wid_140"></el-input>
        </el-form-item>
        <!-- 会员状态 -->
        <el-form-item label="会员状态" prop="memberType" label-width="68px">
          <el-select v-model="queryForm.memberType" placeholder="会员状态" class="wid_140">
            <el-option
              v-for="(item, index) of queryForm.memberTypes"
              :key="index"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 会员充值时间 -->
        <el-form-item label="会员充值时间" prop="allTime">
          <!-- <el-date-picker
            v-model="queryForm.allTime"
            type="daterange"
            class=""
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="会员充值时间"
          ></el-date-picker>-->
          <el-date-picker
            v-model="queryForm.startMemberTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            :picker-options="pickerOptions_memberTime1"
          ></el-date-picker>
          <el-date-picker
            v-model="queryForm.endMemberTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            :picker-options="pickerOptions_memberTime2"
          ></el-date-picker>
        </el-form-item>
        <!-- 所属上级 -->
        <el-form-item label="所属上级" prop="up_username">
          <el-input v-model="queryForm.up_username" placeholder="所属上级" class="wid_140"></el-input>
        </el-form-item>
        <!-- 一级推荐人 -->
        <el-form-item label="一级推荐人" prop="grand_username">
          <el-input v-model="queryForm.grand_username" placeholder="一级推荐人" class="wid_140"></el-input>
        </el-form-item>
        <!-- 所属机构 -->
        <el-form-item label="所属机构" prop="agent_name">
          <el-input v-model="queryForm.agent_name" placeholder="所属机构" class="wid_140"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话" prop="phone" label-width="40px">
          <el-input v-model="queryForm.phone" placeholder="电话" class="wid_140"></el-input>
        </el-form-item>
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
          <el-button type="primary" size="mini" @click="exportData('/userInfo/exportUser')">导出数据</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="username" label="用户姓名" width="80"></el-table-column>
        <el-table-column prop label="会员状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.memberType == 1">是</span>
            <span v-else-if="scope.row.memberType == 2">否</span>
          </template>
        </el-table-column>
        <!-- 会员充值时间  member_recharge_time-->
        <el-table-column
          prop="member_recharge_time"
          label="会员充值时间"
          :show-overflow-tooltip="true"
          width="110"
        ></el-table-column>
        <el-table-column prop="agent_name" label="所属机构" :show-overflow-tooltip="true" width="80"></el-table-column>
        <el-table-column prop="createtime" label="注册时间" :show-overflow-tooltip="true" width="110"></el-table-column>
        <el-table-column prop="up_username" label="所属上级" :show-overflow-tooltip="true" width="80"></el-table-column>
        <el-table-column prop="grand_username" label="一级推荐人" width="100"></el-table-column>
        <el-table-column prop="phone" label="电话" width="110"></el-table-column>
        <!-- 所属角色 -->
        <el-table-column prop="user_type" label="所属角色" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.user_type == 0">机构代理</span>
            <span v-else-if="scope.row.user_type == 1">普通用户</span>
            <span v-else-if="scope.row.user_type == 2">合伙人</span>
            <span v-else-if="scope.row.user_type == 3">业务员</span>
          </template>
        </el-table-column>
        <!-- 审核状态 -->
        <el-table-column prop="" label="审核状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.agent_check == 1">待审核</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button v-if="roleId == 1" @click="handle_detail(scope.row)" type="text" size="small">详细信息</el-button>
            <el-button @click="handle_bankinfo(scope.row)" type="text" size="small">银行卡信息</el-button>
            <!-- 重置密码  roleId==1 -->
            <el-button v-if="roleId == 1" @click="reset_password(scope.row)" type="text" size="small">密码重置</el-button>
            <!-- roleid 管理员1 业务员4  2机构  3合伙人    1、4不显示, 2,3登录且为普通用户时显示 如果待审核状态agent_check 1 也不显示该操作项-->
            <el-button v-if="roleId != 1 && roleId != 4  && scope.row.user_type == 1  && scope.row.agent_check != 1"  @click="modi_role(scope.row)" type="text" size="small">调整角色</el-button>
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
    <!-- M3 dialog用户详情-->
    <el-dialog
      title="用户详情"
      :visible.sync="detail_dialogVisible"
      width
      center
      :close-on-click-modal="false"
      v-loading="detail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="agent_detail"
      >
      <!-- 业务信息 -->
      <el-form
        :inline="true"
        :model="detail_form"
        ref="detail_form"
        class="demo-form-inline"
        label-width="68px"
        disabled
      >
        <el-form-item label="用户姓名" prop="realname">
          <el-input v-model="detail_form.realname" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="detail_form.phone" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="identity_no">
          <el-input v-model="detail_form.identity_no" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="活体数据">
          <div class="demo-image card_photo">
            <el-row :gutter="20">
              <el-col v-for="(item,index) in all_url_srcList" :key="index" :span="5">

                <el-image
                  style="width: 200px; height: 100px"
                  :src="item"
                  :preview-src-list="all_url_srcList"
                  fit="contain"
                ></el-image>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 银行卡信息 -->
    <el-dialog
      title="银行卡信息"
      :visible.sync="bank_dialogVisible"
      width="50%"
      center
      top="5vh"
      :close-on-click-modal="false"
      v-loading="bank_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="travel_record"
      >
      <!-- 业务信息 -->
      <div>
        <!-- 表头 -->
        <!-- <header style="margin-bottom:8px">
          <div class="inl_block mar_r10">
            <span class="pp_label">ID:</span>
            <span>{{ bankinfo_form.customid }}</span>
          </div>
          <div class="inl_block">
            <span class="pp_label">姓名:</span>
            <span>{{ bankinfo_form.name }}</span>
          </div>
        </header>-->
        <!-- 表格 -->
        <el-table
          :data="detail_tableData"
          v-loading="detail_tableLoading"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column prop="card_username" label="开户名" width></el-table-column>
          <el-table-column prop="card_bank" label="开户行" width></el-table-column>
          <el-table-column prop="cardno" label="银行账号" width></el-table-column>
          <el-table-column prop label="开户地" width>
            <template slot-scope="scope">
              <span>{{ scope.row.card_province + scope.row.card_city}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block mar_t10">
          <el-pagination
            @current-change="detail_handleCurrentChange"
            :current-page="detail_currentPage"
            :total="detail_pageTotal"
            background
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bank_dialogVisible = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 调整角色 -->
    <el-dialog
      title="调整角色"
      :visible.sync="modi_rate_dialogVisible"
      width="30%"
      center
      :close-on-click-modal="false"
      v-loading="modi_rate_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="modi_rate"
      >
      <!-- 业务信息 -->
      <el-form
        :model="modi_rate_form"
        :rules="modi_rate_rules"
        ref="modi_rate_form"
        class="demo-ruleForm valid_form"
      >
        <el-form-item label="选择角色" prop="user_type">
          <el-select v-model="modi_rate_form.user_type" placeholder="会员状态" class="wid_140">
            <el-option
              v-for="(item, index) of modi_rate_form.user_types"
              :key="index"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分润比例" prop="commission_proportion">
          <el-input v-model="modi_rate_form.commission_proportion" placeholder="分润比例" class="wid_140"></el-input>‰
          <span style="color:green;font-size:12px;">输入数字小于2且最多保留一位小数</span>
        </el-form-item>

        <el-form-item label="开户分成" prop="active_fee">
          <el-input v-model="modi_rate_form.active_fee" placeholder="开户分成" class="wid_140"></el-input>
          <span style="color:green;font-size:12px;">输入数字小于20</span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="modi_rate_dialogVisible = false" size="mini">关 闭</el-button>
        <el-button type="primary" @click="save_modi_role" size="mini">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
import { getToken } from "../../utils/auth.js";
import {
  isvalidPhone,
  validNum100,
  filterSpace,
  validZNum,
  validNum20,
  validNum2,
  getFloat
} from "../../utils/validate";
import axios from "axios";
export default {
  name: "userList",
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
    // 分润比例
    let validRate_commision = (val, value, callback) => {
      if (!value) {
        callback(new Error("请输入值"));
      } else if (!validNum2(value)) {
        callback(new Error("请输入0-2之间的正数,且小数位数不得多于一位"));
      } else {
        callback();
      }

    };
    // 开户分成
    let validRate_active = (val, value, callback) => {
      if (!value) {
        callback(new Error("请输入值"));
      } else if (!validNum20(value)) {
        callback(new Error("请输入0-20之间的正数"));
      } else {
        callback();
      }
    };
    return {
      // 注册时间
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
            let minTime = new Date(vm.queryForm.startTime).getTime();
            const day31 = (31 - 1) * 24 * 3600 * 1000;
            let maxTime = minTime + day31;
            if (maxTime > new Date()) {
              maxTime = new Date();
            }
            return (
              time.getTime() < new Date(vm.queryForm.startTime).getTime() ||
              time.getTime() > maxTime
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      // 会员充值时间
      pickerOptions_memberTime1: {
        disabledDate: time => {
          let vm = this;
          if (vm.queryForm.endMemberTime != "") {
            return (
              time.getTime() > new Date(vm.queryForm.endMemberTime).getTime()
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions_memberTime2: {
        disabledDate: time => {
          let vm = this;
          if (vm.queryForm.startMemberTime != "") {
            return (
              time.getTime() <
                new Date(vm.queryForm.startMemberTime).getTime() ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      roleId: "",
      // 地图
      districtSearch: "",
      // 主列表
      tableLoading: false,
      tableData: [],
      // 银行详情页
      detail_tableData: [],
      detail_tableLoading: false,
      // 分页
      pageTotal: 1,
      currentPage: 1,
      detail_pageTotal: 0,
      detail_currentPage: 1,
      // 查询参数
      queryForm: {
        phone:'',
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],
        // 省市
        province_code: "",
        city_code: "",

        // 注册时间段 姓名 所属上级 一级推荐人 所属机构
        memberTypes: [
          {
            id: "1",
            value: "是"
          },
          {
            id: "2",
            value: "否"
          }
        ],
        memberType: "",
        // 会员充值时间
        startMemberTime: "",
        endMemberTime: "",
        allTime: "",

        createtime: "",
        startTime: "",
        endTime: "",
        username: "",
        up_username: "",
        grand_username: "",
        agent_name: ""
      },
      value1: "",
      // 详情
      detail_dialogVisible: false,
      detail_loading: false,
      bank_dialogVisible: false,
      bank_loading: false,
      // 预览图 身份证 职业照
      idcard_back_url_srcList: [],
      idcard_front_url_srcList: [],
      blink_url_srcList:[],
      head_url_srcList:[],
      openmouth_url_srcList:[],
      shake_url_srcList:[],
      // 用户详情
      detail_form: {
        realname: "",
        phone: "",
        identity_no: "",
        // 身份证 照片
        idcard_back_url: "",
        idcard_front_url: "",
        // 活体图片
        blink_url:'',
        head_url:'',
        openmouth_url:'',
        shake_url:'',


        identityid:'',
      },
      // 银行信息
      bankinfo_form: {
        customid: "",
        name: "",
        row: ""
      },
      // 调整角色
      modi_rate_dialogVisible: false,
      modi_rate_loading: false,
      modi_rate_form: {
        commission_proportion: "",
        active_fee: "",
        userId:'',
        user_type:'',
        user_types:[
          // {
          //   id:0,
          //   value:'机构代理'
          // },
          {
            id:1,
            value:'普通用户'
          },
          {
            id:2,
            value:'合伙人'
          },
          {
            id:3,
            value:'业务员'
          }
        ]
      },
      modi_rate_rules: {
        // 选择角色
        user_type:[
           { required: true, message: '请选择角色', trigger: 'change' }
        ],
        // 分润比例
        commission_proportion: [
          { required: true, validator: validRate_commision, trigger: "blur" },
          // { type: "number", message: "分润比例必须为数字" }
        ],
        // 开户分成
        active_fee: [
          { required: true, validator: validRate_active, trigger: "blur" },
          // { type: "number", message: "开户分成必须为数字" }
        ]
      },
      all_url_srcList:[],
    };
  },
  created() {
    // 获取roleId
    this.roleId = this.$store.getters.roleId;
    // 根据roleId控制角色类的显示
    //console.log(this.roleId)
    // 初始化 地图plugin
    this.initMap();
    // 初始化 省份
    this.initProvinces();
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
          startTime: this.queryForm.startTime,
          endTime: this.queryForm.endTime,
          // createtime: this.queryForm.createtime,
          // 会员状态
          memberType: this.queryForm.memberType,
          // 会员充值时间
          startMemberTime: this.queryForm.startMemberTime,
          endMemberTime: this.queryForm.endMemberTime,
          username: this.queryForm.username,
          up_username: this.queryForm.up_username,
          grand_username: this.queryForm.grand_username,
          agent_name: this.queryForm.agent_name,
          phone:this.queryForm.phone
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/userInfo/selectUserInfo`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableLoading = false;
            this.tableData = res.data.data.userInfoList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }
        })
        .catch(err => {});
    },
    // 详情操作
    handle_detail(row) {
      // 清空一下 预览图片
     this.clearPreviewImgs();
      this.detail_dialogVisible = true;
      // 清空详情信息
      this.resetData("detail_form");
      let param = {
        data: {
          userid: row.userid
        }
      };
      this.detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/userInfo/selectIdentity`, param)
        .then(res => {
          if (res.data.code == "0000") {

            if (res.data.data.identityList.length > 0) {
              let result = res.data.data.identityList[0];
              // 用户姓名 电话 身份证号  活体数据图
              this.detail_form.realname = result.realname;
              this.detail_form.phone = result.phone;
              this.detail_form.identity_no = result.identity_no;

              this.detail_form.idcard_back_url = result.idcard_back_url;
              this.detail_form.idcard_front_url = result.idcard_front_url;
              // 大图预览
              // this.idcard_back_url_srcList.push(result.idcard_back_url),
              this.idcard_front_url_srcList.push(result.idcard_front_url);
              this.all_url_srcList.push(result.blink_url,result.head_url,result.openmouth_url,result.shake_url)
            }
            this.detail_loading = false;
          }else{
            this.detail_loading = false;
            this.m_message(res.data.msg, 'warning');
          }
        })
        .catch(err => {});
    },
    // 银行卡信息展示
    handle_bankinfo(row) {
      this.bank_dialogVisible = true;
      // 取工作记录表的数据
      this.getTableDataList_detail(row, 1);
    },
    // 获取工作记录列表
    getTableDataList_detail(row, pageNum) {
      this.bankinfo_form.row = row;
      let param = {
        data: {
          userid: row.userid,
          pageNum: pageNum,
          pageSize: 10
        }
      };
      this.detail_tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/userInfo/selectCard`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.detail_tableData = res.data.data.cardList;
            //  分页
            this.detail_pageTotal = res.data.data.page.pageTotal;
            this.detail_tableLoading = false;
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
            startTime: this.queryForm.startTime,
            endTime: this.queryForm.endTime,
            // createtime: this.queryForm.createtime,
            // 会员状态
            memberType: this.queryForm.memberType,
            // 会员充值时间
            startMemberTime: this.queryForm.startMemberTime,
            endMemberTime: this.queryForm.endMemberTime,
            username: this.queryForm.username,
            up_username: this.queryForm.up_username,
            grand_username: this.queryForm.grand_username,
            agent_name: this.queryForm.agent_name
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
    // 调整角色
    modi_role(row){
      // 开弹框
      this.modi_rate_dialogVisible = true;
      this.modi_rate_form.userId = row.userid;
      // 初始化数据.......
      // 根据当前登陆者角色 显示角色类:roleId:2机构3合伙人
      // 机构可以调整普通用户=>业务员、合伙人
      // 合伙人可以调整普通用户=>业务员
      if(this.roleId == 2){
        this.modi_rate_form.user_types = [
          {
            id:2,
            value:'合伙人'
          },
          {
            id:3,
            value:'业务员'
          }
        ];
      }else if(this.roleId == 3){
        this.modi_rate_form.user_types = [
          {
            id:3,
            value:'业务员'
          }
        ];
      }


    },
    // 保存调整角色
    save_modi_role() {
      if(this.m_valid_addForm('modi_rate_form')){
        // 修正小数位数
        // this.modi_rate_form.commission_proportion = getFloat(this.modi_rate_form.commission_proportion,1);
        let param = {
          data:{
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            userId:this.modi_rate_form.userId,
            commission_proportion:this.modi_rate_form.commission_proportion*10,
            active_fee:this.modi_rate_form.active_fee*100,
            user_type:this.modi_rate_form.user_type
          }
        };
        // console.log(param.data)
        // debugger

        this.modi_rate_loading = true;
        this.$http
        .post(`${commonUrl.baseUrl}/agent/saveParterOrSalerOrAgent`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // 处理数据。。。。
            this.modi_rate_loading = false;
            this.m_message(res.data.msg, 'success')
            this.modi_rate_dialogVisible = false;
            // 更新数据
            this.handle_refresh();
          }else{
            this.modi_rate_loading = false;
            this.m_message(res.data.msg, 'warning');
          }
        })
        .catch(err => {});
      }
    },

     // 清空预览图
    clearPreviewImgs(){
      this.idcard_back_url_srcList = [];
      this.idcard_front_url_srcList = [];
      this.blink_url_srcList = [];
      this.head_url_srcList = [];
      this.openmouth_url_srcList=[];
      this.shake_url_srcList=[];

      this.all_url_srcList = [];
    },
    // 重置密码
    reset_password(row) {

      let _flag_title = `${row.username}:密码重置`
      this.$confirm('是否要重置密码', _flag_title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        size: "mini",
        center: true
      }).then(() => {
        let param = {
          data: {
            userId:row.userid
          }
        };
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http
          .post(`${commonUrl.baseUrl}/userInfo/reSetUserPassword`, param)
          .then(res => {
            if (res.data.code == "0000") {
              loading.close()
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
               loading.close()
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },

    // 查询按钮
    queryData() {
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 重置按钮
    resetData(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }

      // 注册时间
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";

      // 会员充值时间
      this.queryForm.startMemberTime = "";
      this.queryForm.endMemberTime = "";
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
    // 工作记录分页
    detail_handleCurrentChange(val) {
      this.detail_currentPage = val;
      // 获取当前页工作记录
      this.getTableDataList_detail(this.bankinfo_form.row, val);
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
    // 省份change事件
    changeOption_province(e) {
      // 参数收集
      this.queryForm.province_param = {
        adcode: e,
        txt: provinces.province_list[e]
      };
      // console.log(e)
      // console.log(provinces.province_list[e])
      // 赋值cities (先清理 后赋值)
      this.queryForm.cities = [];
      this.queryForm.city_code = "";
      this.queryCity(provinces.province_list[e], "queryForm");
    },
    // 查 市区 txt: String 省份名,dataOrigin 是指 add_form  或是queryeForm 这种 父级数据源
    queryCity(txt, dataOrigin) {
      let vm = this;
      // 搜索所有省/直辖市信息

      this.districtSearch.search(txt, function(status, result) {
        // console.log(result)
        // 查询成功时，result即为对应的行政区信息
        for (let item of result.districtList[0].districtList) {
          vm[dataOrigin].cities.push({
            adcode: item.adcode,
            city: item.name
          });
        }
      });
    },
    // 市区change事件
    changeOption_city(e) {},
    // 初始化 省份数据
    initProvinces() {
      // 处理一下 数据
      let arr = [];
      for (let i in provinces.province_list) {
        arr.push({
          adcode: i,
          province: provinces.province_list[i]
        });
      }
      this.queryForm.regions = arr;
      // 详情
      //this.detail_form.regions = this.detail_form.account_regions = arr;
      // 详情并修改
      //this.agent_detail_form.regions = this.agent_detail_form.account_regions = arr;
    },
    // 初始化 地图
    initMap() {
      let vm = this;
      //利用高德地图API 获取 所有省
      AMap.plugin("AMap.DistrictSearch", function() {
        vm.districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          level: "city",
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 1
        });
      });
    }
  }
};
</script>
