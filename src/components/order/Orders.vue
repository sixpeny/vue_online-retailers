<template>
  <div>
    <el-card>
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" align="center" width="300px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" align="center"></el-table-column>
        <el-table-column label="是否付款" align="center">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" align="center"></el-table-column>
        <el-table-column label="下单时间" align="center">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="修改地址" placement="top-end" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="addressDialogVisible = true"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看物流" placement="top-start" :enterable="false">
              <el-button type="success" size="mini" icon="el-icon-location" @click="openLogisticsDialog"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="40%">
        <el-form :model="addressForm" :rules="addFormRules" ref="addFormRef">
          <el-form-item label="省市区/县" prop="address1" label-width="85px">
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              :props="cascaderProps"
              style="width: 100%">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2" label-width="85px">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="addressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="查看物流" :visible.sync="logisticsDialogVisible" width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logisticsData"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { getOrdersList, getLogistics } from "@/api/orders";
  import cityData from './cityData'
  export default {
  name: 'orders',
  data(){
    return{
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      ordersList: [],
      addressDialogVisible: false,
      addressForm: {
        address1: '',
        address2: '',
      },
      addFormRules: {
        address1: [
          {required: true, message: '请选择省市区', trigger: 'blur'}
        ],
        address2: [
          {required: true, message: '请输入详细地址', trigger: 'blur'}
        ]
      },
      cityData,
      cascaderProps: {
        expandTrigger: 'hover',
        children: 'children'
      },
      logisticsDialogVisible: false,
      logisticsData: [],
    }
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    getOrdersList() {
      getOrdersList(this.queryInfo).then(res => {
        this.ordersList = res.data.goods;
        this.total = res.data.total;
      })
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getOrdersList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getOrdersList();
    },
    openLogisticsDialog() {
      this.logisticsDialogVisible = true;
      getLogistics().then(res => {
        this.logisticsData = res.data;
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-timeline{
    padding-inline-start: 0 !important;
  }
</style>
