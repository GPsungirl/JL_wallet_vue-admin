<template>
  <!-- 向导管理>>客服管理 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        class="demo-form-inline"
      >
        <!-- 查询 -->
        <el-form-item>
          <!-- 新增客服 roleId 1 7有权限 主管和运营有权限-->
          <el-button
            v-if="roleId == 1 || roleId == 7"
            type="primary"
            size="mini"
            @click="handle_add"
          >新增客服</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="customid" label="客服ID" width="80"></el-table-column>
        <!-- 名称 -->
        <el-table-column prop="name" label="客服名称" width="80"></el-table-column>


        <!-- 电话 -->
        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
        <!-- 贝壳分成 -->
        <el-table-column prop label="贝壳分成" width="80px">
          <template slot-scope="scope">{{ scope.row.virtual_rate +'%'}}</template>
        </el-table-column>

        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <!-- 工作记录 -->
            <el-button @click="handle_workRecord(scope.row)" type="text" size="small">工作记录</el-button>
            <!-- 调整分成 -->
            <el-button @click="handle_modiRate(scope.row)" type="text" size="small">调整分成</el-button>
            <!-- 视频审核 -->
            <el-button @click="handle_examine(scope.row)" type="text" size="small">视频审核</el-button>
            <!-- 视频设置 -->
            <el-button @click="handle_choice(scope.row)" type="text" size="small">视频设置</el-button>
            <!-- 转为向导 -->
            <el-button @click="handle_toBeGuider(scope.row)" type="text" size="small">转为向导</el-button>
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
    <!-- M3 审核视频dialog-->
    <el-dialog
      title="审核视频"
      :visible.sync="detail_dialogVisible"
      width="50%"
      center
      append-to-body
      :before-close="close_examine"
      :close-on-click-modal="false"
      v-loading="detail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="agent_detail">

      <!-- 业务信息 -->

      <el-table
        :data="detail_tableData"
        v-loading="detail_tableLoading"
        border
        stripe
        style="width: 100%"
      >
        <!-- 视频名 -->
        <el-table-column prop="file_id" label="视频名" width></el-table-column>
        <!-- 时长 -->
        <el-table-column prop="duration" label="视频时长(秒)" width></el-table-column>
        <!-- 操作 -->
        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button @click="handle_view(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handle_use(scope.row)" type="text" size="small">可用</el-button>
            <el-button @click="handle_delete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 视频分页 -->
      <!-- <div class="block mar_t10">
        <el-pagination
          @current-change="handleCurrentChange_video"
          :current-page="currentPage_video"
          :total="pageTotal_video"
          background
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="close_examine" size="mini">关 闭</el-button>
      </span>
      <!-- 视频框(内层) -->
      <el-dialog
        title="视频查看"
        :visible.sync="video_dialogVisible"
        width="50%"
        center
        append-to-body
        :before-close="handleDialogClose_video"
        :close-on-click-modal="false"
        v-loading="video_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="agent_detail">

        <div id="dplayer" style="height:300px"></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close_video" size="mini">关 闭</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <!-- M4 dialog 工作记录-->
    <el-dialog
      title="工作记录"
      :visible.sync="workRecord_dialogVisible"
      width="50%"
      center
      append-to-body
      :before-close="handle_close"
      :close-on-click-modal="false"
      v-loading="workRecord_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="agent_detail">

      <!-- M1 查询区域 -->
      <div class="query_fields pad_b_no">
        <el-form
          :inline="true"
          :model="workRecord_queryForm"
          ref="workRecord_queryForm"
          size="mini"
          class="demo-form-inline"
        >
          <!-- 所属机构 -->
          <el-form-item label="直播月份" prop="live_month">
            <el-date-picker
              v-model="workRecord_queryForm.live_month"
              type="month"
              value-format="yyyyMM"
              placeholder="选择月"
            ></el-date-picker>
          </el-form-item>
          <!-- 查询 -->
          <el-form-item>
            <el-button type="primary" size="mini" @click="queryData_workRecord">查询</el-button>
            <el-button type="success" size="mini" @click="resetData('workRecord_queryForm')">重置</el-button>
            <el-button type="primary" size="mini" @click="handle_refresh_workRecord">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="workRecord_tableData"
        v-loading="workRecord_tableLoading"
        border
        stripe
        style="width: 100%"
      >
        <!-- id -->
        <el-table-column prop="customid" label="客服ID" width></el-table-column>
        <!-- 姓名 -->
        <el-table-column prop="name" label="姓名" width></el-table-column>
        <!-- 电话 -->
        <el-table-column prop="phone" label="电话" width="150"></el-table-column>
        <!-- 月份-->
        <el-table-column prop="live_month" label="月份" width></el-table-column>
        <!-- 时长 -->
        <el-table-column prop label="直播时长" width="80px">
          <template slot-scope="scope">
            <span>{{ Math.round(scope.row.live_duration_month / 60) +'分钟'}}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button @click="handle_recordDetail(scope.row)" type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页:工作记录 -->
      <div class="block mar_t10">
        <el-pagination
          @current-change="handleCurrentChange_workRecord"
          :current-page="currentPage_workRecord"
          :total="pageTotal_workRecord"
          background
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="workRecord_dialogVisible = false" size="mini">关 闭</el-button>
      </span>
      <!-- 工作记录详情(内层) -->
      <el-dialog
        title="查看详情"
        :visible.sync="recordDetail_dialogVisible"
        width="50%"
        center
        append-to-body
        :before-close="handleDialogClose"
        :close-on-click-modal="false"
        v-loading="recordDetail_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="agent_detail"
      >
        <!-- 业务信息 -->
        <div>
          <!-- 表头 -->
          <header style="margin-bottom:8px">
            <div class="inl_block mar_r10">
              <span class="pp_label">客服ID:</span>
              <span>{{ workRecord_queryForm.customid }}</span>
            </div>
            <div class="inl_block">
              <span class="pp_label">姓名:</span>
              <span>{{ workRecord_queryForm.name }}</span>
            </div>
          </header>
          <!-- 表格 -->
          <el-table
            :data="recordDetail_tableData"
            v-loading="recordDetail_tableLoading"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column prop label="开始工作时间" width>
              <template
                slot-scope="scope"
              >{{ getFormatDate(new Date(scope.row.live_endtime) - scope.row.live_time_length*1000) }}</template>
            </el-table-column>
            <el-table-column prop="live_endtime" label="结束工作时间" width></el-table-column>

            <el-table-column prop label="直播时长" width>
              <template slot-scope="scope">{{ Math.round(scope.row.live_time_length / 60) + '分钟'}}</template>
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
          <el-button @click="recordDetail_dialogVisible = false" size="mini">关 闭</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <!-- M5 设置视频dialog-->
    <el-dialog
        title="设置视频"
        :visible.sync="videoChoice_dialogVisible"
        width="50%"
        center
        append-to-body
        :before-close="handle_closeVideoChoice"
        :close-on-click-modal="false"
        v-loading="videoChoice_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="agent_detail"
        >
        <!-- 业务信息 -->
        <p>共{{ videoChoice_num }}条视频记录</p>
        <el-table :data="videoChoice_tableData" v-loading="videoChoice_tableLoading" border stripe style="width: 100%">
            <!-- 视频名 -->
            <el-table-column prop="file_id" label="视频名" width="" >
            </el-table-column>
            <!-- 时长 -->
            <el-table-column prop="duration" label="视频时长(秒)" width="">
            </el-table-column>
            <!-- 状态 -->
            <el-table-column label="状态" width="">
                <template slot-scope="scope">
                    <span v-if="scope.row.video_status == 1">可选择</span>
                    <span v-if="scope.row.video_status == 3">已选择</span>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column prop="" label="操作" width="">
                <template slot-scope="scope">
                  <el-button @click="handle_view_videoChoice(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="handle_select_videoChoice(scope.row)" type="text" size="small">选择</el-button>
                  <el-button @click="handle_delete_videoChoice(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handle_closeVideoChoice" size="mini">关 闭</el-button>
        </span>
        <!-- 视频框(内层) -->
        <el-dialog
            title="视频查看"
            :visible.sync="videoChoiceView_dialogVisible"
            width="50%"
            center
            append-to-body
            :before-close="handleDialogClose_videoChoiceView"
            :close-on-click-modal="false"
            v-loading="videoChoiceView_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="agent_detail">
            <div id="dplayerChoice" style="height:300px"></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleDialogClose_videoChoiceView" size="mini">关 闭</el-button>
            </span>
        </el-dialog>
    </el-dialog>
    <!-- M7 dialog新增客服-->
    <el-dialog
      title="新增客服"
      :visible.sync="add_dialogVisible"
      width="55%"
      top="8vh"
      class
      center
      :close-on-click-modal="false"
      v-loading="add_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">

      <el-form
        :inline="true"
        :model="add_form_traveler"
        :rules="add_bank_traveler_rules"
        ref="add_form_traveler"
        label-width="80px"
        class="demo-form-inline valid_form"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="add_form_traveler.name" placeholder="姓名" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="add_form_traveler.phone" placeholder="联系电话" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="贝壳分成" prop="virtual_rate">
          <el-input
            v-model.number="add_form_traveler.virtual_rate"
            placeholder="贝壳分成"
            class="wid_181"
          ></el-input>%
        </el-form-item>
        <el-form-item label="用户ID" prop="customId">
          <el-input v-model="add_form_traveler.customId" placeholder="用户ID" class="wid_130"></el-input>
          <el-button type="primary" size="mini" :loading="loading" @click="check_customId">检索</el-button>
          <span>{{ searchResult }}</span>
        </el-form-item>

        <!-- 贝壳提成分成 -->
        <el-form-item label="贝壳提成分成" prop="profit_virtual_rate">
          <el-input
            v-model.number="add_form_traveler.profit_virtual_rate"
            placeholder="贝壳提成分成"
            class="wid_181"
          ></el-input>%
        </el-form-item>
        <!-- 出行提成分成 -->
        <el-form-item label="出行提成分成" prop="profit_account_rate">
          <el-input
            v-model.number="add_form_traveler.profit_account_rate"
            placeholder="出行提成分成"
            class="wid_181"
          ></el-input>%
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_dialogVisible = false" size="mini">取 消</el-button>
        <!-- 新增客服 -->
        <el-button type="primary" @click="save_add" size="mini" :key="'vlyou'">确 定</el-button>
      </span>
    </el-dialog>
    <!-- M8 dialog调整分成-->
    <el-dialog
      title="调整分成"
      :visible.sync="modi_rate_dialogVisible"
      width="30%"
      top="26vh"
      center
      :close-on-click-modal="false"
      v-loading="modi_rate_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="modi_rate">

      <!-- 业务信息 -->
      <el-form
        :model="modi_rate_form"
        :rules="modi_rate_rules"
        ref="modi_rate_form"
        class="demo-ruleForm valid_form"
      >
        <!-- 上限值 -->
        <el-form-item label="贝壳分成" prop="virtual_rate">
          <el-input v-model.number="modi_rate_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
        </el-form-item>
        <el-form-item label="贝壳分成提成" prop="profit_virtual_rate">
          <el-input
            v-model.number="modi_rate_form.profit_virtual_rate"
            placeholder="贝壳分成"
            class="wid_181"
          ></el-input>%
        </el-form-item>

        <el-form-item label="出行分成提成" prop="profit_account_rate">
          <el-input
            v-model.number="modi_rate_form.profit_account_rate"
            placeholder="出行分成"
            class="wid_181"
          ></el-input>%
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="modi_rate_dialogVisible = false" size="mini">关 闭</el-button>
        <el-button type="primary" @click="save_modi_rate" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
import {
  validNum100,
  validNum15,
  validDyNum,
  filterSpace
} from "../../utils/validate";
import { isvalidPhone } from "../../utils/validate";
import "dplayer/dist/DPlayer.min.css";
import flv from "flv.js";
import DPlayer from "dplayer";
import { setTimeout } from "timers";

export default {
  name: "customerService",
  data() {
    // 校验手机号
    let validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确手机号码"));
      } else {
        callback();
      }
    };
    // 校验分成
    let validRate = (val, value, callback) => {
      if (!value) {
        callback(new Error("请输入值"));
      } else if (!validNum100(value)) {
        callback(new Error("请输入0-100之间的数"));
      } else {
        callback();
      }
    };
    // 提成分成15
    let validRate15 = (val, value, callback) => {
      if (!value && value != 0) {
        callback(new Error("请输入值"));
      } else if (!validNum15(value)) {
        callback(new Error("请输入0-15之间的数"));
      } else {
        callback();
      }
    };
    // 校验分成 动态上限 dyval是上限值
    let validRateDy = (val, value, callback) => {
      let dyval = this.limit_virtual_rate;
      if (!value && value != 0) {
        callback(new Error("请输入值"));
      } else if (!validDyNum(value, dyval)) {
        callback(new Error("请输入0-" + dyval + "之间的数"));
      } else {
        callback();
      }
    };
    return {
      dp: "",
      dpChoice:"",
      examine_row: "",
      choice_row:'',
      video_num: "",
      videoChoice_num:'',
      roleId: "",
      loading: false,
      searchResult: "",
      // 审核视频
      detail_dialogVisible: false,
      detail_loading: false,
      detail_tableLoading: false,
      detail_tableData: [],
      currentPage_video: 1,
      pageTotal_video: 0,
      examine_queryForm: {
        customid: ""
      },
      // 查看视频的弹框
      video_dialogVisible: false,
      video_loading: false,
      // 设置视频
      videoChoice_dialogVisible:false,
      videoChoice_loading: false,
      videoChoice_tableData:[],
      videoChoice_tableLoading:false,
      videoChoiceView_dialogVisible:false,
      videoChoiceView_loading:false,
      // 新增客服弹框
      add_dialogVisible: false,
      add_loading: false,
      limit_virtual_rate: 50,
      add_form_traveler: {
        name: "",
        customId: "",
        virtual_rate: "",
        profit_virtual_rate: "",
        profit_account_rate: "",
        phone: ""
      },
      add_bank_traveler_rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        customId: [
          { required: true, message: "请输入向导ID", trigger: "blur" }
        ],
        // 贝壳分成
        virtual_rate: [
          { required: true, validator: validRateDy, trigger: "blur" },
          { type: "number", message: "贝壳分成必须为数字" }
        ],
        // 贝壳提成分成
        profit_virtual_rate: [
          { required: true, validator: validRate15, trigger: "blur" },
          { type: "number", message: "贝壳分成必须为数字" }
        ],
        // 出行提成分成
        profit_account_rate: [
          { required: true, validator: validRate15, trigger: "blur" },
          { type: "number", message: "贝壳分成必须为数字" }
        ],
        phone: [{ required: true, validator: validPhone, trigger: "blur" }]
      },
      // 工作记录
      workRecord_dialogVisible: false,
      workRecord_loading: false,
      workRecord_tableLoading: false,
      workRecord_tableData: [],
      workRecord_queryForm: {
        customid: "",
        name: "",
        live_month: ""
      },
      // 工作记录详情
      recordDetail_dialogVisible: false,
      recordDetail_loading: false,
      recordDetail_tableLoading: false,
      recordDetail_tableData: [],
      detail_pageTotal: 0,
      detail_currentPage: 1,
      recordDetail_queryForm: {
        live_month: ""
      },
      //调整分成
      modi_rate_dialogVisible: false,
      modi_rate_loading: false,
      modi_rate_form: {
        // 贝壳分成
        virtual_rate: "",
        // 提成分成
        profit_virtual_rate: "",
        profit_account_rate: "",
        travelerid: ""
      },
      modi_rate_rules: {
        // 贝壳分成
        virtual_rate: [
          { required: true, validator: validRateDy, trigger: "blur" },
          { type: "number", message: "贝壳分成必须为数字" }
        ],
        // 贝壳分成提成
        profit_virtual_rate: [
          { required: true, validator: validRate15, trigger: "blur" },
          { type: "number", message: "贝壳分成提成必须为数字" }
        ],
        // 出行分成提成
        profit_account_rate: [
          { required: true, validator: validRate15, trigger: "blur" },
          { type: "number", message: "出行分成提成必须为数字" }
        ]
      },
      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页_主列表
      pageTotal: 0,
      currentPage: 1,
      // 分页_工作记录
      pageTotal_workRecord: 0,
      currentPage_workRecord: 1,
      // 查询参数
      queryForm: {
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],
        // 所属机构
        agent_name: "",
        // 省市
        province_code: "",
        city_code: "",
        // 姓名
        name: "",
        // 向导id
        customid: "",
        // 向导状态
        traveler_statuss: [
          {
            id: 0,
            txt: "待审核"
          },
          {
            id: 1,
            txt: "可用 "
          },
          {
            id: 2,
            txt: "审批拒绝"
          },
          {
            id: 3,
            txt: "不可用"
          }
        ],
        traveler_status: "",
        // 上级姓名 上级id
        up_customid: "",
        up_name: "",

        province_param: "", //作为收集参数
        city_param: "", //作为收集参数

        // 校园代理
        campus_agents: [
          {
            id: 1,
            txt: "否"
          },
          {
            id: 2,
            txt: "是"
          }
        ],
        campus_agent: "",
        // 人员类别
        traveler_types: [
          {
            id: 1,
            txt: "兼职向导"
          },
          {
            id: 2,
            txt: "全职向导"
          },
          {
            id: 3,
            txt: "角落客服"
          }
        ],
        traveler_type: ""
      }
    };
  },
  created() {
    // 初始化roleId
    this.roleId = this.$store.getters.roleId;

    // 初始化 主列表
    this.getTableDataList(1);
  },
  methods: {
    // 转为向导
    handle_toBeGuider(row){
       this.$confirm("点击确认后，需要在角落里APP中申请成为向导", "转为向导", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        size: "mini",
        center: true
      }).then(() => {
        let param = {
          data: {
            customid: row.customid,
            travelerid: row.travelerid
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/travelerInfo/updateCustomerServiceType`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },
    // 操作 设置视频
    handle_choice(row){
      // 存一下row
      this.choice_row = row
      this.videoChoice_dialogVisible = true
      // 获取 设置视频的数据列表
      this.getTableList_videoChoice()
    },
    // 获取 设置视频的数据列表
    getTableList_videoChoice(){
      this.videoChoice_loading = true
      let param = {
        data:{
          // 私有
          customid:this.choice_row.customid,
          pageNum:1,
          pageSize:10,
        }
      }
      this.$http.post(`${ commonUrl.baseUrl }/liveVideoRecord/getCustomerServiceVideoChoice`, param).then(res=>{
        if(res.data.code == '0000'){
          let result = res.data.data.customerServiceVideoChoiceList
          this.videoChoice_tableData = result
          this.videoChoice_num = res.data.data.page.pageTotal
          this.videoChoice_loading = false
        }
      }).catch(err=>{})
    },
    // 设置视频>>操作-查看
    handle_view_videoChoice(row){
      let param = {
        data:{
          file_id:row.file_id
        }
      }
      this.videoChoice_loading = true
      this.$http.post(`${commonUrl.baseUrl}/liveVideoRecord/getVideoPlay`, param).then(res=>{
          if(res.data.code == '0000'){
              this.videoChoice_loading = false

              // 打开内层弹框 播放视频
              this.videoChoiceView_dialogVisible = true
              //this.video_loading = true
              // 为了解决首次初始化空白的问题，而采用异步的调用方式
              let _url = res.data.data.video_url
              let _houzui = _url.substr(_url.lastIndexOf(".")+1)
              //console.log(_houzui)
              // 判断mp4或者flv
              if(_houzui === "flv"){
                setTimeout(() => {
                  this.dpChoice = new DPlayer({
                    container: document.getElementById("dplayerChoice"),
                    video: {
                      url: res.data.data.video_url,
                      type: "customFlv", //customFlv
                      autoplay: "auto",
                      customType: {
                        customFlv: function(video, player) {
                          const flvPlayer = flv.createPlayer({
                            type: "flv",
                            url: video.src
                          });
                          flvPlayer.attachMediaElement(video);
                          flvPlayer.load();
                        }
                      }
                    }
                  });
                }, 1);
              }else if(_houzui === "mp4"){
                setTimeout(() => {
                  this.dpChoice = new DPlayer({
                    container: document.getElementById("dplayerChoice"),
                    video: {
                      url: res.data.data.video_url,
                      type: "auto", //customFlv
                      autoplay: "auto"
                    }
                  });
                }, 1);
              }

          }
      }).catch(err=>{})
    },
    // 设置视频>>操作-选择
    handle_select_videoChoice(row){
      let param = {
          data:{
            video_status:3,
            live_video_recordid:row.live_video_recordid,
            customid:row.customid,
          }
      }
      this.videoChoice_tableLoading = true
      this.$http.post(`${commonUrl.baseUrl}/liveVideoRecord/updateVideoChoiceStatus`, param).then(res=>{
        if(res.data.code == '0000'){
          this.videoChoice_tableLoading = false
          this.m_message(res.data.msg, 'success')
          // 刷新
          this.getTableList_videoChoice()
        }else{
          this.videoChoice_tableLoading = false
          this.m_message(res.data.msg, 'warning')
        }
      }).catch(err=>{})
    },
    // 设置视频>>操作-删除
    handle_delete_videoChoice(row){
      let param = {
        data: {
          video_status: 2, // 删除
          live_video_recordid: row.live_video_recordid,
          file_id: row.file_id
        }
      };
      this.videoChoice_tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/liveVideoRecord/updateVideoStatus`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.videoChoice_tableLoading = false;
            this.m_message("删除成功", "success");
            // 刷新
            this.getTableList_videoChoice();
          } else {
            this.videoChoice_tableLoading = false;
            this.m_message(res.data.msg, "warning");
          }
        })
        .catch(err => {});
    },
    // 关闭-设置视频(外层)
    handle_closeVideoChoice(){
      // 先暂停
      if(this.dp){
        this.dp.destroy()
      }
      // 关闭
      this.videoChoice_dialogVisible = false
      // 刷新主列表
      this.handle_refresh()
    },
    // 关闭-设置视频-查看(内层)
    handleDialogClose_videoChoiceView(){
      // console.log(this.dp)
      if(this.dpChoice){
        this.dpChoice.destroy()
      }
      this.videoChoiceView_dialogVisible = false
      // 刷新
      this.getTableList_videoChoice()
    },
    // 操作-审核视频
    handle_examine(row) {
      // 赋值
      this.examine_row = row;
      this.examine_queryForm.customid = row.customid;
      this.detail_dialogVisible = true;
      // 获取数据
      this.getTableList_examine(1);
    },
    // 获取视频审核列表
    getTableList_examine(pageNum) {
      let param = {
        data: {
          // 私有
          pageNum: pageNum,
          pageSize: 10,
          customid: this.examine_queryForm.customid
        }
      };
      this.detail_loading = true;
      this.$http
        .post(
          `${commonUrl.baseUrl}/liveVideoRecord/getCustomerServiceVideoExamine`,
          param
        )
        .then(res => {
          if (res.data.code == "0000") {
            let result = res.data.data.customerServiceVideoList;
            this.detail_tableData = result;
            this.video_num = result.length;
            // 分页总数
            this.pageTotal = res.data.data.page.pageTotal;
            this.detail_loading = false;
          }
        })
        .catch(err => {});
    },
    // 关闭视频审核外层弹框
    close_examine() {
      this.detail_dialogVisible = false;
      // 刷新主列表
      this.handle_refresh();
    },
    // 视频审核 查看
    handle_view(row) {
      let param = {
        data: {
          file_id: row.file_id
        }
      };
      this.detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/liveVideoRecord/getVideoPlay`, param)
        .then(res => {
          //console.log(res.data.data.video_url)
          if (res.data.code == "0000") {
            this.detail_loading = false;
            // 打开内层弹框 播放视频
            this.video_dialogVisible = true;
            // 为了解决首次初始化空白的问题，而采用异步的调用方式
            let _url = res.data.data.video_url
            let _houzui = _url.substr(_url.lastIndexOf(".")+1)
            //console.log(_houzui)
            // 判断mp4或者flv
            if(_houzui === "flv"){
              setTimeout(() => {
                this.dp = new DPlayer({
                  container: document.getElementById("dplayer"),
                  video: {
                    url: res.data.data.video_url,
                    type: "customFlv",//
                    autoplay: "auto",
                    customType: {
                      customFlv: function(video, player) {
                        const flvPlayer = flv.createPlayer({
                          type: "flv",
                          url: video.src
                        });
                        flvPlayer.attachMediaElement(video);
                        flvPlayer.load();
                      }
                    }
                  }
                });
              }, 1);
            }else if(_houzui === "mp4"){
              setTimeout(() => {
                this.dp = new DPlayer({
                  container: document.getElementById("dplayer"),
                  video: {
                    url: res.data.data.video_url,
                    type: "auto",//
                    autoplay: "auto"
                  }
                });
              }, 1);
            }

          } else {
            this.m_message(res.data.msg, "warning");
          }
        })
        .catch(err => {});
    },
    // 视频审核 可用
    handle_use(row) {
      let param = {
        data: {
          video_status: 1,
          live_video_recordid: row.live_video_recordid,
          file_id: row.file_id
        }
      };
      this.detail_tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/liveVideoRecord/updateVideoStatus`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.detail_tableLoading = false;
            this.m_message(res.data.msg, "success");
            // 刷新
            this.refresh_examineTableData();
          } else {
            this.detail_tableLoading = false;
            this.m_message(res.data.msg, "warning");
          }
        })
        .catch(err => {});
    },
    // 视频审核 删除
    handle_delete(row) {
      let param = {
        data: {
          video_status: 2, // 删除
          live_video_recordid: row.live_video_recordid,
          file_id: row.file_id
        }
      };
      this.detail_tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/liveVideoRecord/updateVideoStatus`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.detail_tableLoading = false;
            this.m_message("删除成功", "success");
            // 刷新
            this.refresh_examineTableData();
          } else {
            this.detail_tableLoading = false;
            this.m_message(res.data.msg, "warning");
          }
        })
        .catch(err => {});
    },
    // 关闭 播放的视频
    close_video() {
      // 先暂停
      //this.dp.pause()
      if (this.dp) {
        this.dp.destroy();
      }
      // 关闭
      this.video_dialogVisible = false;
      // 刷新
      this.getTableList_examine(1);
    },
    // 关闭 播放的视频
    handleDialogClose_video() {
      if (this.dp) {
        this.dp.destroy();
      }
      this.video_dialogVisible = false;
      // 刷新
      this.getTableList_examine(1);
    },
    // 刷新 审核视频的dialog列表
    refresh_examineTableData() {
      let row = this.examine_row;
      this.detail_loading = true;
      let param = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          // 私有
          customid: row.customid
          // name:row.name,
          // agentName:row.agentName,
        }
      };
      this.$http
        .post(`${commonUrl.baseUrl}/liveVideoRecord/getVideoExamine`, param)
        .then(res => {
          if (res.data.code == "0000") {
            let result = res.data.data.liveVideoRecordList;
            this.detail_tableData = result;
            this.video_num = result.length;
            this.detail_loading = false;
          }
        })
        .catch(err => {});
    },
    // 新增客服操作
    handle_add() {
      this.add_dialogVisible = true;
      this.add_loading = true;
      this.resetData("add_form_traveler");
      let param = {
        data: {}
      };
      // 初始化新增
      this.$http
        .post(`${commonUrl.baseUrl}/travelerInfo/addCustomerServicePage`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // 假设一个上限值
            this.limit_virtual_rate = 50;
            this.add_loading = false;
          }
        })
        .catch(err => {});
    },
    // 检索昵称
    check_customId() {
      let param = {
        data: {
          customId: this.add_form_traveler.customId
        }
      };
      this.loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/customInfo/selectNickname`, param)
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res);
            debugger;
            let result = res.data.data.nickname;
            this.searchResult = result.nickname;
            this.loading = false;
          } else {
            this.m_message(res.data.msg, "warning");
            this.loading = false;
          }
        })
        .catch(err => {});
    },
    // 保存新增客服
    save_add() {
      if (this.m_valid_addForm("add_form_traveler")) {
        let param = {
          data: {
            // 私参
            customId: this.add_form_traveler.customId,
            name: this.add_form_traveler.name,
            phone: this.add_form_traveler.phone,
            virtual_rate: this.add_form_traveler.virtual_rate,
            // 贝壳提成分成  出行提成分成
            profit_virtual_rate: this.add_form_traveler.profit_virtual_rate,
            profit_account_rate: this.add_form_traveler.profit_account_rate
          }
        };
        this.add_loading = true;
        this.$http
          .post(`${commonUrl.baseUrl}/travelerInfo/addCustomerService`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.add_loading = false;
              this.add_dialogVisible = false;
              this.m_message(res.data.msg, "success");
              this.handle_refresh();
              // 清空旅游数据
              this.searchResult = ""; // 清空 查询结果
              this.resetData("add_form_traveler");
            } else {
              this.add_loading = false;
              this.m_message(res.data.msg, "success");
            }
          })
          .catch(err => {});
      }
    },
    // 获取主列表
    getTableDataList(pageNum) {
      let param = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/travelerInfo/customerServiceList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.tableData = res.data.data.allCustomerServiceList;
            // 分页总数
            this.pageTotal = res.data.data.page.pageTotal;
            this.tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 操作>工作记录
    handle_workRecord(row) {
      this.workRecord_dialogVisible = true;
      // 赋值 id name
      this.workRecord_queryForm.customid = row.customid;
      this.workRecord_queryForm.name = row.name;
      this.getTableDataList_workRecord(1);
    },
    // 获取工作记录列表
    getTableDataList_workRecord(pageNum) {
      let param = {
        data: {
          pageNum: pageNum,
          pageSize: 10,
          customid: this.workRecord_queryForm.customid,
          live_month: this.workRecord_queryForm.live_month
        }
      };
      this.workRecord_tableLoading = true;
      this.$http
        .post(
          `${commonUrl.baseUrl}/travelerInfo/customerServiceRecordList`,
          param
        )
        .then(res => {
          if (res.data.code == "0000") {
            this.workRecord_tableData = res.data.data.customerServiceRecordList;
            // 分页总数
            this.pageTotal_workRecord = res.data.data.page.pageTotal;
            this.workRecord_tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 关闭 工作记录外层dialog
    handle_close() {
      this.workRecord_dialogVisible = false;
      this.handle_refresh();
    },
    // 关闭 工作记录详情dialog
    handleDialogClose() {
      this.recordDetail_dialogVisible = false;
      this.handle_refresh_workRecord();
    },
    // 操作工作记录详情
    handle_recordDetail(row) {
      // 赋值 live_month
      this.recordDetail_queryForm.live_month = row.live_month;
      this.recordDetail_dialogVisible = true;
      this.getTableDataList_recordDetail(1);
    },
    // 获取工作记录详情列表
    getTableDataList_recordDetail(pageNum) {
      let param = {
        data: {
          customid: this.workRecord_queryForm.customid,
          live_month: this.recordDetail_queryForm.live_month,
          pageNum: pageNum,
          pageSize: 10
        }
      };
      this.recordDetail_tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/liveRecord/getLiveRecordInfo`, param)
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res);
            this.recordDetail_tableLoading = false;
            this.recordDetail_tableData = res.data.data.liveRecordInfoList;
            //  分页
            this.detail_pageTotal = res.data.data.page.pageTotal;
            this.recordDetail_tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 调整分成操作
    handle_modiRate(row) {
      // 存agentid
      this.modi_rate_form.travelerid = row.travelerid;
      // 打开弹框
      this.modi_rate_dialogVisible = true;
      this.modi_rate_loading = true;
      let _param = {
        data: {
          customid: row.customid
        }
      };
      this.$http
        .post(`${commonUrl.baseUrl}/travelerInfo/findByCustomId`, _param)
        .then(res => {
          if (res.data.code == "0000") {

            let result = res.data.data.travelerInfo;
            // 贝壳分成
            this.modi_rate_form.virtual_rate = result.virtual_rate;
            // 贝壳分成提成 出行分成提成
            this.modi_rate_form.profit_virtual_rate =
              result.profit_virtual_rate;
            this.modi_rate_form.profit_account_rate =
              result.profit_account_rate;
            this.modi_rate_loading = false;
          }
        })
        .catch(err => {});
    },
    // 保存 调整分成
    save_modi_rate() {
      if (this.m_valid_addForm("modi_rate_form")) {
        let param = {
          data: {
            // 私参
            virtual_rate: this.modi_rate_form.virtual_rate,
            profit_virtual_rate: this.modi_rate_form.profit_virtual_rate,
            profit_account_rate: this.modi_rate_form.profit_account_rate,
            travelerid: this.modi_rate_form.travelerid
          }
        };
        this.modi_rate_loading = true;
        this.$http
          .post(
            `${commonUrl.baseUrl}/travelerInfo/updateCustomerServiceRate`,
            param
          )
          .then(res => {
            if (res.data.code == "0000") {
              this.modi_rate_loading = false;
              this.modi_rate_dialogVisible = false;
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
              this.modi_rate_loading = false;
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      }
    },

    // 查询按钮
    queryData() {
      // console.log(this.queryForm)
      // 根据参数进行查询
      this.getTableDataList(1);
    },
    // 查询按钮——工作记录
    queryData_workRecord() {
      console.log(this.workRecord_queryForm);
      this.getTableDataList_workRecord(1);
    },
    // 重置按钮
    resetData(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    // 刷新按钮-主列表
    handle_refresh() {
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 刷新按钮-工作记录
    handle_refresh_workRecord() {
      this.getTableDataList_workRecord(1);
      this.currentPage_workRecord = 1;
    },
    // 冻结操作
    handle_frozen(row) {
      console.log(row);
      this.$confirm("是否冻结该向导?", "冻结", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        size: "mini",
        center: true
      }).then(() => {
        let _flag = "";
        if (row.traveler_status == 1) {
          _flag = 3;
        } else {
          _flag = 1;
        }
        let param = {
          data: {
            traveler_status: _flag,
            travelerid: row.travelerid
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/travelerInfo/updateTravelerStatus`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.m_message(res.data.msg, "success");

              // 刷新
              this.handle_refresh();
            } else {
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
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
    },

    // 分页(主列表)
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
    },
    // 分页(工作记录)
    handleCurrentChange_workRecord(val) {
      this.currentPage_workRecord = val;
      this.getTableDataList_workRecord(val);
    },
    // 分页(工作记录详情)
    detail_handleCurrentChange(val) {
      this.detail_currentPage = val;
      this.getTableDataList_recordDetail(val);
    },
    // 分页(视频审核列表)
    handleCurrentChange_video(val) {
      this.currentPage_video = val;
      this.getTableDataList_recordDetail(val);
    },
    // 格式化日期
    getFormatDate(date) {
      let _date = new Date(date);
      let YYYY = _date.getFullYear();
      let MM = _date.getMonth() + 1;
      let dd = _date.getDate(); //日
      let HH = _date.getHours(); //小时
      let mm = _date.getMinutes();
      let ss = _date.getSeconds();
      MM = MM > 9 ? MM : "0" + MM;
      dd = dd > 9 ? dd : "0" + dd;
      HH = HH > 9 ? HH : "0" + HH;
      mm = mm > 9 ? mm : "0" + mm;
      ss = ss > 9 ? ss : "0" + ss;
      return YYYY + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss;
    }
  }
};
</script>
