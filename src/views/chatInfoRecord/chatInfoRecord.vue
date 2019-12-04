<template>
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
        <!-- 用户昵称 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="queryForm.nickname" placeholder="请输入昵称" class="wid_140"></el-input>
        </el-form-item>
        <!-- 用户ID -->
        <el-form-item label="用户ID" prop="customid">
          <el-input v-model="queryForm.customid" placeholder="请输入用户ID" class="wid_140"></el-input>
        </el-form-item>
        <!-- 客户类别 -->
        <el-form-item label="客户类别" prop="custom_type">
          <el-select
            v-model="queryForm.custom_type"
            class="wid_140"
            placeholder="请选择客户类别"
          >
            <el-option
              v-for="(item, index) in queryForm.custom_types"
              :key="index"
              :label=" item.txt "
              :value=" item.id "
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="customid" label="用户ID" width></el-table-column>
        <el-table-column prop="nickname" label="昵称" :show-overflow-tooltip="true" width></el-table-column>
        <el-table-column prop="phone" label="电话" width></el-table-column>
        <el-table-column prop label="性别" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 1">男</span>
            <span v-if="scope.row.sex == 2">女</span>
            <span v-if="scope.row.sex == 0">未知</span>
          </template>
        </el-table-column>
        <!-- 地址 -->
        <el-table-column prop label="地址" width="">
          <template slot-scope="scope">
            <span>{{scope.row.province + scope.row.city}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="客户类别" width>
          <template slot-scope="scope">
            <!-- 客户类别 0普通客户 1兼职向导人员 2全职向导人员 3角落客服 -->
            <span v-if="scope.row.custom_type == 0">普通客户</span>
            <span v-else-if="scope.row.custom_type == 1">兼职向导</span>
            <span v-else-if="scope.row.custom_type == 2">全职向导</span>
            <span v-else-if="scope.row.custom_type == 3">角落客服</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button @click="handle_detail(scope.row)" type="text" size="small">聊天列表</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block mar_t10">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :total="pageTotal"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <!-- M3 dialog 对话列表 -->
    <el-dialog
      :title="detailForm.detailForm_title+'的聊天记录'"
      :visible.sync="dialogVisible_detail"
      width="50%"
      class="agent_detail"
      center
      append-to-body
      :close-on-click-modal="false"
      v-loading="detail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <!-- 用户和向导的聊天记录列表 -->
      <el-table  :data="detail_tableData" v-loading="detail_tableLoading" border stripe style="width: 100%">
        <!-- 发送者ID first_account-->
        <el-table-column prop="first_account" label="发送者ID" width="" >
        </el-table-column>
        <!-- 发送者昵称 from_nickname-->
        <el-table-column prop="from_nickname" label="发送者昵称" width="">
        </el-table-column>
        <!-- 接收者ID second_account-->
        <el-table-column prop="second_account" label="接收者ID" width="">
        </el-table-column>
        <!-- 接收者昵称 to_nickname-->
        <el-table-column prop="to_nickname" label="接收者昵称" width="">
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop="" label="操作" width="">
            <template slot-scope="scope">
                <el-button @click="handle_view(scope.row)" type="text" size="small">聊天详情</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block mar_t10">
        <el-pagination
          @current-change="handleCurrentChange_detail"
          :current-page="currentPage_detail"
          :total="pageTotal_detail"
          background
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogVisible_detail = false" size="mini">关 闭</el-button>
      </span>
      <!-- 聊天信息(内层) -->
      <el-dialog
        title="聊天详情"
        :visible.sync="chat_dialogVisible"
        width="30%"
        top="1vh"
        center
        append-to-body
        :close-on-click-modal="false"
        v-loading="chat_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="chat_dialog">
        <!-- 聊天记录详情 -->
        <div class="chat_detail">
          <div class="detai_wrap"  v-for="item in chatForm.chatInfo_arr" :key="item.chat_id">
            <!-- 聊天发起者居左 -->
            <div class="clearfloat" v-if="chatForm.from_chatter == item.from_account">
              <!-- 标题 -->
              <h5 class="chat_title text_l">
                <!-- <img class="avatar" :src="item.from_headurl" alt=""> -->
                {{item.from_nickname}}({{ item.from_account }})&nbsp;{{new Date(item.msg_time*1000).toLocaleString()}}
              </h5>
              <!-- 聊天内容 msg_type-->
              <div v-if="item.msg_type == 0" class="chat_content fl">
                <!-- 判断类型  消息类别 0文本 1图片 2表情 3地理 4自定义 5语音 6文件 7视频-->
                {{item.msg_content}}
              </div>
              <div v-else-if="item.msg_type == 1" class="chat_content fl">
                <!-- 判断类型  消息类别 0文本 1图片 2表情 3地理 4自定义 5语音 6文件 7视频-->
                <el-image
                  style="max-width: 30px;max-height:50px"
                  :src="item.img_min_url"
                  :preview-src-list="[item.img_src_url]">
                </el-image>
              </div>
            </div>
            <!-- 聊天接受者居右 -->
            <div v-else class="clearfloat">
              <!-- 标题 -->
              <h5 class="chat_title text_r">
                <!-- <img class="avatar" :src="item.from_headurl" alt=""> -->
                {{item.from_nickname}}({{ item.from_account }})&nbsp;{{new Date(item.msg_time*1000).toLocaleString()}}
              </h5>
              <!-- 聊天内容 msg_type-->
              <div v-if="item.msg_type == 0" class="chat_content fr">
                <!-- 判断类型  消息类别 0文本 1图片 2表情 3地理 4自定义 5语音 6文件 7视频-->
                {{item.msg_content}}
              </div>
              <div v-else-if="item.msg_type == 1" class="chat_content fr">
                <!-- 判断类型  消息类别 0文本 1图片 2表情 3地理 4自定义 5语音 6文件 7视频-->
                <el-image
                  style="max-width: 30px;max-height:50px"
                  :src="item.img_min_url"
                  :preview-src-list="[item.img_src_url]">
                </el-image>
              </div>
            </div>

          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <!-- 聊天记录分页 -->
          <div class="block mar_t10">
            <el-pagination
              @current-change="handleCurrentChange_chat"
              :current-page="currentPage_chat"
              :total="pageTotal_chat"
              :page-size="pageSize_chat"
              background
              small
              layout="total, prev, pager, next, jumper">
            </el-pagination>
          </div>
          <el-button @click="chat_dialogVisible = false" size="mini">关 闭</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import commonUrl from "../../utils/common"
export default {
  name: "chatInfoRecord",
  data() {
    return {
      roleId:'',
      // 主列表  分页
      tableLoading: false,
      tableData: [],
      pageTotal: 100,
      currentPage: 1,
      pageSize:10,
      // 主页查询参数
      queryForm: {
        nickname: "",
        customid:'',
        // 客户类别 0普通客户 1兼职向导人员 2全职向导人员 3角落客服 '
        custom_types:[
          {
            id:'0',
            txt:'普通客户'
          },
          {
            id:1,
            txt:'兼职向导'
          },
          {
            id:2,
            txt:'全职向导'
          },
          {
            id:3,
            txt:'角落客服'
          },
        ],
        custom_type:'',
      },

      // 详情弹框dialog>2
      detail_tableData: [],
      detail_tableLoading:false,
      pageTotal_detail: 100,
      currentPage_detail: 1,
      dialogVisible_detail: false,
      detail_loading: false,
      // 新增 弹框规则 修改也用该弹框
      detailForm: {
        // 标题
        detailForm_title: "",
        customid:'',
      },
      // 聊天记录dialog>3
      chat_dialogVisible:false,
      chat_loading:false,
      pageTotal_chat:100,
      currentPage_chat:1,
      pageSize_chat:20,
      // 聊天详情数据
      chatForm:{
        msg_group:'',
        chatInfo_arr:[],
        // 左侧发起聊天者
        from_chatter:'',
      }
    };
  },
  created() {
    // 为日期类补充
    this.initDate()
    // 初始化 主列表数据
    this.getTableDataList(1);
    // 获取roleId
    this.roleId = this.$store.getters.roleId;

  },
  methods: {
    // 初始化 主列表数据
    getTableDataList(pageNum) {
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRole: this.$store.getters.roleId,
          // 用户id
          customid:this.queryForm.customid,
          nickname: this.queryForm.nickname,
          custom_type:this.queryForm.custom_type,
          pageNum: pageNum,
          pageSize: this.pageSize
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/chatInfo/getChatInfoMainList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res)
            this.tableLoading = false;
            this.tableData = res.data.data.chatInfoMainList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }
        })
        .catch(err => {});
    },
    // 查询按钮
    queryData() {


      // console.log(param);
      // console.log(this.queryForm)
      this.getTableDataList(1);
    },
    // 重置按钮
    resetData(formName) {
      // this.queryForm.nickname = "";
      // this.queryForm.member_status = "";

      this.$refs[formName].resetFields();
      // 对于queryForm 下拉
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 详情操作
    handle_detail(row) {
      // 标题
      this.detailForm.detailForm_title = row.nickname;
      // 存值
      this.detailForm.customid = row.customid
      // 开弹框
      this.dialogVisible_detail = true;
      // 初始化数据
      this.getTableDataList_detail(1)
    },
    // 初始化 详情列表数据
    getTableDataList_detail(pageNum){
      // 参数
      let param = {
        data: {
          // 公有
          pageNum: pageNum,
          pageSize: 10,
          // 私有
          customid: this.detailForm.customid
        }
      };
      // 加载中
      this.detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/chatInfo/getChatInfoGroupList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // 数据赋值
            this.detail_tableData = res.data.data.chatInfoGroupList;
            // 分页 总数
            this.pageTotal_detail = res.data.data.page.pageTotal;
            // 加载完
            this.detail_loading = false;
          }
        })
        .catch(err => {});
    },
    // 主页分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
      //console.log(`当前页: ${val}`);
    },
    // 详情列表的分页
    handleCurrentChange_detail(val){
      this.currentPage_detail = val
      this.getTableDataList_detail(val)
    },

    // 查看聊天详情
    handle_view(row){
      this.chat_dialogVisible  = true
      // 存值
      this.chatForm.msg_group = row.msg_group
      // 提取出聊天发起者
      this.chatForm.from_chatter = row.msg_group.split('-')[0];
      console.log(this.chatForm.from_chatter)
      this.getDataList_chat(1)
    },
    // 获取聊天详情列表
    getDataList_chat(pageNum){
      // 参数
      let param = {
        data: {
          // 公有
          pageNum: pageNum,
          pageSize: this.pageSize_chat,
          // 私有 当前id
          msg_group: this.chatForm.msg_group
        }
      };
      // 加载中
      this.chat_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/chatInfo/getChatInfoList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // 数据赋值
            let result = res.data.data.chatInfoList;

            this.chatForm.chatInfo_arr = result.reverse()
            console.log(res)
            // 分页 总数
            this.pageTotal_chat = res.data.data.page.pageTotal;

            // 加载完
            this.chat_loading = false;
          }
        })
        .catch(err => {});
    },
    // 聊天详情的分页
    handleCurrentChange_chat(val){
      this.currentPage_chat = val
      this.getDataList_chat(val)
    },
    // 新增 校验规则
    m_valid_addForm(formName) {
        let  flag  = false ;
        this.$refs[formName].validate((valid) => {
            if (valid) {
            flag = true;
            return true
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
    // 初始化日期
    initDate(){
      Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds() ;
    };
    }
  }
};
</script>

<style  scoped>

  .chat_dialog .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
  .chat_dialog .clearfloat{zoom:1}
  .chat_dialog .fr{
    float:right;
  }
  .chat_dialog .fl{
    float:left ;
  }
  .chat_dialog .text_l{
    text-align: left;
  }
  .chat_dialog .text_r{
    text-align: right;
  }
</style>
