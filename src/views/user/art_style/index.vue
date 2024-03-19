<template>
   <v-view
   header
   text="艺体中心"
   ref="view"
    bgc="#f8f7fa"
   >
    <div class="card">
      <div class="card_header">
        <div class="header_box">
          <div class="header_box_left" >1</div>
          <div class="header_box_right">2</div>
        </div>
      </div>
      <div class="card_body">
        <van-tabs v-model="active"
        :swipeable="true"
        >
        <van-tab title="购买记录">
          <Purchase></Purchase>
        </van-tab>
        <van-tab title="消课记录">
          <Eliminate></Eliminate>
        </van-tab>
        <van-tab title="提现记录">
          <CashList></CashList>
        </van-tab>
      </van-tabs>
      </div>
    </div>
  </v-view>
</template>

<script>
import Purchase from './components/Purchase'
import Eliminate from '@/views/user/art_style/components/Eliminate'
import CashList from './components/CashList.vue'

export default {
  data() {
    return {
      active: 0
    };
  },
  components: {Purchase, Eliminate},
  methods: {
    changeMessage() {
      this.message = "New Message";
    }
  }
};
</script>

<style scoped lang="less">
.card{
  height: calc(100% - 50px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .card_header{
    height: 30%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f7fa;
    .header_box{
      height: 90%;
      width:  90%;
      border-radius: 6px;
      box-shadow: 0 0 10px 0 rgba(119, 116, 116, 0.1);
      background-color: #fff;
      display: flex;
      .header_box_left{
        width: 64%;
        height: 90%;
        margin: 10px;
      }
      .header_box_right{
        width: 34%;
        height: 90%;
        margin: 10px;
      }
    }
  }
  .card_body{
    height: 70%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.van-tabs{
  width: 100%;
  height: 100%;
}

 /deep/ .van-tabs__content{
  height: 100%;
  width: 100%;
  background: #d31212;
}
.van-tab__pane{
    width: 100%;
    height: 100%;
    background: #fff;
    padding:  5px 25px;
    font-size: 14px;
  }
</style>
