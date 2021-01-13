<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getGoodsList" @keyup.enter.native="searchGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="$router.replace('/goods/addgoods')">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe :header-cell-style="cellStyle">
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" align="left"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px" align="center"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="90px" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="200px" align="center">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px" align="center">
          <template v-slot="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import { getGoodsList, deleteGoods } from '@/api/goods'
export default {
  data(){
    return{
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      cellStyle: {
        textAlign: 'center'
      }
    }
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      getGoodsList(this.queryInfo).then(res => {
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      })
    },
    searchGoods() {
      this.getGoodsList();
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getGoodsList();
    },
    deleteGoods(row) {
      this.$confirm('确认删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(row.goods_id).then(res => {
          this.$message.success(res.meta.msg);
          this.getGoodsList();
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-table {
    font-size: 13px;
    text-align: left;
  }
</style>
