<template>
  <view v-if="showSkeleton" class="container">
    <view class="cart_nav" :style='"height:" + navH + "rpx;"'>
      <nav-bar iconColor='#000' ref="navBarRef" navTitle="商品详情" :isBackgroundColor="false" backgroundColor="#fff"
        :isShowLeft="true" :isShowNav="true">
      </nav-bar>
    </view>
    <view @touchstart="containerClick">
      <!-- 商品轮播图 -->
      <GoodsSwiper :stock="goodsInfo.stock" :indicatorSwiperList="indicatorSwiperList" :autoplay="autoplay"
        :interval="interval" @play="handleVideaPlay" @pause="handleVideoEnded" @ended="handleVideoEnded" />
      <view class="goods-type">
        <!-- 同城生鲜 -->
        <view v-if="goodsInfo.goodsType == 0" class="type-box">
          <image class="left" src="@/pages/goods/static/images/bendi.png"></image>
          <view class="right">
            <view v-if="isShowTime" class="times">
              剩余
              <view style="width: 6rpx"></view>
              <view class="time-items">{{ time.hours }}</view>
              :
              <view class="time-items">{{ time.minutes }}</view>
              :
              <view class="time-items">{{ time.seconds }}</view>
              <view style="width: 6rpx"></view>
              结束
            </view>
            <view v-else class="times">当前活动已结束</view>
            <view class="txt">{{ deliveryTime }}配送到网格点</view>
          </view>
        </view>
        <view v-else style="height: 100%;">
          <!-- 限时秒杀 -->
          <view v-if="goodsInfo.marketingType == 1" class="type-box">
            <image class="left" src="@/pages/goods/static/images/title.png"></image>
            <view class="right">
              <view v-if="isShowTime" class="times">
                剩余
                <view style="width: 6rpx"></view>
                <view class="time-items">{{ time.hours }}</view>
                :
                <view class="time-items">{{ time.minutes }}</view>
                :
                <view class="time-items">{{ time.seconds }}</view>
                <view style="width: 6rpx"></view>
                结束
              </view>
              <view v-else class="times">当前活动已结束</view>
              <view class="txt">每日结单发货 | 单位团购价</view>
            </view>
          </view>
          <!-- 拼团未开团 -->
          <view v-else-if="goodsInfo.marketingType == 2 && !isGroupPlay" class="type-box">
            <image class="left" src="@/pages/goods/static/images/huiyuanpin.png"></image>
            <view class="right">
              <image style="width: 200rpx;" src="@/pages/goods/static/images/haopianyi.png" mode="widthFix"></image>
              <!-- <view class="txt" style="padding-top: 0;"><text>{{ groupBuyActivityResponse.buyCount }}</text>单成团 | 单位团购价</view> -->
              <view class="txt" style="padding-top: 0;">单位团购价优惠</view>
            </view>
          </view>
          <!-- 拼团已开团 -->
          <view v-else-if="goodsInfo.marketingType == 2 && isGroupPlay" class="type-box">
            <image class="left" src="@/pages/goods/static/images/tongshipin.png"></image>
            <view class="right">
              <view v-if="isShowTime" class="times">
                剩余
                <view style="width: 6rpx"></view>
                <view class="time-items">{{ time.hours }}</view>
                :
                <view class="time-items">{{ time.minutes }}</view>
                :
                <view class="time-items">{{ time.seconds }}</view>
                <view style="width: 6rpx"></view>
                结束
              </view>
              <view v-else class="times">当前拼团已结束</view>
              <!-- <view class="txt">
								已团
								<text class="num-yesnum">{{ groupBuyActivityResponse.processItem[0].buyingCountNum - groupBuyActivityResponse.processItem[0].needSomeTogetherCount }}</text>
								单 | 差
								<text class="num-yesnum">{{ groupBuyActivityResponse.processItem[0].needSomeTogetherCount }}</text>
								单成团
							</view> -->
              <view class="txt">
                已团
                <text class="num-yesnum">{{ groupBuyActivityResponse.processItem[0].buyingCountNum -
                  groupBuyActivityResponse.processItem[0].needSomeTogetherCount }}</text>
                单 | 单位团购价
              </view>
            </view>
          </view>
        </view>
      </view>
      <view style="position: relative; top: -30rpx">
        <view class="goods-info">
          <view v-if="goodsInfo.price != '-1'" class="goods-price">
            <!-- v-if="isShowPrice" -->
            <view style="margin-right: 20rpx;">
              <text>￥</text>
              <text class="price">{{ goodsInfo.leftPrice[0] }}</text>
              <text>.{{ goodsInfo.leftPrice[1] }}</text>
            </view>
            <view class="open-price" v-if="goodsInfo.price != -1">
              <text class="price-txt">开团价</text>
              <text class="left-price">{{ goodsInfo.rightPrice[0] }}</text>
              <text class="right-price">.{{ goodsInfo.rightPrice[1] }}</text>
            </view>
            <view class="price-tag" v-if="isShowPrice">
              <view class="sanjiao1"></view>
              <view class="sanjiao2"></view>
              <view class="num-text" :class="{ wraps: isWrap }">
                <view class="left-label">{{ subsidyFlag == 2 ? '厂家再降' : '官方补贴' }}</view>
                <view> -{{ goodsInfo.subsidyRatio }}</view>
              </view>
            </view>
          </view>
          <view v-else class="no-vip-txt" @click="clickToWechatLogin">点击登录显示会员价</view>
          <view class="goods-name">{{ goodsInfo.name }}</view>
          <view class="goods-solt">
            <view class="left">
              <text v-if="allSales >= 10000">{{ goodsType == 0 ? '本单位已售' : '全网单位已售' }} {{ allSales.slice(0, -4)
                }}万+</text>
              <text v-else>{{ goodsType == 0 ? '本单位已售' : '全网单位已售' }} {{ allSales }}</text>
            </view>
            <view class="right">
              <view class="users" v-if="userAvatarList && userAvatarList.length">
                <image v-for="(item, index) of userAvatarList" :key="index" :class="{
                  posRight1: index == 0,
                  posRight2: index == 1,
                  posRight3: index == 2,
                  posRight4: index == 3,
                  posRight5: index == 4,
                }" :src="item" mode="" />
              </view>
              <button hover-class="none" @click="shareApp">
                <view class="center">分享</view>
                <image class="share" src="@/pages/goods/static/images/share.png" mode=""></image>
              </button>
            </view>
          </view>
        </view>
        <!-- 全网官旗店比价 -->
        <view class="box comparison" v-if="productComparativeResponse && goodsType != 0">
          <view class="top">
            <view class="flex-between">
              <view class="title">全网官旗店比价</view>
              <view class="updata">
                更新日期：{{ productComparativeResponse.createTime ? productComparativeResponse.createTime.split(' ')[0] : ''
                }}
              </view>
            </view>
            <view class="txt">价格及销量会因第三方平台实时调整而动态变化，仅供参考！</view>
          </view>
          <image :src="JSON.parse(productComparativeResponse.comparativePath).url" mode="widthFix" alt="暂无图片"
            @click="preViewComparison"></image>
        </view>
        <!-- 服务保障 -->
        <view class="box service">
          <view class="top">
            <view class="left">服务保障</view>
            <view class="right"><text v-if="productTag">{{ productTag.tagName }}</text></view>
          </view>
          <view class="content" @click="choose('service')">
            <view class="left">
              <view>{{ guaranteeList[0].name }} </view>
              <view style="display: flex; flex: 1; align-items: center;">
                <block v-for="(item, index) of guaranteeList" :key="index">
                  <view v-if="index != 0 && index < 3">
                    <text style="padding: 0 10rpx;">·</text>{{ item.name }}
                  </view>
                </block>
              </view>
            </view>
            <image src="@/static/images/right.png" mode=""></image>
          </view>
        </view>
        <!-- 商品评价 -->
        <view v-if="productReplyResponseList.length" class="box comments">
          <view class="flex-between">
            <view class="left">商品评价</view>
            <view class="more" @click="jumpPage('comments')">
              <view v-if="productReplyResponseList.length >= 2"><text>全部</text></view>
              <image v-if="productReplyResponseList.length >= 2" src="@/static/images/right.png" mode=""></image>
            </view>
          </view>
          <view class="latest">
            <view v-for="(item, index) of productReplyResponseList" :key="index" class="items">
              <view class="user-info">
                <image class="avatar" :src="item.avatar" mode=""></image>
                {{ item.nickname }}
              </view>
              <view class="content">{{ item.comment }}</view>
              <view class="imgs" v-if="item.pics && item.pics.split(',').length">
                <image v-for="(itemImg, indexImg) of item.pics.split(',')" :key="indexImg" :src="itemImg"
                  @click="previewReplyImage(item, indexImg)"></image>
              </view>
            </view>
          </view>
        </view>
        <!-- 店铺信息 -->
        <view class="mer-box">
          <view class="content" @click="jumpStore">
            <image :src="storeLogoPath" mode=""></image>
            <view class="right">
              <view class="top">
                <view class="mer-name">{{ storeName }}{{ storeTypeText }}</view>
                <view class="mer-btn">进店</view>
              </view>
              <view class="bottom">
                <view class="mer-xingji">
                  综合评价
                  <uni-rate style="margin-left: 14rpx;" v-model="storeStar" :size="12" active-color="#F72C1B"
                    :readonly="true"></uni-rate>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 商品规格 -->
        <view class="detail">
          <view class="attr flex-between" @click="choose('attr')">
            <view class="left">
              <view class="titles">规格型号</view>
              <view class="content">{{ selectAttr.sku }}</view>
            </view>
            <image src="/static/images/right.png" mode=""></image>
          </view>
          <view class="details">商品详情</view>
        </view>
        <!-- 商品参数 -->
        <view class="parameters">
          <view class="items">
            <view class="label">品牌</view>
            <view class="value">{{ brandName }}</view>
          </view>
          <block v-for="(item, index) of parameterValues" :key="index">
            <view class="items" v-if="index < 4">
              <view class="label">{{ item.name }}</view>
              <view class="value">{{ item.value }}</view>
            </view>
          </block>
          <view class="items" v-if="isShowAllParameter">
            <view class="" @click="choose('parameters')">
              全部参数
              <image src="/static/images/right.png" mode=""></image>
            </view>
          </view>
        </view>
      </view>
      <!-- 底部按钮 -->
      <view class="buttons" :class="{ padi: isIOS }">
        <view class="left">
          <view class="items" @click="jumpHome">
            <image src="../static/images/home.png" mode=""></image>
            <view>首页</view>
          </view>
          <view class="items" @click="setCollect">
            <image v-if="isCollect" src="../static/images/shoucang2.png" mode=""></image>
            <image v-else src="../static/images/shoucang1.png" mode=""></image>
            <view>收藏</view>
          </view>
          <button class="items" open-type="contact" hover-class="none">
            <image src="../static/images/service.png" mode=""></image>
            <view>客服</view>
          </button>
        </view>
        <view class="right" :class="{ noneBtn: goodsInfo.stock == 0 }" @click="confirmPay">{{ payButton }}</view>
      </view>
      <view style="line-height: 0;" v-html="goodsInfo.content"></view>
      <view class="explain-html">
        <view v-html="basicsProductExplain"></view>
      </view>
    </view>
    <!-- 海报 -->
    <uni-popup ref="share" type="bottom">
      <view class="share-box" :class="{ padi: isIOS }">
        <view v-if="isShowPoster" class="poster-box">
          <view class="canvas-box" :style="{ width: posterWidth + 'rpx', height: posterHeight + 'rpx' }">
            <image class="poster-img" :src="posterFilePath" style="width: 100%; height: 100%;"></image>
          </view>
          <view class="save-btn" @click="saveImagePhoneAlbum">保存到手机相册</view>
          <view class="save-btn" @click="closePopup('share')">关闭</view>
        </view>
        <view v-else class="share" :class="{ padi: isIOS }">
          <view class="box">
            <view class="title">分享</view>
            <view class="func">
              <view class="items" @click="goodsPosterCanvas">
                <image src="/pages/goods/static/images/weixin.png"></image>
                <view>生成海报</view>
              </view>
              <button class="items" open-type="share" hover-class="none">
                <image src="/pages/goods/static/images/weixin.png"></image>
                <view>直接分享</view>
              </button>
            </view>
          </view>
          <view class="close_button" @click="closePopup('share')">关闭</view>
        </view>
      </view>
    </uni-popup>
    <!-- 保障服务  -->
    <uni-popup ref="service" type="bottom">
      <Service :isIOS="isIOS" :guaranteeList="guaranteeList" @close="closePopup" />
    </uni-popup>
    <!-- 规格 -->
    <uni-popup ref="attr" type="bottom">
      <view class="goods-attr" :class="{ padi: isIOS }">
        <view class="goods-attr-info">
          <view class="goods-img">
            <image :src="selectAttr.image" mode=""></image>
            <view v-if="selectAttr.stock == 0" class="sell-out">已售罄</view>
          </view>
          <view class="info-box">
            <view class="goods-name">{{ goodsInfo.name }}</view>
            <view class="attr-name">{{ selectAttr.sku }}</view>
            <view class="attr-price-box">
              <view class="goods-price" :class="{ logotxt: selectAttr.price == '-1' }">
                ￥{{ selectAttr.price == '-1' ? '点击登录显示会员价' : selectAttr.price }}
              </view>
              <view v-if="attrFlagTxt != '' && selectAttr.subsidyRatio != 0" class="attr-tag">{{ attrFlagTxt }}</view>
            </view>
          </view>
        </view>
        <view class="attr-box">
          <view class="attr-items" v-for="(item, index) of productAttr" :key="item.id">
            <view class="title">{{ item.attributeName }}</view>
            <view class="item-box">
              <view v-for="(itemChild, indexChild) of item.optionList" :key="itemChild.id" class="items"
                :class="itemChild.isSelect ? 'selector' : ''" @click="handleSelectAttr(item, itemChild)">
                <view class="name">{{ itemChild.optionName }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="goods-num">
          <view class="left">数量</view>
          <view class="num-input">
            <view class="sub" @click="subNum">-</view>
            <view class="num">{{ num }}</view>
            <view class="add" @click="addNum">+</view>
          </view>
        </view>
        <view class="bottom" :class="{ noneBtn: selectAttr.stock == 0 }" @click="confirmAttr">确认</view>
      </view>
    </uni-popup>
    <!-- 参数 -->
    <uni-popup ref="parameters" type="bottom">
      <Parameters :brandName="brandName" :isIOS="isIOS" :parameterValues="parameterValues" @close="closePopup" />
    </uni-popup>

    <view v-if="isShowToast" class="toast">{{ toastTitle }}</view>

    <canvas class="poster-canvas" id="posterCanvas" canvas-id="posterCanvas"></canvas>
    <canvas class="weixin-canvas" id="shareCanvas" canvas-id="shareCanvas"></canvas>
  </view>
</template>

<script>
import {
  mapGetters
} from "vuex"
import {
  ProductTypeEnum
} from "@/enums/productEnums"
import {
  chatConfig
} from "@/utils/consumerType.js"
import {
  Debounce,
  getWeekDay
} from "@/utils/validate.js"
import navBar from '@/components/navBar'
import Service from './components/service.vue'
import Parameters from './components/parameters.vue'
import GoodsSwiper from '../components/goodsSwiper/index.vue'
import {
  getProductDetail,
  collectCancel,
  collectAdd,
} from '@/api/product.js'
import {
  merCustomerApi
} from "@/api/merchant.js"
import { apiFrontUserInfoByUserId, mpQrcode } from '@/api/api.js'
import { onGetPreOrder } from '@/libs/order'
import { createShareImage, createShareImg, createSecondShareImg } from '@/utils/canvas'
import { base64src } from '@/utils/base64src'

export default {
  components: {
    navBar,
    Service,
    Parameters,
    GoodsSwiper
  },
  data() {
    return {
      autoplay: true,	// 轮播图是否自动切换
      interval: 3000,	// 轮播图自动切换间隔（毫秒）

      isShowPrice: false,	// 是否显示补贴和再降金额
      goodsType: 1,	// 0是同城生鲜，1是非同城生鲜
      rateValue: 4,
      showSkeleton: false,
      id: '',	// 商品id
      activityType: -1,	// 营销类型 1=秒杀商品 2=会员拼团
      deliveryTime: '',	// 同城生鲜备注说明
      isGroupPlay: false,	// 开团为false，拼团为true。只在拼团商品时有效
      serviceConfig: null,	// 客服信息
      swiperList: [],	// 商品轮播图
      isShowTime: true,	// 是否显示倒计时
      time: {
        hours: '00',	// 时
        minutes: '00',	// 分
        seconds: '00'	// 秒
      },
      posterWidth: 640, //海报宽度
      posterHeight: 1014, //海报高度
      beginSale: 0,
      merchantInfo: {},	// 商户信息
      localOrderSum: 0,	// 同城生鲜
      goodsInfo: {},	// 商品信息
      isCollect: false,	// 是否是收藏的商品
      groupBuyActivityResponse: {},	// 拼团信息
      productComparativeResponse: {},	// 商品比价
      userAvatarList: [],	// 最新网格的五个头像
      productTag: {},	// 商品标签
      productAttr: [],	// 规格展示列表
      productValue: {},	// 规格数据列表
      productReplyResponseList: [],	// 评价列表
      isShowAllParameter: false,	// 是否显示全部参数
      parameterValues: [],	// 商品参数
      guaranteeList: [],	// 服务保障列表
      storeLogoPath: '',	// 店铺logo
      storeType: '',	// 店铺类型
      storeName: '',	// 店铺名称
      storeId: '',
      storeSale: 0,	// 店铺销量
      storeStar: 0,	// 店铺星级
      subsidyFlag: false,	// 是否开启了官补和直降
      basicsProductExplain: '',	// 购买说明
      payButton: '立即购买',	// 按钮文本
      brandName: '',	// 品牌名称

      selectAttr: {},	// 选择的规格
      num: 1,
      filePath: '',

      isShowToast: false,	// 提示显示盒隐藏
      toastTitle: '',	// 提示文本内容

      isShowPoster: false,  // 是否显示海报
      posterFilePath: '', // 海报图片路径
      posterReadImgs: [],	// 海报网络图片
    }
  },
  computed: {
    ...mapGetters(['isIOS', 'isLogin', 'baseURL']),
    indicatorSwiperList() {
      const videoObj = { type: 'video', url: this.goodsInfo.videoLink }
      this.$set(videoObj, 'progressWidth', 0)
      const imageList = this.swiperList.map(item => {
        this.$set(item, 'progressWidth', 0)
        return {
          type: 'image',
          ...item
        }
      })
      return this.goodsInfo.videoLink
        ? [videoObj, ...imageList]
        : imageList
    },
    // 订单类型 group 开团 seckill 拼团 buyNow 本地生鲜
    preOrderType() {
      if (this.goodsInfo.marketingType == 0) {
        return 'buyNow'
      } else if (this.goodsInfo.marketingType == 1) {
        return 'seckill'
      } else {
        return 'group'
      }
    },
    // 海报图片
    posterImgs() {
      return [
        `${this.baseURL}posterbg.png`,
        `${this.baseURL}white.png`,
        `${this.baseURL}posterTxt1.png`,
        `${this.baseURL}posterTxt2.png`,
        `${this.baseURL}posterTxt3.png`,
        `${this.baseURL}posterTxt4.png`,
        `${this.baseURL}posterTxt5.png`,
        `${this.baseURL}haibaobiankuang.png`,
      ]
    },
    // 店铺类型检索
    storeTypeText() {
      const value = this.storeType

      switch (value) {
        case 1: return '自营旗舰店'
        case 2: return '自营海外旗舰店'
        case 3: return '自营专卖店'
        case 4: return '自营海外专卖店'
        default: return '同城店'
      }
    },
    // 直降补贴是否换行
    isWrap() {
      if (this.goodsInfo.price > 1000 || this.goodsInfo.otPrice > 1000) {
        return true
      }

      return false
    },
    // 规格直降补贴金额
    attrFlagTxt() {
      let txt = ''
      if (!this.subsidyFlag || this.subsidyFlag == 1) {
        return txt
      }
      // 首件
      if (this.firstOrderFlag) txt += '首件'
      else txt += '每件'
      if (this.subsidyFlag == 2) txt += '厂家再降'
      else txt += '官方补贴'
      txt += ` -${this.selectAttr.subsidyRatio}`

      return txt
    },
    // 全部销量
    allSales() {
      // 同城生鲜
      if (this.goodsType == 0) {
        return (this.localOrderSum * 3.3 + this.goodsInfo.ficti).toFixed(0).toString()
      } else {	// 集体开团
        return (this.goodsInfo.sales * 3.3 + this.goodsInfo.ficti).toFixed(0).toString()
      }
    }
  },
  onLoad(options) {
    if (options.scene) {
      const query = this.shareQueryJx(options.scene)

      this.id = query.id
      this.activityType = query.atype
      this.goodsType = query.gtype
    } else {
      if (options.goodsType) {
        this.goodsType = options.goodsType
      }
      this.id = options.id
      this.activityType = options.activityType
    }

    apiFrontUserInfoByUserId(4).then(res => { })
    // 如果是通过分享进来的话，那么写入标记到缓存
    if (!this.isLogin && options.spid) {
      uni.setStorageSync('isShare', true)
      apiFrontUserInfoByUserId(options.spid).then(res => {
        uni.setStorageSync('shareUserInfo', JSON.stringify(res.data))
      })
    }
  },
  onShow() {
    if (this.autoplay == false) {
      this.autoplay = true
    }
    this.getDetail()
  },
  onHide() {
    this.autoplay = false
  },
  // 分享
  onShareAppMessage() {
    return {
      title: `${this.storeName}${this.storeTypeText}@${this.goodsInfo.name}`,
      imageUrl: this.filePath,
      path: `/pages/goods/goods_details/index?id=${this.id}&activityType=${this.activityType}&goodsType=${this.goodsType}&spid=${this.$store.state.app.uid}`,
    }
  },
  methods: {
    // 跳转登录页
    clickToWechatLogin() {
      if (!this.isLogin) {
        uni.navigateTo({
          url: '/pages/users/wechat_login/index'
        })
      }
      const auditStatus = uni.getStorageSync('auditStatus')
      uni.showToast({
        title: auditStatus,
        icon: 'none'
      })
      if (auditStatus != 2) {
        uni.navigateTo({
          url: '/pages/users/user_info/index'
        })
      }
    },
    containerClick() {
      this.$refs.navBarRef.closeMenu()
    },
    // 视频播放时让轮播图滚动停止
    handleVideaPlay() {
      this.autoplay = false
    },
    // 视频播放结束，轮播图继续滚动
    handleVideoEnded() {
      this.autoplay = true
    },
    // 获取详情
    getDetail() {
      uni.showLoading({
        title: ''
      })
      const data = {
        id: this.id,
        activityType: this.activityType
      }
      getProductDetail(data).then(res => {
        this.beginSale = res.data.beginSale	// 秒杀，同城生鲜本单位本次已团数量
        this.merchantInfo = res.data.merchantInfo	// 商户信息
        this.goodsInfo = res.data.productInfo	// 商品信息
        if (this.goodsType == 0) {
          this.goodsInfo.goodsType = this.goodsType
        }
        if (this.goodsInfo.price != '-1') {
          this.goodsInfo.leftPrice = this.goodsInfo.otPrice.split('.')
        }
        if (this.goodsInfo.price != '-1') {
          this.goodsInfo.rightPrice = this.goodsInfo.price.split('.')
        }
        this.swiperList = JSON.parse(res.data.productInfo.sliderImage)	// 轮播图列表
        this.groupBuyActivityResponse = res.data.groupBuyActivityResponse	// 拼团信息
        if (this.groupBuyActivityResponse) {
          this.groupBuyActivityResponse.groupLength = res.data.groupBuyActivityResponse.processItem.length	// 已拼团人数
        }
        this.productComparativeResponse = res.data.productComparativeResponse	// 商品比价
        this.userAvatarList = res.data.userAvatarList
        this.localOrderSum = res.data.localOrderSum	// 同城生鲜销量
        this.deliveryTime = getWeekDay(res.data.deliveryTime)	// 同城配送时间
        this.productTag = res.data.productTag	// 商品标签
        this.productAttr = res.data.productAttr	// 商品展示规格
        this.productValue = res.data.productValue	// 商品数据规格

        // ********** 核心修改：多规格默认选中逻辑 **********
        let defaultAttr = null;
        let isHaveDefaultAttr = false;

        // 步骤1：遍历productValue，找到isDefault: true的默认规格
        for (const key in this.productValue) {
          const attrItem = this.productValue[key];
          if (attrItem.isDefault === true) { // 优先匹配默认规格
            defaultAttr = attrItem;
            isHaveDefaultAttr = true;
            break; // 确保仅取第一个默认规格
          }
        }

        // 步骤2：若有默认规格，同步更新productAttr的选中状态
        if (isHaveDefaultAttr && defaultAttr) {
          this.selectAttr = defaultAttr; // 选中默认规格
          const defaultAttrKeys = defaultAttr.sku.split(','); // 拆分默认规格的属性值（如["红色","XL"]）

          // 遍历每个规格组，标记对应选项为选中
          this.productAttr.forEach((attrGroup, groupIndex) => {
            const targetValue = defaultAttrKeys[groupIndex]; // 当前组应选中的属性值
            attrGroup.optionList.forEach(option => {
              option.isSelect = option.optionName === targetValue;
            });
          });
        }
        // 步骤3：兜底处理（无默认规格时，选中第一个规格）
        else {
          // 遍历productValue，取第一个规格作为默认
          const firstAttrKey = Object.keys(this.productValue)[0];
          if (firstAttrKey) {
            defaultAttr = this.productValue[firstAttrKey];
            this.selectAttr = defaultAttr;
            const firstAttrKeys = firstAttrKey.split(','); // 拆分第一个规格的属性值

            // 同步更新productAttr的选中状态
            this.productAttr.forEach((attrGroup, groupIndex) => {
              const targetValue = firstAttrKeys[groupIndex];
              attrGroup.optionList.forEach(option => {
                option.isSelect = option.optionName === targetValue;
              });
            });
          }
        }

        this.guaranteeList = res.data.guaranteeList	// 服务保障
        this.productReplyResponseList = res.data.productReplyResponseList	// 商品评价
        this.isShowAllParameter = res.data.parameterValues.length >= 5 ? true : false
        this.parameterValues = res.data.parameterValues	// 商品参数
        try {
          this.storeLogoPath = JSON.parse(res.data.storeLogoPath).url	// 店铺logo
        } catch {
          this.storeLogoPath = res.data.storeLogoPath	// 店铺logo
        }
        this.storeType = res.data.storeType	// 店铺类型
        this.storeName = res.data.storeName	// 店铺名称
        this.storeId = res.data.storeId	// 店铺id
        this.storeCollectFlag = res.data.storeCollectFlag //店铺是否关注
        this.storeSale = res.data.storeSale	// 店铺销量
        this.storeStar = res.data.storeStar	// 店铺星级
        this.subsidyFlag = res.data.subsidyFlag	// 是否开启了官补和直降
        this.firstOrderFlag = res.data.firstOrderFlag	// 是否是首件降或补
        this.basicsProductExplain = res.data.basicsProductExplain	// 购买须知
        this.isCollect = res.data.userCollect	// 是否收藏商品
        this.brandName = res.data.brandName	// 品牌名称

        this.isGroupPlay = this.goodsInfo.marketingType == 2 && this.groupBuyActivityResponse.processItem.length ? true : false

        if (this.subsidyFlag == 2 || this.subsidyFlag == 1) {
          if (this.goodsInfo.subsidyRatio && this.goodsInfo.subsidyRatio != 0) {
            this.isShowPrice = true
          }
        }

        // 设置右下角按钮文本
        this.setPayButton()
        // 秒杀
        if (res.data.productInfo.marketingType == 1 && res.data.endTimeStamp) {
          const endTimeStamp = new Date(res.data.endTimeStamp).getTime()
          this.timeKeeping(endTimeStamp)
        } else if (res.data.productInfo.marketingType == 2 && res.data.groupBuyActivityResponse.processItem.length) {
          // 开团
          const endTimeStamp = new Date(res.data.groupBuyActivityResponse.processItem[0].recordEndTime).getTime()
          this.timeKeeping(endTimeStamp)
        }
        let comparativePathImg = ''
        if (res.data.productComparativeResponse && JSON.parse(res.data.productComparativeResponse.comparativePath).url) {
          comparativePathImg = JSON.parse(res.data.productComparativeResponse.comparativePath).url
        }
        if (comparativePathImg != '') {
          this.getPosterImage([...this.posterImgs, this.storeLogoPath, comparativePathImg])
        } else {
          this.getPosterImage([...this.posterImgs, this.storeLogoPath])
        }
        uni.hideLoading()
        this.showSkeleton = true
      }).catch((err) => {
        uni.hideLoading()
        this.showSkeleton = false
        uni.showToast({
          title: err,
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      })
    },
    // 获取海报图片
    getPosterImage(imgs, index = 0) {
      const that = this
      if (index > imgs.length) {
        return
      }
      uni.getImageInfo({
        src: imgs[index],
        success(res) {
          that.posterReadImgs.push(res.path)
          that.getPosterImage(imgs, ++index)
        }
      })
    },
    // 计算时间差并倒计时
    timeKeeping(endTime) {
      console.log(endTime);

      const time = setInterval(() => {
        // 获取当前时间戳
        const timestamp = new Date().getTime()
        if (timestamp >= endTime) {
          clearInterval(time)
          this.isShowTime = false
        }
        const diff = endTime - timestamp

        const hours = Math.floor(diff / (1000 * 60 * 60))	// 时
        const minutes = Math.floor(diff / (1000 * 60)) % 60	// 分
        const seconds = Math.floor(diff / 1000) % 60	// 秒

        this.time.hours = hours
        this.time.minutes = minutes
        this.time.seconds = seconds
      }, 1000)
    },
    // 设置购买按钮文本
    setPayButton() {
      if (this.goodsInfo.marketingType === 0) {
        this.payButton = '立即购买'
      } else if (this.goodsInfo.marketingType === 1) {
        this.payButton = '立即抢购'
      } else {
        if (this.groupBuyActivityResponse.processItem.length) {
          this.payButton = '立即拼团'
        } else {
          this.payButton = '开团购买'
        }
      }
    },
    // 全网对比图大图预览
    preViewComparison() {
      uni.previewImage({
        urls: [JSON.parse(this.productComparativeResponse.comparativePath).url]
      })
    },
    // 弹出对应弹出框
    choose(type) {
      this.$refs[type].open()
    },
    // 关闭服务弹窗
    closePopup(value) {
      if (value === 'share') {
        this.posterFilePath = ''
        this.isShowPoster = false
      }
      this.$refs[value].close()
    },
    // 选择商品规格，将选择的规格同步到详情页
    handleChange(data) {
      this.selectAttr = data
    },
    // 跳转评价页
    jumpPage() {
      uni.navigateTo({
        url: "/pages/goods/goods_evaluation/index?id=" + this.id
      })
    },
    // 预览评价图片
    previewReplyImage(item, index) {
      uni.previewImage({
        urls: item.pics.split(','),
        current: index
      })
    },
    // 跳转店铺页面
    jumpStore() {
      uni.navigateTo({
        url: `/pages/merchant/home/index?storeId=${this.storeId}&activityType=${this.activityType}`
      })
    },
    // 跳转首页
    jumpHome: Debounce(function () {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }),
    // 收藏商品
    setCollect: Debounce(function () {
      const that = this;

      if (this.isCollect) {
        const data = {
          ids: `${this.id}`
        }
        collectCancel(data).then((res) => {
          that.isCollect = false
          that.$util.Tips({
            title: "取消收藏",
          });
        });
      } else {
        const data = {
          productId: that.id,	// 商品id
          category: this.goodsInfo.marketingType	// 商品类型
        }
        collectAdd(data).then((res) => {
          that.isCollect = true
          that.$util.Tips({
            title: "收藏成功",
          });
        });
      }
    }),
    // 跳转客服
    jumpService() {
      // 客服逻辑
    },
    shareQueryJx(query) {
      // query 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      const scene = decodeURIComponent(query);
      const obj = {};
      for (let i = 0; i < scene.split('*').length; i++) {
        const arr = scene.split('*')[i].split('/');
        obj[arr[0]] = arr[1];
      }
      return obj
    },
    // 生成海报
    async goodsPosterCanvas() {
      const goodsName = this.goodsInfo.name.replace(' ', '')
      let topTxt = ''
      if (this.goodsType == 0) {
        topTxt = this.posterReadImgs[5]
      } else {
        // 集体开团
        if (this.goodsInfo.marketingType == 1) {
          topTxt = this.posterReadImgs[3]
        } else {
          if (this.groupBuyActivityResponse.processItem.length) {
            topTxt = this.posterReadImgs[4]
          } else {
            topTxt = this.posterReadImgs[2]
          }
        }
      }
      const data = {
        page: `pages/goods/goods_details/index`,
        scene: `id/${this.id}*atype/${this.activityType}*gtype/${this.goodsType}`,
      }
      const res = await mpQrcode(data)
      if (this.productComparativeResponse && JSON.parse(this.productComparativeResponse.comparativePath).url != '') {
        base64src(res.data.code, new Date().getTime(), startCreateSecondShareImg)
        this.posterWidth = 700 //海报宽度
        this.posterHeight = 1014 //海报高度
      } else {
        base64src(res.data.code, new Date().getTime(), startCreateShareImg)
        this.posterWidth = 640 //海报宽度
        this.posterHeight = 1014 //海报高度
      }
      const that = this
      function startCreateShareImg(path) {
        // 图片加载成功后的操作，例如绘制到canvas上
        const imageBase = {
          posterImg: that.posterReadImgs[0],
          whiteImg: that.posterReadImgs[1],
          program: path,
          topTxt,
          bottomTxt: that.posterReadImgs[6]
        }
        createShareImg(
          that,
          imageBase,
          that.goodsInfo.image,
          goodsName,
          that.goodsInfo.price,
          `￥${that.goodsInfo.otPrice}`
        ).then(res => {
          that.posterFilePath = res
          that.isShowPoster = true
          uni.hideLoading()
        }).catch(err => {
          uni.showToast({
            title: err,
            icon: 'none'
          })
          uni.hideLoading()
        })
      }
      function startCreateSecondShareImg(path) {
        const imageBase = {
          posterImg: that.posterReadImgs[0],
          whiteImg: that.posterReadImgs[1],
          program: path,
          topTxt,
          bottomTxt: that.posterReadImgs[6],
          whiteImg2: that.posterReadImgs[7],
          storeLogo: that.posterReadImgs[8], // 店铺logo
          originalCost: that.goodsInfo.price, // 原价
          discount: that.goodsInfo.otPrice, // 折扣
          tradeName: goodsName, // 商品名称
          storeName: that.storeName, // 店铺名称
          comparePrices: that.posterReadImgs[9], // 比价
        }
        console.log(imageBase.storeLogo, 'imageBase.storeLogo');
        console.log(imageBase.whiteImg, 'imageBase.whiteImg');
        // const imageBase = {
        // 	posterImg: that.posterReadImgs[0],
        // 	whiteImg: that.posterReadImgs[1],
        // 	program: path,
        // 	topTxt,
        // 	bottomTxt: that.posterReadImgs[6]
        // }
        createSecondShareImg(
          that,
          imageBase,
          that.goodsInfo.image,
        ).then(res => {
          that.posterFilePath = res
          that.isShowPoster = true
          uni.hideLoading()
        }).catch(err => {
          uni.showToast({
            title: err,
            icon: 'none'
          })
          uni.hideLoading()
        })
      }
    },
    // 保存图片到相册
    saveImagePhoneAlbum() {
      const that = this
      // 保存图片到相册
      uni.saveImageToPhotosAlbum({
        filePath: this.posterFilePath,
        success() {
          uni.showToast({
            title: '保存成功',
            icon: 'none'
          })
          that.$refs.share.close()
        },
        fail() {
          uni.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      })
    },
    // 关闭分享弹框
    closeShare() {
      this.isShowPoster = false
      this.$refs.share.close()
    },
    // 分享
    shareApp() {
      if (!this.isLogin) {
        uni.showToast({
          title: '请授权后再分享',
          icon: 'none'
        })
        return
      }
      const auditStatus = uni.getStorageSync('auditStatus')
      if (auditStatus != 2) {
        uni.showToast({
          title: '会员未登录不可分享',
          icon: 'none'
        })
        return
      }
      if (this.posterFilePath != '') {
        this.isShowPoster = true
        return
      }
      if (this.filePath === '') {
        const that = this
        const price = '￥' + this.goodsInfo.price
        const offersPrice = Number(this.goodsInfo.otPrice - this.goodsInfo.price).toFixed(2) + '元'

        let shareBg = ''
        // 生鲜
        if (this.goodsType == 0) {
          shareBg = this.baseURL + 'shareBg4.png'
        } else {
          // 集体开团
          if (this.goodsInfo.marketingType == 1) {
            shareBg = this.baseURL + 'shareBg1.png'
          } else {
            // 已开团
            if (this.groupBuyActivityResponse.processItem.length) {
              shareBg = this.baseURL + 'shareBg3.png'
            } else {	// 未开团
              shareBg = this.baseURL + 'shareBg2.png'
            }
          }
        }

        uni.getImageInfo({
          src: shareBg,
          success(res) {
            createShareImage(that, res.path, that.goodsInfo.image, price, offersPrice).then(res => {
              that.filePath = res
              uni.hideLoading()
              that.$refs.share.open()
            }).catch(err => {
              uni.showToast({
                title: err,
                icon: 'none'
              })
              uni.hideLoading()
            })
          }
        })
      } else {
        this.$refs.share.open()
      }
    },
    // 确认购买
    confirmPay() {
      if (this.goodsInfo.stock == 0) {
        this.toastTitle = '商品已售罄'
        this.isShowToast = true
        const time = setTimeout(() => {
          this.isShowToast = false
          clearTimeout(time)
        }, 1500)
        return
      }
      // 未授权提示授权
      if (!this.isLogin) {
        uni.showToast({
          title: '您还未授权登录',
          icon: 'none'
        })
        uni.navigateTo({
          url: '/pages/users/wechat_login/index'
        })
        return
      }

      // 授权了但未注册会员
      const auditStatus = uni.getStorageSync('auditStatus')
      if (this.isLogin) {
        if (auditStatus == 4) {
          uni.showToast({
            title: '请注册会员后下单',
            icon: 'none'
          })
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/users/user_info/index'
            })
          }, 1000)
          return
        }
        if (auditStatus == 3) {
          uni.showToast({
            title: '您的会员审核被驳回，请联系管理员',
            icon: 'none'
          })
          return
        }
        if (auditStatus == 1) {
          uni.showToast({
            title: '您的账号还在审核中',
            icon: 'none'
          })
          return
        }
        this.$refs.attr.open()
      }
    },

    // 规格相关
    // 从productValue检索规格
    retrievalAttr(attrList) {
      const temp = [];
      attrList.forEach(item => {
        for (const itemChild of item.optionList) {
          if (itemChild.isSelect) {
            temp.push(itemChild.optionName);
            break;
          }
        }
      });

      const valueKey = temp.length > 1 ? temp.join(',') : temp[0];
      this.selectAttr = this.productValue[valueKey] || {};
    },
    subNum() {
      if (this.num > 1) {
        this.num--;
      }
    },
    addNum() {
      if (this.num < this.selectAttr.stock && this.num < 99) {
        this.num++;
      }
    },
    // 选择商品属性
    handleSelectAttr(item, itemChild) {
      item.optionList.forEach(items => {
        items.isSelect = false;
      });
      itemChild.isSelect = true;
      this.retrievalAttr(this.productAttr);
      this.num = 1;
    },
    // 提交订单预下单
    confirmAttr: Debounce(function () {
      // 判断选择的规格是否售空
      if (this.selectAttr.stock == 0) {
        this.toastTitle = '商品已售罄';
        this.isShowToast = true;
        const time = setTimeout(() => {
          this.isShowToast = false;
          clearTimeout(time);
        }, 1500);
        return;
      }
      if (!this.isLogin) {
        uni.navigateTo({
          url: '/pages/users/wechat_login/index'
        });
        return false;
      }
      let groupBuyRecordId = 0;
      if (this.goodsInfo.marketingType === 2) {
        if (this.groupBuyActivityResponse.processItem.length) {
          // 赋值拼团记录id
          groupBuyRecordId = this.groupBuyActivityResponse.processItem[0].groupBuyingId;
        }
      }
      uni.showLoading();
      const orderDetail = {
        attrValueId: this.selectAttr.id,	// 规格id
        groupBuyActivityId: null,	// 营销类型
        groupBuyRecordId,	// 开团时传0，拼团时传拼团id
        productId: this.goodsInfo.id,	// 商品id
        productNum: this.num,	// 购买数量
      };
      onGetPreOrder(this.preOrderType, [orderDetail], { goodsType: this.goodsType, shareFlag: this.goodsInfo.shareFlag }).then(res => {
        uni.hideLoading();
        // 获取到预下单编号后跳转确认页
        // const orderNo = res.data.orderNo;
        // uni.navigateTo({
        // 	url: `/pages/goods/goods_confirm/index?orderNo=${orderNo}`
        // });
      }).catch(err => {
        this.toastTitle = err;
        this.isShowToast = true;
        const time = setTimeout(() => {
          this.isShowToast = false;
          clearTimeout(time);
        }, 3000);
        uni.hideLoading();
      });
    })
  },
}
</script>

<style scoped lang="scss">
.container {
  font-family: 黑体;
  position: relative;
  padding-bottom: 164rpx;
  background-color: #F4F4F4;

  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 440rpx;
    line-height: 100rpx;
    font-size: 36rpx;
    border-radius: 110rpx;
    background-color: #000000;
    opacity: 0.6;
    color: #fff;
    text-align: center;
    z-index: 2025;
  }

  .weixin-canvas {
    width: 320px;
    height: 256px;
    position: absolute;
    top: -1000000000rpx;
    left: -1000000000rpx;
  }

  .poster-canvas {
    position: absolute;
    top: -1000000000rpx;
    left: -10000000000rpx;
    width: 320px;
    height: 533px;
  }

  .posFixed {
    position: fixed;
    z-index: 1;
  }

  .box {
    margin-top: 16rpx;
    background-color: #fff;
  }

  .title {
    font-weight: bold;
  }

  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .goods-type {
    padding: 0 30rpx;
    height: 150rpx;
    background: #F72C1B;
    color: #fff;
    font-weight: bold;
    letter-spacing: 2rpx;

    .type-box {
      height: 100%;
      position: relative;
      top: -15rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        width: 200rpx;
        height: 48rpx;
        position: relative;
        top: 6rpx;
      }

      .right {
        font-size: 24rpx;
        color: #fff;
        font-weight: 400;
        text-align: right;

        .times {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .time-items {
            width: 40rpx;
            height: 40rpx;
            line-height: 40rpx;
            border-radius: 6rpx;
            text-align: center;
            color: #DB3425;
            margin: 0 10rpx;
            background-color: #fff;
            letter-spacing: 0;
          }
        }

        .txt {
          text-align: right;
          font-weight: 400;
          padding-top: 10rpx;
          line-height: 20rpx;
        }
      }
    }
  }

  .goods-info {
    border-radius: 25rpx 25rpx 0 0;
    padding: 30rpx 30rpx 20rpx;
    background-color: #fff;

    .goods-price {
      display: flex;
      align-items: center;
      font-size: 30rpx;
      margin-bottom: 16rpx;
      color: #F72C1B;

      .price {
        font-size: 50rpx;
      }

      .open-price {
        padding: 0 20rpx 0;
        background-color: #ffa500;
        color: #fff;
        border-radius: 45rpx;
        flex-shrink: 0;

        .price-txt {
          position: relative;
          top: -4rpx;
          font-size: 30rpx;
          padding-right: 12rpx;
        }

        .left-price {
          font-size: 50rpx;
        }

        .right-price {
          font-size: 30rpx;
        }
      }

      .price-tag {
        position: relative;
        border-radius: 6rpx;
        line-height: 27rpx;
        font-size: 24rpx;
        color: #F72C1B;
        border: 2rpx solid #F72C1B;
        display: flex;
        align-items: center;
        padding: 0 10rpx;
        margin: 0 0 0 30rpx;
        min-height: 50rpx;
        flex: 0;

        .sanjiao1 {
          position: absolute;
          top: 50%;
          left: -16rpx;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-right: 16rpx solid #F72C1B;
          border-top: 10rpx solid transparent;
          border-bottom: 10rpx solid transparent;
        }

        .sanjiao2 {
          position: absolute;
          top: 50%;
          left: -14rpx;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-right: 14rpx solid #fff;
          border-top: 8rpx solid transparent;
          border-bottom: 8rpx solid transparent;
        }

        .num-text {
          font-size: 26rpx;
          color: #F72C1B;
          position: relative;
          top: 2rpx;
          display: flex;
          align-items: center;

          .left-label {
            width: 110rpx;
          }
        }

        .wraps {
          flex-wrap: wrap;
        }
      }
    }

    .no-vip-txt {
      font-size: 30rpx;
      color: #F72C1B;
      margin-bottom: 16rpx;
    }

    .goods-name {
      margin-bottom: 10rpx;
      font-size: 34rpx;
      font-weight: 600;
      color: #575959;
      line-height: 46rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      word-break: break-all;
      -webkit-box-orient: vertical;
    }

    .goods-solt {
      display: flex;
      align-items: center;

      .left {
        font-size: 26rpx;
        color: #F72C1B;
      }

      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .users {
          position: relative;
          flex: 1;
          height: 50rpx;

          .posRight1 {
            right: 0;
          }

          .posRight2 {
            right: 25rpx;
          }

          .posRight3 {
            right: 50rpx;
          }

          .posRight4 {
            right: 75rpx;
          }

          .posRight5 {
            right: 100rpx;
          }

          >image {
            position: absolute;
            top: 0;
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
          }
        }

        >button {
          width: fit-content;
          display: flex;
          align-items: center;
        }

        .center {
          line-height: 40rpx;
          border-left: 2rpx dashed #575959;
          margin-left: 10rpx;
          writing-mode: vertical-lr;
          font-size: 24rpx;
          color: #F72C1B;
          padding-left: 10rpx;
        }

        .share {
          width: 50rpx;
          height: 46rpx;
        }
      }
    }

    .info {
      padding: 0 20rpx;
      font-size: 29rpx;
      line-height: 38rpx;
      background-color: #FA311C;
      color: #fff;
      border-radius: 10rpx;
    }
  }

  .unit {
    .info {
      padding-top: 16rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .avatar {
        width: 60rpx;
        height: 60rpx;
      }

      .user-info {
        display: flex;
        align-items: center;

        .user-name {
          padding-left: 6rpx;
          font-size: 29rpx;
          color: #888888;
        }
      }

      .other-user {
        display: flex;
        align-items: center;

        .avatar {
          +.avatar {
            margin-left: 6rpx;
          }
        }
      }
    }
  }

  .service {
    padding: 30rpx;
    font-size: 30rpx;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        color: #575959;
        font-weight: bold;
      }

      .right {
        color: #F72C1B;
        font-size: 26rpx;
      }
    }

    .content {
      font-size: 30rpx;
      padding-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        color: #78787A;
        display: flex;
        align-items: center;
        margin-right: 20rpx;
        overflow-x: auto;
        white-space: nowrap;
      }

      image {
        width: 12rpx;
        height: 24rpx;
      }
    }
  }

  .comparison {
    padding: 0;

    .top {
      padding: 30rpx 30rpx 20rpx;
      font-size: 30rpx;
      color: #575959;

      .txt {
        border-radius: 6rpx;
        line-height: 44rpx;
        font-size: 24rpx;
        color: #F72C1B;
        background-color: #F7E8E2;
        margin-top: 20rpx;
        padding: 0 10rpx;
      }

      .updata {
        font-size: 26rpx;
      }
    }

    image {
      width: 100%;
    }
  }

  .comments {
    padding: 30rpx;

    .flex-between {
      padding-bottom: 30rpx;
      border-bottom: 2rpx solid #F0F0F0;

      .left {
        font-size: 30rpx;
        font-weight: bold;
        color: #575959;
      }

      .more {
        font-size: 26rpx;
        color: #575959;
        display: flex;
        align-items: center;

        image {
          margin-left: 12rpx;
          width: 12rpx;
          height: 20rpx;
          flex-shrink: 0;
        }
      }
    }

    .latest {
      .items {
        padding: 26rpx 0;

        .user-info {
          padding-bottom: 26rpx;
          display: flex;
          align-items: center;
          font-size: 30rpx;

          .avatar {
            width: 60rpx;
            height: 60rpx;
            margin-right: 12rpx;
            border-radius: 50%;
          }
        }

        .content {
          font-size: 26rpx;
          letter-spacing: 2rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          word-break: break-all;
          -webkit-box-orient: vertical;
          color: #696B6B;
          line-height: 40rpx;
        }

        .imgs {
          padding-top: 20rpx;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-gap: 10rpx;

          >image {
            width: 100%;
            height: 160rpx;
          }
        }

        +.items {
          border-top: 2rpx solid #F0F0F0;
        }
      }
    }

    .none {
      padding-top: 30rpx;
      line-height: 88rpx;
      text-align: center;
      font-size: 31rpx;
      color: #555555;
    }
  }

  .mer-box {
    padding: 20rpx;

    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx 20rpx;
      border-radius: 14rpx;
      background-color: #fff;

      >image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 16rpx;
      }

      .right {
        flex: 1;
        padding-left: 20rpx;
        height: 100rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .mer-name {
            flex: 1;
            padding-right: 20rpx;
            font-size: 32rpx;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            word-break: break-all;
            -webkit-box-orient: vertical;
          }

          .mer-btn {
            width: 74rpx;
            line-height: 34rpx;
            text-align: center;
            font-size: 26rpx;
            border-radius: 8rpx;
            border: 2rpx solid #78787A;
          }
        }

        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 26rpx;
          color: #78787A;

          .mer-xingji {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }

  .detail {
    padding: 0 30rpx;
    background-color: #fff;

    .attr {
      padding: 30rpx 0;
      font-size: 30rpx;
      font-weight: bold;

      .left {
        display: flex;
        color: #575959;
        overflow: hidden;

        .titles {
          padding-right: 20rpx;
        }

        .content {
          flex: 1;
          font-weight: 400;
          white-space: nowrap;
          overflow-x: auto;
          color: #878a8a;
        }
      }

      text {
        font-size: 30rpx;
        padding-left: 80rpx;
        color: #78787A;
        font-weight: 500;
      }

      image {
        margin-left: 30rpx;
        width: 12rpx;
        height: 20rpx;
        flex-shrink: 0;
      }
    }

    .details {
      padding: 30rpx 0;
      font-size: 30rpx;
      font-weight: bold;
      border-top: 2rpx solid #f4f4f4;
      color: #575959;
    }
  }

  .parameters {
    padding: 30rpx 30rpx 10rpx;

    .items {
      display: flex;
      font-size: 30rpx;
      line-height: 50rpx;
      color: #383939;

      .label {
        width: 220rpx;
        color: #878a8a;
        flex-shrink: 0;

        text {
          padding-left: 40rpx;
        }
      }

      image {
        width: 12rpx;
        height: 20rpx;
        margin-left: 12rpx;
      }

      .value {
        // font-weight: bold;
      }
    }
  }

  .buttons {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 10rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    padding-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;

    .left {
      padding-right: 30rpx;
      display: flex;
      align-items: center;

      .items {
        text-align: center;

        image {
          width: 40rpx;
          height: 40rpx;
        }

        >view {
          font-size: 26rpx;
          color: #F72C1B;
        }

        +.items {
          margin-left: 30rpx;
        }
      }
    }

    .right {
      flex: 1;
      line-height: 84rpx;
      border-radius: 42rpx;
      font-size: 34rpx;
      text-align: center;
      color: #fff;
      background-color: #F72C1B;
    }

    .noneBtn {
      background-color: #a29c9c;
    }
  }

  .explain-html {
    padding: 20rpx;

    >view {
      border-radius: 14rpx;
      padding: 20rpx;
      background-color: #fff;
    }
  }

  .share-box {
    padding-bottom: 30rpx;
    position: relative;
    height: 100vh;
    box-sizing: border-box;

    canvas {
      width: 320px;
      height: 533px;
    }

    .poster-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;

      .canvas-box {
        position: relative;

        .poster-img {
          width: 100%;
          height: 100%;
        }

        .popup-close {
          width: 50rpx;
          height: 50rpx;
          position: absolute;
          right: 0;
          top: -80rpx;
        }
      }

      .save-btn {
        margin-top: 20rpx;
        width: 100%;
        line-height: 90rpx;
        height: 90rpx;
        text-align: center;
        font-size: 32rpx;
        color: #FFFFFF;
        border-radius: 90rpx;
        background-color: #F72C1B;
      }
    }

    .share {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
      border-radius: 40rpx;

      .box {
        flex: 1;

        .title {
          position: relative;
          font-weight: bold;
          font-size: 36rpx;
          color: #333333;
          text-align: center;
          padding: 30rpx 0;
          border-bottom: 2rpx solid #F0F0F0;
        }

        .func {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 40rpx 0;

          .items {
            text-align: center;
            font-size: 30rpx;

            image {
              width: 90rpx;
              height: 90rpx;
              margin-bottom: 10rpx;
            }
          }
        }
      }

      .close_button {
        margin: 30rpx 30rpx 0;
        height: 90rpx;
        background: #F72C1B;
        border-radius: 90rpx;
        font-weight: 500;
        font-size: 32rpx;
        color: #FFFFFF;
        text-align: center;
        line-height: 90rpx;
      }
    }
  }

  // 选择商品规格
  .goods-attr {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 40rpx;

    .goods-attr-info {
      display: flex;
      padding-bottom: 30rpx;
      border-bottom: 2rpx solid #F0F0F0;

      .goods-img {
        position: relative;
        width: 180rpx;
        height: 180rpx;
        border-radius: 16rpx;
        margin-right: 14rpx;

        >image {
          width: 100%;
          height: 100%;
        }

        .sell-out {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          line-height: 60rpx;
          width: 120rpx;
          text-align: center;
          color: #fff;
          background: #000000;
          opacity: 0.4;
          border-radius: 30rpx;
        }
      }

      .info-box {
        padding: 6rpx 0;
        flex: 1;
        padding-top: 10rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .goods-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #575959;
          line-height: 46rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          word-break: break-all;
          -webkit-box-orient: vertical;
        }

        .attr-name {
          font-size: 26rpx;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          word-break: break-all;
          -webkit-box-orient: vertical;
        }

        .attr-price-box {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .goods-price {
            font-size: 34rpx;
            color: #F72C1B;
          }

          .logotxt {
            font-size: 28rpx;
          }

          .attr-tag {
            width: fit-content;
            font-size: 26rpx;
            font-family: jdzht;
            font-weight: 400;
            background: #F7E8E2;
            color: #F72C1B;
            padding: 0 18rpx;
            border-radius: 6rpx;
            margin-left: 10rpx;
            line-height: 47rpx;
            height: 44rpx;
            display: inline-block;
          }
        }
      }
    }

    .attr-box {
      max-height: 700rpx;
      overflow: auto;

      >.attr-items {
        padding-top: 30rpx;

        .title {
          padding-top: 6rpx;
          font-size: 30rpx;
          font-weight: bold;
        }

        .item-box {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .items {
            margin-top: 20rpx;
            margin-right: 20rpx;
            padding: 0 20rpx;
            line-height: 50rpx;
            font-size: 26rpx;
            background-color: #F4F4F4;
            border-radius: 8rpx;
            border: 2rpx solid #F4F4F4;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .stock {
              color: #F4f4f4;
            }
          }

          .selector {
            color: #fff;
            border: 2rpx solid #F72C1B;
            background: #F72C1B;
          }
        }
      }
    }

    .goods-num {
      padding-top: 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        font-size: 30rpx;
        font-weight: bold;
      }

      .num-input {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 44rpx;
        text-align: center;

        .num {
          font-size: 32rpx;
          height: 60rpx;
          line-height: 60rpx;
          width: 80rpx;
          text-align: center;
          border: 2rpx solid #ffb101;
          box-sizing: border-box;
        }

        .sub,
        .add {
          width: 60rpx;
          line-height: 60rpx;
          background-color: #ffb101;
          color: #fff;
        }

        .sub {
          border-radius: 8rpx 0 0 8rpx;
        }

        .add {
          border-radius: 0 8rpx 8rpx 0;
        }
      }
    }

    .bottom {
      margin-top: 24rpx;
      height: 90rpx;
      background: #F72C1B;
      border-radius: 90rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #FFFFFF;
      text-align: center;
      line-height: 90rpx;
    }

    .noneBtn {
      background-color: #a29c9c;
    }
  }
}

.num-yesnum {
  margin-right: 10rpx;
  margin-left: 10rpx;
}
</style>
