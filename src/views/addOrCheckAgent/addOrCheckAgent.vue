<template>
    <!-- agentCheck.vue 添加/审核机构-->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">

                <!-- 机构名称 -->
                <el-form-item label="机构名称" prop="agent_name">
                    <el-input v-model="queryForm.agent_name" placeholder="机构名称" class="wid_140"></el-input>
                </el-form-item>
                <!-- 联系人 -->
                <el-form-item label="联系人" prop="charger">
                    <el-input v-model="queryForm.charger" placeholder="联系人" class="wid_140"></el-input>
                </el-form-item>
                <!-- 联系电话 -->
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="queryForm.phone" placeholder="联系电话" class="wid_140"></el-input>
                </el-form-item>
                <!-- 查询 -->
                <el-form-item>
                    <el-button type="primary" size='mini' @click="queryData">查询</el-button>
                    <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
                    <!-- 只有招商中心 区域经理  有权限 新增 市级机构 -->
                    <el-button type="warning" size='mini' @click="handle_add">新增机构</el-button>
                    <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>

                </el-form-item>
            </el-form>
        </div>
        <!-- M2 主列表 -->
        <div>
            <!-- 表格 -->
            <!-- 机构名称 联系人 联系电话 交易分成 审核状态 查看并审核
            agent_name charger  phone commissionProportion  agent_check -->
            <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
                <el-table-column prop="agent_name" label="机构名称" width="" >
                </el-table-column>
                <el-table-column prop="charger" label="联系人" width="">
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" width="">
                </el-table-column>
                <el-table-column prop="" label="交易分成" width="">
                  <template slot-scope="scope">
                    <span>{{scope.row.commissionProportion}}%</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="状态" width="">
                    <template slot-scope="scope">
                      <span v-if="scope.row.agent_check == 1">待审核</span>
                      <span v-else-if="scope.row.agent_check == 2">审核通过</span>
                      <!-- <span v-else-if="scope.row.agent_check == 3">修改待审核</span>
                      <span v-else-if="scope.row.agent_check == 4">审核拒绝</span>
                      <span v-else-if="scope.row.agent_check == 5">修改审核拒绝</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="">
                <template slot-scope="scope">
                    <el-button  @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
                    <el-button v-if="scope.row.agent_check == 1"  @click="handle_detail_check(scope.row)" type="text" size="small">审核</el-button>

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
                >
                </el-pagination>
            </div>
        </div>
        <!-- M3 dialog 新增 -->
        <el-dialog
            title="新增机构"
            :visible.sync="add_dialogVisible"
            width="50%"
            center
            :close-on-click-modal="false"
            v-loading="add_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            >
            <!-- 业务信息 -->
            <el-form :inline="true" :model="add_form" :rules="add_rules" ref="add_form" label-width="80px" class="demo-form-inline valid_form">

                <!-- 业务信息 -->
                <el-form-item label="机构名称" prop="agent_name">
                    <el-input v-model="add_form.agent_name" placeholder="机构名称" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="charger" >
                    <el-input v-model="add_form.charger" placeholder="联系人" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone" >
                    <el-input v-model="add_form.phone" placeholder="联系电话" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="交易分成" prop="commission_proportion">
                    <el-input v-model="add_form.commission_proportion" placeholder="交易分成" class="wid_181"></el-input>‰
                    <span style="color:green;font-size:12px;">输入数字小于2且最多保留一位小数</span>
                </el-form-item>
                <el-form-item label="开户分成" prop="active_fee">
                    <el-input v-model="add_form.active_fee" placeholder="开户分成" class="wid_181"></el-input>
                    <span style="color:green;font-size:12px;">输入数字小于20</span>
                </el-form-item>
            </el-form>
            <!-- 开户信息 -->
            <el-form :inline="true" :model="add_form_bank" :rules="add_bank_rules" label-width="80px" ref="add_bank_form" class="demo-form-inline valid_form">
                <el-form-item label="开户名" prop="account_user_name" >
                    <el-input v-model="add_form_bank.account_user_name" placeholder="开户名" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="银行账号" prop="account_no" >
                    <el-input v-model="add_form_bank.account_no" placeholder="账号" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="account_bank" >
                  <el-input v-model="add_form_bank.account_bank" placeholder="开户行" class="wid_180"></el-input>
                    <!-- <el-select v-model="add_form_bank.account_bank"
                        placeholder="开户行"
                        class="wid_190"
                        @change="changeOption_bank($event)">
                        <el-option v-for="(item, index) in add_form_bank.bankInfo"
                            :key="index"
                            :label=" item.bankname "
                            :value=" item.bankcode ">
                        </el-option>
                    </el-select> -->
                </el-form-item>
                <el-form-item label="开户地" required  class="marg_r0">
                    <el-col :span="11">
                        <el-form-item prop="province_code" class="marg_b0">
                            <el-select v-model="add_form_bank.province_code"
                                placeholder="选择省"
                                class="wid_90"
                                @change="changeOption_province_addBank($event)">
                                <el-option v-for="(item, index) in add_form_bank.regions"
                                    :key="index"
                                    :label=" item.province"
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="city_code" class="marg_b0">
                            <el-select v-model="add_form_bank.city_code"
                                placeholder="选择市"
                                class="wid_90"
                                @change="changeOption_city_addBank($event)">
                                <el-option v-for="(item, index) in add_form_bank.cities"
                                    :key="index"
                                    :label=" item.city "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="add_dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="save_add" size="mini">确 定</el-button>
            </span>
        </el-dialog>
        <!-- M4 dialog 详情 -->
        <el-dialog
            title="机构详情"
            :visible.sync="detail_dialogVisible"
            width="50%"
            center
            :close-on-click-modal="false"
            v-loading="detail_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="agent_detail"
            >
            <!-- 业务信息 -->
            <el-form :inline="true" :model="detail_form"   class="demo-form-inline " label-width="80px" disabled>
                <!-- 业务信息 -->
                <!-- <p class="form_title">业务信息</p> -->
                <el-form-item label="机构名称" prop="agent_name">
                    <el-input v-model="detail_form.agent_name" placeholder="审批人" class="wid_180"></el-input>
                </el-form-item>

                <el-form-item label="联系人" prop="charger" >
                    <el-input v-model="detail_form.charger" placeholder="联系人" class="wid_180"></el-input>
                </el-form-item>
                <!-- <el-form-item label="业务地区"  class="marg_r0">
                    <el-col :span="11">
                        <el-form-item prop="province_code" class="marg_b0">
                            <el-select v-model="detail_form.province_code"
                                placeholder="选择省"
                                class="wid_90"
                                @change="changeOption_province_addBusiness($event)">
                                <el-option v-for="(item, index) in detail_form.regions"
                                    :key="index"
                                    :label=" item.province "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="city_code" class="marg_b0">
                            <el-select v-model="detail_form.city_code"
                                placeholder="选择市"
                                class="wid_90"
                                @change="changeOption_city_addBusiness($event)">
                                <el-option v-for="(item, index) in detail_form.cities"
                                    :key="index"
                                    :label=" item.city "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="联系电话" prop="phone" >
                    <el-input v-model="detail_form.phone" placeholder="联系电话" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="交易分成" prop="commission_proportion">
                    <el-input v-model="detail_form.commission_proportion" placeholder="出行分成" class="wid_181"></el-input>%
                </el-form-item>
                <el-form-item label="开户分成" prop="active_fee">
                    <el-input v-model="detail_form.active_fee" placeholder="开户分成" class="wid_181"></el-input>
                </el-form-item>
                <div></div>
                 <el-form-item label="开户名" prop="account_user_name" >
                    <el-input v-model="detail_form.account_user_name" placeholder="开户名" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="account_bank" >
                  <el-input v-model="detail_form.account_bank" placeholder="开户行" class="wid_180"></el-input>
                  <!-- <el-select v-model="detail_form.account_bank"
                      placeholder="开户行"
                      class="wid_190"
                      @change="changeOption_bank($event)">
                      <el-option v-for="(item, index) in detail_form.bankInfo"
                          :key="index"
                          :label=" item.bankname "
                          :value=" item.bankcode ">
                      </el-option>
                  </el-select> -->
                </el-form-item>
                <el-form-item label="银行账号" prop="account_no" >
                    <el-input v-model="detail_form.account_no" placeholder="账号" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="开户地"   class="marg_r0">
                    <el-col :span="11">
                        <el-form-item prop="account_province_code" class="marg_b0">
                            <el-select v-model="detail_form.account_province_code"
                                placeholder="选择省"
                                class="wid_90"
                                @change="changeOption_province_addBank($event)">
                                <el-option v-for="(item, index) in detail_form.account_regions"
                                    :key="index"
                                    :label=" item.province"
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="city_code" class="marg_b0">
                            <el-select v-model="detail_form.account_city_code"
                                placeholder="选择市"
                                class="wid_90"
                                @change="changeOption_city_addBank($event)">
                                <el-option v-for="(item, index) in detail_form.account_cities"
                                    :key="index"
                                    :label=" item.city "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- M5 dialog 详情并审核 -->
        <el-dialog
            title="机构审核"
            :visible.sync="detail_check_dialogVisible"
            width="50%"
            center
            :close-on-click-modal="false"
            v-loading="detail_check_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="agent_detail"
            >
            <!-- 业务信息 -->
            <el-form :inline="true" :model="detail_check_form"  label-width="80px" class="demo-form-inline " disabled>
                <!-- 业务信息 -->
                <!-- <p class="form_title">业务信息</p> -->
                <el-form-item label="机构名称" prop="agent_name">
                    <el-input v-model="detail_check_form.agent_name" placeholder="机构名称" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="charger" >
                    <el-input v-model="detail_check_form.charger" placeholder="联系人" class="wid_180"></el-input>
                </el-form-item>

                <el-form-item label="联系电话" prop="phone" >
                    <el-input v-model="detail_check_form.phone" placeholder="联系电话" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="交易分成" prop="commission_proportion">
                    <el-input v-model="detail_check_form.commission_proportion" placeholder="交易分成" class="wid_181"></el-input>%
                </el-form-item>
                <!-- 开户分成 -->
                <el-form-item label="开户分成" prop="active_fee">
                    <el-input v-model="detail_check_form.active_fee" placeholder="开户分成" class="wid_181"></el-input>
                </el-form-item>
                <div></div>
                 <el-form-item label="开户名" prop="account_user_name" >
                    <el-input v-model="detail_check_form.account_user_name" placeholder="开户名" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="account_bank" >
                    <el-input v-model="detail_check_form.account_bank" placeholder="开户行" class="wid_180"></el-input>
                    <!-- <el-select v-model="detail_check_form.account_bank"
                        placeholder="开户行"
                        class="wid_190"
                        @change="changeOption_bank($event)">
                        <el-option v-for="(item, index) in detail_check_form.bankInfo"
                            :key="index"
                            :label=" item.bankname "
                            :value=" item.bankcode ">
                        </el-option>
                    </el-select> -->
                </el-form-item>
                <el-form-item label="银行账号" prop="account_no" >
                    <el-input v-model="detail_check_form.account_no" placeholder="账号" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="开户地"   class="marg_r0">
                    <el-col :span="11">
                        <el-form-item prop="account_province_code" class="marg_b0">
                            <el-select v-model="detail_check_form.account_province_code"
                                placeholder="选择省"
                                class="wid_90"
                                @change="changeOption_province_addBank($event)">
                                <el-option v-for="(item, index) in detail_check_form.account_regions"
                                    :key="index"
                                    :label=" item.province"
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="city_code" class="marg_b0">
                            <el-select v-model="detail_check_form.account_city_code"
                                placeholder="选择市"
                                class="wid_90"
                                @change="changeOption_city_addBank($event)">
                                <el-option v-for="(item, index) in detail_check_form.account_cities"
                                    :key="index"
                                    :label=" item.city "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-form>

            <!-- 业务审核 -->
            <el-form :inline="true" :model="detail_check_form" :rules="detail_check_rules" ref="detail_check_form" label-width="80px"  class="demo-ruleForm demo-form-inline valid_form">
                <!-- <el-form-item label="审核" prop="agent_check" label-width="68px">
                    <el-select
                        v-model="detail_check_form.agent_check"
                        placeholder="请选择审核类别"
                        class="wid_190"
                        @change="selectedAgentCheck($event)"
                        >
                        <el-option
                            v-for="(item, index) in detail_check_form.agent_checks"
                            :key="index"
                            :label="item.txt"
                            :value="item.id"
                            >
                        </el-option>

                    </el-select>
                </el-form-item> -->
                <el-form-item label="审核" prop="agent_check" >
                    <el-radio-group
                        @change="selectedAgentCheck($event)"
                        v-model="detail_check_form.agent_check">
                        <el-radio
                            :key="index"
                            v-for="(item, index) in detail_check_form.agent_checks"

                            :label="item.id">{{ item.txt }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="拒绝原因" prop="check_remark" >
                    <el-input type="textarea" v-model="detail_check_form.check_remark" ></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detail_check_dialogVisible = false" size="mini">关 闭</el-button>
                <el-button @click="handle_check" type="primary" size="mini">审 核</el-button>

            </span>
        </el-dialog>
    </div>
</template>
<script>
import provinces from '../../utils/area.js'
import commonUrl from '../../utils/common'
import {isvalidPhone, validNum100, filterSpace, validZNum, validNum20,validNum2,getFloat} from '../../utils/validate'
export default {
    name: 'addOrCheckAgent',
    data(){
        // 校验手机号
        let validPhone=(rule, value,callback)=>{
            if (!value){
                callback(new Error('请输入电话号码'))
            }else  if (!isvalidPhone(value)){
                callback(new Error('请输入正确手机号码'))
            }else {
                callback()
            }
        }
        // 校验分成
        let validRate=(val,value,callback)=>{

            if (!value){
                callback(new Error('请输入值'))
            }else  if (!validZNum(value)){
                callback(new Error('请输入0-100之间的正数'))
            }else {
                callback()
            }
        }
        // 交易分成
        let validRate_2=(val,value,callback)=>{

            if (!value){
                callback(new Error('请输入值'))
            }else  if (!validNum2(value)){
                callback(new Error('请输入0-2之间的正数,且小数位数不得多于一位'))
            }else {
                callback()
            }

        }
        // 开户分成
        let validRate_20=(val,value,callback)=>{

            if (!value){
                callback(new Error('请输入值'))
            }else  if (!validNum20(value)){
                callback(new Error('请输入0-20之间的正数'))
            }else {
                callback()
            }
        }

        return {
            // 角色ID
            roleId:'',
            // 加载
            add_loading:false,
            // 地图
            districtSearch:'',
            // 主列表
            tableLoading:false,
            tableData:[],
            // 分页
            pageTotal: 100,
            currentPage:1,
            // 银行信息
            bankInfo:'',
            // 查询参数
            queryForm: {
              // 初始化 省 regions  市 cities
              regions:'',
              cities: [],

              province_code: '',
              city_code:'',

              // 机构名称 联系人 联系电话

              agent_name:'',
              charger:'',
              phone:''

            },
            // dialog add
            add_dialogVisible: false,
            detail_dialogVisible:false,
            detail_loading:false,
            detail_check_dialogVisible:false,
            detail_check_loading:false,
            // 预存省份
            pre_regions:'',
            // 新增 对话框表单
            add_form:{
                // 业务信息
                agent_name: '',
                charger:'',
                phone:'',
                commission_proportion:'',
                // 初始化 省 regions  市 cities
                regions:'',
                cities: [],
                province_code: '',
                province_param:'', // 收集参数
                city_param:'',
                city_code:'',
                province:'',
                city:'',
                active_fee:'',

            },
            add_form_bank:{
                // 开户信息
                    // 开户行
                bankInfo:[],
                account_bank: '',   // v-model
                bankname:'',
                    //开户地
                regions:'',
                cities: [],
                province: '',
                city:'',
                province_code:'',
                city_code:'',
                province_param:'', // 收集参数
                city_param:'',
                // 开户名
                account_user_name:'',
                // 开户行
                account_bank:'',
                // 开户账户
                account_no:'',
            },
            add_rules:{
                // 机构名称
                agent_name:[
                    { required: true, message: '请输入机构名称', trigger: 'blur' }
                ],
                // 联系人
                charger:[
                    { required: true, message: '请输入负责人', trigger: 'blur' }
                ],
                // 联系电话
                phone:[
                    { required: true, trigger: 'blur', validator: validPhone }
                ],
                // 交易分成
                commission_proportion:[
                    { required: true, validator:validRate_2, trigger: 'blur' },
                    // { type: 'number', message: '交易分成必须为数字'}
                ],
                // 开户分成
                active_fee:[
                    { required:true, validator:validRate_20, trigger:'blur'  }
                ]
            },
            add_bank_rules:{
                // 开户名
                account_user_name:[
                    { required: true, message: '请输入开户名', trigger: 'blur' }
                ],
                // 开户行
                account_bank:[
                    { required: true, message: '请输入开户行', trigger: 'blur' }
                ],
                // 账号
                account_no:[
                    { required: true, message: '请选择账号', trigger: 'blur' }
                ],
                // 开户地
                province_code:[
                    { required: true, message: '请选择开户地', trigger: 'change' }
                ],
                city_code:[
                     { required: true, message: '请选择开户地', trigger: 'change' }
                ]
            },
            // 详情
            detail_form:{
                regions:[],
                cities:[],
                // 机构编号
                agentid:'',
                // 机构名称
                agent_name:'',
                // 负责人
                charger:'',
                // 业务地区
                province_code:'',
                city_code:'',
                // 交易分成
                commission_proportion:'',
                // 电话
                phone:'',

                // 开户行
                account_bank:'',
                // 开户名
                account_user_name:'',
                // 账号
                account_no:'',
                // 开户地
                account_regions:'',
                account_cities:[],
                account_province_code:'',
                account_city_code:'',
            },
            // 详情并审核
            detail_check_form:{
                regions:[],
                cities:[],

                // 机构名称
                agent_name:'',
                // 联系人
                charger:'',
                // 业务地区
                province_code:'',
                city_code:'',

                // 交易分成
                commission_proportion:'',
                // 电话
                phone:'',
                // 开户行
                account_bank:'',
                // 开户名
                account_user_name:'',
                // 银行账号
                account_no:'',
                // 开户地
                account_regions:'',
                account_cities:[],
                account_province_code:'',
                account_city_code:'',

                // 审核类别
                agent_checks:[
                    {
                        id:2,
                        txt:'审核通过'
                    },
                    // {
                    //     id:4,
                    //     txt:'审核拒绝'
                    // },
                    // {
                    //     id:5,
                    //     txt:'修改审核拒绝'
                    // }
                ],
                agent_check:'',
                // 审核说明
                // check_remark:'',
                // 用户id
                agentid:'',
            },
            // 详情并审核 规则
            detail_check_rules:{
                // 审核状态
                agent_check:[
                    { required: true, message: '选择审核状态', trigger: 'change' }
                ],
                // check_remark:[
                //     { required: true, message: '输入审核说明', trigger: 'blur' }
                // ]
            },
        }
    },
    created(){
      // 初始化roleId
      this.roleId = this.$store.getters.roleId
      // 初始化 地图plugin
      this.initMap();
      // 初始化 省份
      this.initProvinces();
      // 初始化 银行信息
      // this.getBankList();
      // 初始化 主数据列表
      this.getTableDataList(1)
    },
    methods:{
        // 初始化 银行信息
        getBankList(){
            this.$http.post(`${ commonUrl.baseUrl}/agent/addAgent`,{data:{
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
            }}).then(res=>{
                if(res.data.code == '0000'){

                    this.bankInfo = this.detail_check_form.bankInfo = this.add_form_bank.bankInfo = this.detail_form.bankInfo = res.data.data.bankList
                    // 组合省份
                    let arr = [];
                    if(res.data.data.manageProvinceCodeList.length > 0){
                        for(let item of res.data.data.manageProvinceCodeList){
                            arr.push({
                                adcode: item.province_code,
                                province: provinces.province_list[item.province_code]
                            })
                        }
                    }
                    this.add_form.regions = arr;

                }
            }).catch(err=>{

            })
        },
        // 初始化 主数据列表
        getTableDataList(pageNum){
          let param = {
             data:{
                  // 公有
                  signInUserId: this.$store.getters.userId,
                  signInRoleId: this.$store.getters.roleId,
                  pageNum: pageNum,
                  pageSize: 10,
                  // 私有
                  // 机构名称 联系人 联系电话
                  agent_name:this.queryForm.agent_name,
                  charger:this.queryForm.charger,
                  phone:this.queryForm.phone
             }
          }
          this.tableLoading = true
          this.$http.post(`${ commonUrl.baseUrl }/agent/selectAgentCheckList`, param).then(res=>{
              if(res.data.code == '0000'){
                  console.log(res)
                  this.tableData = res.data.data.agentCheckList
                  // 分页总数
                  this.pageTotal = res.data.data.page.pageTotal;
                  this.tableLoading = false
              }
          }).catch(err=>{

          })

        },
        // 刷新 主列表
        handle_refresh(){
            this.getTableDataList(this.currentPage);
            // this.currentPage = 1
        },
        // 查询按钮
        queryData(){
            // 根据参数进行查询
            this.getTableDataList(1);
            this.currentPage = 1
        },
        // 详情
        handle_detail(row){
            this.detail_dialogVisible = true
            let param = {
              data:{
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
                agentid:row.agentid,
              }
            }
            this.detail_loading = true

            this.$http.post(`${ commonUrl.baseUrl }/agent/selectAgentInfo`, param).then(res=>{
                if(res.data.code == '0000'){
                  console.log(res)
                    let result = res.data.data.agentInfo
                    // 机构id
                    this.detail_form.agentid = result.agentid
                    // 机构名称
                    this.detail_form.agent_name = result.agent_name
                    // 联系人
                    this.detail_form.charger = result.charger
                    // 开户分成
                    this.detail_form.active_fee = result.activeFee
                    // 业务地区
                    //this.detail_form.province_code = result.province_code
                    // 根据省查询所有市
                    //this.queryCity(result.province, 'detail_form')
                    //this.detail_form.city_code = result.city_code
                    // 联系地址
                    //this.detail_form.address = result.address
                    this.detail_form.commission_proportion = result.commissionProportion
                    // 电话
                    this.detail_form.phone = result.phone
                    // 开户行
                    this.detail_form.account_bank = result.account_bank
                    // 开户名
                    this.detail_form.account_user_name = result.account_user_name
                    // 账号
                    this.detail_form.account_no = result.account_no
                    // 开户地
                    // 查询开户行所在省份下的所有市列表
                    this.queryBankCity(result.account_province, 'detail_form')
                    this.detail_form.account_province_code = result.account_pro_code
                    this.detail_form.account_city_code = result.account_city_code

                    this.detail_loading = false
                }
            }).catch(err=>{})
        },
        // 详情审核
        handle_detail_check(row){

            this.detail_check_form.agentid = row.agentid

            this.detail_check_dialogVisible = true
            this.detail_check_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/agent/selectAgentInfo`, {data:{agentid:row.agentid}}).then(res=>{
                if(res.data.code == '0000'){

                    let result = res.data.data.agentInfo
                    // 机构id
                    this.detail_check_form.agentid = result.agentid
                    // 机构名称
                    this.detail_check_form.agent_name = result.agent_name
                    // 联系人
                    this.detail_check_form.charger = result.charger

                    // 交易分成
                    this.detail_check_form.commission_proportion = result.commissionProportion
                    // 开户分成
                    this.detail_check_form.active_fee = result.activeFee
                    // 电话
                    this.detail_check_form.phone = result.phone

                    // 开户行
                    this.detail_check_form.account_bank = result.account_bank
                    // 开户名
                    this.detail_check_form.account_user_name = result.account_user_name
                    // 银行账号
                    this.detail_check_form.account_no = result.account_no
                    // 开户地
                    // 查询开户行所在省份下的所有市列表
                    this.queryBankCity(result.account_province, 'detail_check_form')
                    this.detail_check_form.account_province_code = result.account_pro_code
                    this.detail_check_form.account_city_code = result.account_city_code
                    // 清空一下校验规则
                    this.clearValid('detail_check_form')
                    this.detail_check_loading = false
                }
            }).catch(err=>{})
        },
        // 审核 按钮
        handle_check(){
            if(this.m_valid_addForm('detail_check_form')){
                let param = {
                    data: {
                        // 公参
                        signInUserId: this.$store.getters.userId,
                        signInRoleId: this.$store.getters.roleId,
                        // 私参
                        agentid:this.detail_check_form.agentid,
                        agent_check:"2", //this.detail_check_form.agent_check
                        // check_remark:this.detail_check_form.check_remark,
                    }
                }
                this.detail_check_loading = true
                this.$http.post(`${ commonUrl.baseUrl}/agent/agentCheck`, param).then(res=>{
                    if(res.data.code == '0000'){
                        // console.log(res)
                        this.detail_check_loading = false
                        this.detail_check_dialogVisible = false
                        this.m_message(res.data.msg, 'success')
                        this.handle_refresh(this.currentPage);
                    }else{
                      this.detail_check_loading = false;
                      this.m_message(res.data.msg, 'warning');
                    }
                }).catch(err=>{})
            }
        },
        // 选中审核状态
        selectedAgentCheck(e){
            if(e == 2){ // 审核通过
                this.detail_check_rules.check_remark = null
                // 清空校验
                //this.clearValid('detail_check_form')
            }else{
                this.detail_check_rules.check_remark = [
                    { required: true, message: '请输入审核说明', trigger: 'blur' }
                ]
            }
        },
        changeOption_bank(e){

            for(let item of this.add_form_bank.bankInfo){
                if(item.bankcode == e ){
                    this.add_form_bank.bankname = item.bankname
                }
            }

        },
        // 新增按钮
        handle_add(){
            this.add_dialogVisible = true
            // 清空数据
            this.resetForm('add_form');
            this.resetForm('add_bank_form');
            let param = {
              data:{}
            }
            this.add_loading = true
            this.$http.post(`${commonUrl.baseUrl}/agent/addAgent`, param).then(res=>{
              if(res.data.code == '0000'){
                  this.add_loading = false
                  // this.m_message(res.data.msg,'success')
              }else{
                  this.add_loading = false
                  this.m_message(res.data.msg,'error')
              }
          }).catch(err=>{
              console.log(err)
          })
        },
        // 保存 新增
        save_add(){
            // 校验
            if(this.m_valid_addForm('add_form') && this.m_valid_addForm('add_bank_form')){
              this.add_form_bank.account_no = filterSpace(this.add_form_bank.account_no)
              // 修正小数位数
              // this.add_form_bank.commission_proportion = getFloat(this.add_form_bank.commission_proportion,1);
                let param = {
                    data:{
                        // 公参
                        signInUserId: this.$store.getters.userId,
                        signInRoleId: this.$store.getters.roleId,
                        // 私参
                        agent_name:this.add_form.agent_name,
                        charger:this.add_form.charger,
                        phone:this.add_form.phone,
                        commission_proportion:this.add_form.commission_proportion*10,
                        active_fee:this.add_form.active_fee*100,
                        account_no:this.add_form_bank.account_no,
                        account_bank:this.add_form_bank.account_bank,
                        account_pro_code:this.add_form_bank.province_param.adcode,
                        account_province:this.add_form_bank.province_param.provincename,
                        account_city:this.add_form_bank.city_param.cityname,
                        account_city_code:this.add_form_bank.city_param.adcode,
                        account_user_name:this.add_form_bank.account_user_name,
                    }
                }
                this.add_loading = true
                this.$http.post(`${commonUrl.baseUrl}/agent/saveAgent`, param).then(res=>{

                    if(res.data.code == '0000'){
                        this.add_loading = false
                        this.add_dialogVisible = false
                        this.m_message('新增机构成功','success')
                        this.handle_refresh();
                    }else{
                        this.add_loading = false
                        this.m_message(res.data.msg,'success')
                    }


                }).catch(err=>{
                    console.log(err)
                })

            }
        },
        // 重置
        resetForm(formName) {
            if(this.$refs[formName]){
                this.$refs[formName].resetFields();
            }
        },
        // 省份change事件
        changeOption_province(e){
            // 参数收集
            this.queryForm.province_param = { adcode:e, txt: provinces.province_list[e] }
            // 赋值cities (先清理 后赋值)
            this.queryForm.cities = [];
            this.queryForm.city_code = '';
            this.queryCity(provinces.province_list[e],'queryForm');
        },
        changeOption_province_addBusiness(e){
            // 参数收集
            this.add_form.province_param = { adcode:e, txt: provinces.province_list[e] }
            // 赋值cities (先清理 后赋值)
            this.add_form.cities = [];
            this.add_form.city_code = '';
            this.queryCity(provinces.province_list[e],'add_form');
        },
        changeOption_city_addBusiness(e){

            for(let item of this.add_form.cities){
               if(item.adcode == e){
                   this.add_form.city_param = { cityname:item.city, adcode:e  }
               }
            }


        },
        changeOption_province_addBank(e){
            this.add_form_bank.province_param = { provincename:provinces.province_list[e], adcode:e }
            // 赋值cities (先清理 后赋值)
            this.add_form_bank.cities = [];
            this.add_form_bank.city_code = '';
            this.queryCity(provinces.province_list[e],'add_form_bank');
        },
        // 开户地
        changeOption_city_addBank(e){
            for(let item of this.add_form_bank.cities){
               if(item.adcode == e){
                   console.log(item)
                   this.add_form_bank.city_param = { cityname:item.city, adcode:e  }
               }
            }
        },
        // 查 市区 txt: String 省份名,dataOrigin 是指 add_form  或是queryeForm 这种 父级数据源
        queryCity(txt,dataOrigin){

            let vm = this
            // 搜索所有省/直辖市信息

            this.districtSearch.search(txt, function (status, result) {

                // 查询成功时，result即为对应的行政区信息
                for(let item of result.districtList[0].districtList){
                    vm[dataOrigin].cities.push({
                        adcode:item.adcode,
                        city  :item.name
                     })
                }

            })

        },
        // 针对 account_cities这个特殊（后期合并方法***）
        queryBankCity(txt,dataOrigin){

            let vm = this
            // 搜索所有省/直辖市信息

            this.districtSearch.search(txt, function (status, result) {

                // 查询成功时，result即为对应的行政区信息
                for(let item of result.districtList[0].districtList){
                    vm[dataOrigin].account_cities.push({
                        adcode:item.adcode,
                        city  :item.name
                     })
                }

            })

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
        // 分页
        handleCurrentChange(val){
            this.currentPage = val
            // 获取单前页数据列表
            this.getTableDataList(val);
        },
        // 清空校验规则
        clearValid(validForm){
            if(this.$refs[validForm]){
                this.$refs[validForm].resetFields()
            }
        },

        // 重置查询条件
        resetData(formName){

            this.$refs[formName].resetFields();
        },
        // 初始化 地图
        initMap(){
            let vm = this
            //利用高德地图API 获取 所有省
            AMap.plugin('AMap.DistrictSearch', function () {
                vm.districtSearch = new AMap.DistrictSearch({
                    // 关键字对应的行政区级别，country表示国家
                    level: 'city',
                    //  显示下级行政区级数，1表示返回下一级行政区
                    subdistrict: 1
                })
            })


        },
        // 初始化 省份数据
        initProvinces(){
            // 处理一下 数据
            let arr = [];
            for(let i in provinces.province_list){
                arr.push({
                    adcode:i,
                    province:provinces.province_list[i]
                })
            }
            this.queryForm.regions = arr
            //this.add_form.regions = arr
            this.add_form_bank.regions=arr
            // 预存 省份
            this.pre_regions = arr
            // 详情
            this.detail_form.regions = this.detail_form.account_regions = arr
            // 详情并审核
            this.detail_check_form.regions = this.detail_check_form.account_regions = arr
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
        m_message(message,type){
            this.$message({
                message,
                type
            })
        },
    }
}
</script>
