<template>
<!-- 审核认证 -->
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
            v-model="queryForm.startRegisteredTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            :picker-options="pickerOptions_register1"
          ></el-date-picker>
          <el-date-picker
            v-model="queryForm.endRegisteredTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            :picker-options="pickerOptions_register2"
          ></el-date-picker>
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="用户姓名" prop="realname">
          <el-input v-model="queryForm.realname" placeholder="姓名" class="wid_140"></el-input>
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
        <el-table-column prop="realname" label="用户姓名" width=""></el-table-column>
        <el-table-column prop="agent_name" label="所属机构" :show-overflow-tooltip="true" width=""></el-table-column>
        <el-table-column prop="createtime" label="注册时间" :show-overflow-tooltip="true" width=""></el-table-column>
        <el-table-column prop="up_username" label="所属上级" :show-overflow-tooltip="true" width=""></el-table-column>
        <el-table-column prop="grand_username" label="一级推荐人" width=""></el-table-column>
        <el-table-column prop="phone" label="电话" width=""></el-table-column>
        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button v-if="roleId == 1"  @click="handle_check(scope.row)" type="text" size="small">审核</el-button>
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


    <!-- M3 dialog认证审核-->
    <el-dialog
      title="认证审核用户"
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
        <el-form-item label="身份证">
          <!-- 证件照 -->
          <div class="demo-image card_photo">
            <el-row :gutter="20">
              <el-col :span="10">
                <!-- <span class="demonstration">身份证正面</span> -->
                <el-image
                  style="width: 200px; height: 100px"
                  :src="detail_form.idcard_front_url"
                  :preview-src-list="idcard_front_url_srcList"
                  fit="contain"
                ></el-image>
              </el-col>
              <!-- <el-col :span="10" :offset="2">

                <el-image
                  style="width: 200px; height: 100px"
                  :src="detail_form.idcard_back_url"
                  :preview-src-list="idcard_back_url_srcList"
                  fit="contain"
                ></el-image>
              </el-col> -->
            </el-row>
          </div>
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
              <!-- <el-col :span="5">

                <el-image
                  style="width: 200px; height: 100px"
                  :src="detail_form.idcard_back_url"
                  :preview-src-list="idcard_back_url_srcList"
                  fit="contain"
                ></el-image>
              </el-col> -->
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>

        <el-button type="warning" @click="check_resolve('0')" size="mini">审核拒绝</el-button>
        <el-button type="primary" @click="check_resolve('1')" size="mini">审核通过</el-button>
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
  name: "identityCheckList",
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
      // 注册时间
      pickerOptions_register1: {
        disabledDate: time => {
          let vm = this;
          if (vm.queryForm.endRegisteredTime != "") {
            return time.getTime() > new Date(vm.queryForm.endRegisteredTime).getTime();
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions_register2: {
        disabledDate: time => {
          let vm = this;
          if (vm.queryForm.startRegisteredTime != "") {
            let minTime = new Date(vm.queryForm.startRegisteredTime).getTime();
            const day31 = (31 - 1) * 24 * 3600 * 1000;
            let maxTime = minTime + day31;
            if (maxTime > new Date()) {
              maxTime = new Date();
            }
            return (
              time.getTime() < new Date(vm.queryForm.startRegisteredTime).getTime() ||
              time.getTime() > maxTime
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },

      roleId: "",

      // 主列表
      tableLoading: false,
      tableData: [],

      // 分页
      pageTotal: 1,
      currentPage: 1,
      detail_pageTotal: 0,
      detail_currentPage: 1,
      // 查询参数
      queryForm: {
        phone:'',
        // 注册时间段 姓名 所属上级 一级推荐人 所属机构
        createtime: "",
        startRegisteredTime: "",
        endRegisteredTime: "",

        realname: "",
        up_username: "",
        grand_username: "",
        agent_name: ""
      },
      value1: "",
      // 预览图 身份证
      idcard_back_url_srcList: [],
      idcard_front_url_srcList: [],
      // 预览图 活体图
      blink_url_srcList:[],
      head_url_srcList:[],
      openmouth_url_srcList:[],
      shake_url_srcList:[],
      all_url_srcList:[],
      // 用户详情
      detail_dialogVisible: false,
      detail_loading: false,
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


        // 为审核拒绝准备数据
        denyData:{
          cosHeadUrl:'',
          cosOpenmouthUrl:'',
          cosShakeUrl:'',
          cosBlinkUrl:'',
          cosIdcardFrontUrl:''
        }
      },

    };
  },
  created() {
    // 获取roleId
    this.roleId = this.$store.getters.roleId;
    // 根据roleId控制角色类的显示
    //console.log(this.roleId)

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
          startRegisteredTime: this.queryForm.startRegisteredTime,
          endRegisteredTime: this.queryForm.endRegisteredTime,
          realname: this.queryForm.realname,
          up_username: this.queryForm.up_username,
          grand_username: this.queryForm.grand_username,
          agent_name: this.queryForm.agent_name,
          phone:this.queryForm.phone
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/identityInfo/selectIdentityInfoNotCheckList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableLoading = false;
            this.tableData = res.data.data.identityInfoNotCheckList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }
        })
        .catch(err => {});
    },
    // 认证审核操作
    handle_check(row) {
      // 清空一下 预览图片
      this.clearPreviewImgs();
      this.detail_dialogVisible = true;
      // 清空详情信息
      this.resetData("detail_form");
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          userid: row.userid
        }
      };
      this.detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/identityInfo/selectIdentityInfo`, param)
        .then(res => {
          if (res.data.code == "0000") {
            let result = res.data.data.identityInfo;

            // 用户姓名 电话 身份证号  活体数据图
            this.detail_form.identityid = result.identityid;
            this.detail_form.realname = result.realname;
            this.detail_form.phone = result.phone;
            this.detail_form.identity_no = result.identity_no;
            // this.detail_form.idcard_back_url = result.idcard_back_url;
            this.detail_form.idcard_front_url = result.idcard_front_url;
            this.detail_form.blink_url=result.blink_url;
            this.detail_form.head_url=result.head_url;
            this.detail_form.openmouth_url=result.openmouth_url;
            this.detail_form.shake_url=result.shake_url;

            this.all_url_srcList.push(result.blink_url,result.head_url,result.openmouth_url,result.shake_url)
            // 大图预览
            // this.idcard_back_url_srcList.push(result.idcard_back_url),
            this.idcard_front_url_srcList.push(result.idcard_front_url);

            // 为拒绝准备数据
            this.detail_form.denyData.cosHeadUrl = result.cosHeadUrl;
            this.detail_form.denyData.cosOpenmouthUrl = result.cosOpenmouthUrl;
            this.detail_form.denyData.cosShakeUrl = result.cosShakeUrl;
            this.detail_form.denyData.cosBlinkUrl = result.cosBlinkUrl;
            this.detail_form.denyData.cosIdcardFrontUrl = result.cosIdcardFrontUrl;

            this.detail_loading = false;
          }else{
            this.detail_loading = false;
            this.m_message(res.data.msg, 'warning');
          }
        })
        .catch(err => {});
    },
    // 审核通过/审核不通过
    check_resolve(status){
      let param = {
        data:{
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          identityid:this.detail_form.identityid,
          idcard_check_status:status,
          phone:this.detail_form.phone
        }
      }
      if(status == '0'){
        param.data.cosHeadUrl = this.detail_form.denyData.cosHeadUrl;
        param.data.cosOpenmouthUrl = this.detail_form.denyData.cosOpenmouthUrl;
        param.data.cosShakeUrl =this.detail_form.denyData.cosShakeUrl;
        param.data.cosBlinkUrl = this.detail_form.denyData.cosBlinkUrl;
        param.data.cosIdcardFrontUrl =this.detail_form.denyData.cosIdcardFrontUrl;
      }
      this.detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/identityInfo/updateIdentityCheckStatus`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.m_message(res.data.msg, 'success')
            this.detail_loading = false;
            // 关闭并更新
            this.detail_dialogVisible = false;
            this.handle_refresh();
          }else{
            this.detail_loading = false;
            this.m_message(res.data.msg, 'warning');
          }
        })
        .catch(err => {});
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
            startRegisteredTime: this.queryForm.startRegisteredTime,
            endRegisteredTime: this.queryForm.endRegisteredTime,
            // createtime: this.queryForm.createtime,
            // 会员状态
            memberType: this.queryForm.memberType,
            // 会员充值时间
            startMemberTime: this.queryForm.startMemberTime,
            endMemberTime: this.queryForm.endMemberTime,
            realname: this.queryForm.realname,
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
      this.queryForm.startRegisteredTime = "";
      this.queryForm.endRegisteredTime = "";

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
