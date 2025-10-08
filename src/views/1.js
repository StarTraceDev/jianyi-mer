import { mpQrcode } from '@/api/api.js'

/**
 * @param {*} that
 * @param {*} goodsImg 商品图
 * @param {*} goodsPrice 商品价格
 * @param {*} goodsOffers 商品优惠金额
 */
export function createShareImage(that, shareBg, goodsImg, goodsPrice, goodsOffers) {
  // console.log('goodsImg', goodsImg);
  return new Promise((resolve, reject) => {
    const shareData = {
      width: 320,	// 背景宽度
      height: 256,	// 背景高度
      goodsImg, // 商品图
      goodsImgWidth: 158,	// 商品图宽度
      goodsImgHeight: 162,	// 商品图高度
      goodsPrice,	// 商品价格
      goodsOffers,	// 优惠价格
    }

    uni.showLoading({
      title: ' '
    })
    uni.getImageInfo({
      src: shareData.goodsImg,
      success(res) {
        // 创建canvas实例
        const ctx = uni.createCanvasContext('shareCanvas', that)
        // 绘制底图
        ctx.drawImage(shareBg, 0, 0, shareData.width, shareData.height)
        // 绘制商品图
        ctx.drawImage(res.path, 24, 75, shareData.goodsImgWidth, shareData.goodsImgHeight)

        // 绘制商品价格
        ctx.setFontSize(18)
        ctx.setFillStyle('#F72C1B')
        const textMetrics = ctx.measureText(shareData.goodsPrice)
        const textWidth = textMetrics.width; // 获取文字宽度
        // 价格在 180 到 290这个距离之间居中
        ctx.fillText(shareData.goodsPrice, 180 + ((126 - textWidth) / 2), 105)
        ctx.restore()

        // 绘制商品优惠价
        ctx.setFontSize(16)
        ctx.setFillStyle('#fff')
        const offersTextMetrics = ctx.measureText(shareData.goodsOffers)
        const pffersTextWidth = offersTextMetrics.width; // 获取文字宽度
        ctx.fillText(shareData.goodsOffers, 200 + ((90 - pffersTextWidth) / 2), 174)
        ctx.restore()

        ctx.draw(false, () => {
          uni.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            fileType: 'png',
            destWidth: shareData.width * 4,
            destHeight: shareData.height * 4,
            quality: 1,
            success(shareRes) {
              resolve(shareRes.tempFilePath)
            },
            fail() {
              reject('海报生成失败')
            }
          }, that)
        }, that)
      },
      fail(err) {
        console.log(err)
        reject('商品图获取失败')
      }
    })
  })
}

// 绘制海报图片
export function createShareImg(that, imageBase, goodsImg, goodsName, goodsPrice, goodsOffers) {
  return new Promise((resolve, reject) => {
    const posterData = {
      width: 320,  // 底图宽度
      height: 533, // 底图高度
      goodsImg, // 商品图
      goodsName,  // 商品名称
      goodsPrice, // 商品开团价
      goodsOffers,  // 市场价划线价
    }
    uni.showLoading({
      title: ' '
    })
    uni.getImageInfo({
      src: posterData.goodsImg,
      success(res) {
        // 创建canvas实例
        const ctx = uni.createCanvasContext('posterCanvas', that)
        // 绘制底图
        ctx.drawImage(imageBase.posterImg, 0, 0, posterData.width, posterData.height)
        // 绘制底图的上面的文本图片
        ctx.drawImage(imageBase.topTxt, 80, 20, 160, 30)
        // 绘制底图的下面的文本图片
        ctx.drawImage(imageBase.bottomTxt, 90, 494, 140, 30)
        // 绘制白色填充图
        ctx.drawImage(imageBase.whiteImg, 20, 64, posterData.width - 40, posterData.height - 106)
        // 绘制商品图
        ctx.drawImage(res.path, 20, 64, posterData.width - 40, posterData.height - 250)
        // 绘制小程序码
        ctx.drawImage(imageBase.program, 214, 402, 76, 76)

        // 绘制商品名称
        ctx.setFontSize(16)
        ctx.setFillStyle('#333')
        drawWrapp(ctx, posterData.goodsName, 30, 372)
        ctx.restore()

        // 绘制开团价
        ctx.setFontSize(14)
        ctx.setFillStyle('#F72C1B')
        ctx.fillText('开团价:￥', 30, 433)
        ctx.setFontSize(18)
        ctx.setFillStyle('#F72C1B')
        ctx.fillText(posterData.goodsPrice, 88, 434)
        ctx.restore()

        // 绘制零售价
        ctx.setFontSize(14)
        ctx.setFillStyle('#F72C1B')
        ctx.fillText(posterData.goodsOffers, 30, 456)
        ctx.restore()

        const offersTextMetrics = ctx.measureText(posterData.goodsOffers)
        const pffersTextWidth = offersTextMetrics.width; // 获取文字宽度
        ctx.setStrokeStyle("#999"); // 设置线条颜色为黑色
        ctx.setLineWidth(1); // 设置线条宽度为2像素
        ctx.moveTo(28, 450)
        ctx.lineTo(28 + pffersTextWidth + 20, 450)
        ctx.stroke()
        ctx.restore()

        ctx.draw(false, () => {
          uni.canvasToTempFilePath({
            canvasId: 'posterCanvas',
            fileType: 'png',
            destWidth: posterData.width * 2, // 宽度乘2使图像更清楚
            destHeight: posterData.height * 2, // 宽度乘2使图像更清楚
            quality: 1,
            success(shareRes) {
              resolve(shareRes.tempFilePath)
            },
            fail(err) {
              reject('海报生成失败')
            }
          }, that)
        }, that)
      },
      fail() {
        reject('图片获取失败')
      }
    })
  })
}

// 绘制海报比价图片
export function createSecondShareImg(that, imageBase, goodsImg, goodsName, goodsPrice, goodsOffers) {
  return new Promise((resolve, reject) => {
    const posterData = {
      width: 320,  // 底图宽度
      height: 400, // 底图高度
      goodsImg, // 商品图
      // goodsName,  // 商品名称
      // goodsPrice, // 商品开团价
      // goodsOffers,  // 市场价划线价
    }
    uni.showLoading({
      title: ' '
    })
    uni.getImageInfo({
      src: posterData.goodsImg,
      success(res) {
        // 创建canvas实例
        const ctx = uni.createCanvasContext('posterCanvas', that)
        // 边框
        // ctx.setStrokeStyle('red');  // 红色边框
        // ctx.setLineWidth(4);  // 中粗
        // ctx.setLineCap('round');  // 端点圆润
        // ctx.setLineJoin('round');  // 拐角圆滑
        // ctx.strokeRect(0, 0, posterData.width + 10, posterData.height + 10) // x,y,宽度,高度

        // 绘制底图
        ctx.drawImage(imageBase.whiteImg2, 0, 0, 320, 330)
        // ctx.setFillStyle('#FFFFFF')
        // ctx.fillRect(0, 0, posterData.width, posterData.height)
        // drawTopRoundedRect(ctx, 0, 0, posterData.width,  posterData.height,  10);
        // 绘制底图的上店铺logo
        ctx.drawImage(imageBase.storeLogo, 13, 20, 50, 57)
        // 绘制商品图片
        ctx.drawImage(res.path, 13, 95, 90, 100)
        // 绘制小程序码
        ctx.drawImage(imageBase.program, 187, 200, 76, 76)
        // 绘制底图比价图
        ctx.drawImage(imageBase.comparePrices, 0, 210, 320, 250) // x,y,宽度,高度

        // 绘制店铺名称
        ctx.setFontSize(16)
        ctx.setFillStyle('#333')
        drawWrapp(ctx, imageBase.storeName, 75, 30)
        ctx.restore()

        // 绘制红色五角星
        drawSolidStar(ctx, 83, 50, 8);
        drawSolidStar(ctx, 103, 50, 8);
        drawSolidStar(ctx, 123, 50, 8);
        drawSolidStar(ctx, 143, 50, 8);
        drawSolidStar(ctx, 163, 50, 8);



        // 绘制商品名称
        // ctx.font = 'bold 16rpx sans-serif';
        // ctx.setFontSize(16)
        // ctx.setFillStyle('#333')
        // drawWrapp(ctx, imageBase.tradeName, 110, 95)
        // ctx.restore()

        // 绘制市场成交价
        ctx.font = 'normal 13rpx sans-serif';
        ctx.setFontSize(13)
        ctx.setFillStyle('#000000')
        ctx.fillText('市场成交价:', 110, 160)
        ctx.setFontSize(12)
        ctx.setFillStyle('#000000')
        ctx.fillText(imageBase.originalCost, 187, 160)
        ctx.restore()

        // 绘制单位团购价
        ctx.font = 'normal 13rpx sans-serif';
        ctx.setFontSize(13)
        ctx.setFillStyle('#000000')
        ctx.fillText('单位团购价:', 110, 185)
        ctx.setFontSize(12)
        ctx.setFillStyle('#000000')
        ctx.fillText(imageBase.discount, 187, 185)
        ctx.restore()

        // 绘制底图的下面的文本图片
        // ctx.drawImage(imageBase.bottomTxt, 90, 494, 140, 30)

        // 绘制白色填充图
        // ctx.drawImage(imageBase.whiteImg, 20, 64, posterData.width - 40, posterData.height - 106)

        // 绘制商品图
        // ctx.drawImage(res.path, 20, 64, posterData.width - 40, posterData.height - 250)

        // 绘制开团价
        // ctx.setFontSize(14)
        // ctx.setFillStyle('#F72C1B')
        // ctx.fillText('开团价:￥', 30, 433)
        // ctx.setFontSize(18)
        // ctx.setFillStyle('#F72C1B')
        // ctx.fillText(imageBase.discount, 88, 434)
        // ctx.restore()

        // 绘制零售价
        // ctx.setFontSize(14)
        // ctx.setFillStyle('#F72C1B')
        // ctx.fillText(imageBase.originalCost, 30, 456)
        // ctx.restore()

        // const offersTextMetrics = ctx.measureText(posterData.goodsOffers)
        // const pffersTextWidth = offersTextMetrics.width; // 获取文字宽度
        // ctx.setStrokeStyle("#999"); // 设置线条颜色为黑色
        // ctx.setLineWidth(1); // 设置线条宽度为2像素
        // ctx.moveTo(28, 450)
        // ctx.lineTo(28 + pffersTextWidth + 20, 450)
        // ctx.stroke()
        // ctx.restore()

        ctx.draw(false, () => {
          uni.canvasToTempFilePath({
            canvasId: 'posterCanvas',
            fileType: 'png',
            destWidth: posterData.width * 2, // 宽度乘2使图像更清楚
            destHeight: posterData.height * 2, // 宽度乘2使图像更清楚
            quality: 1,
            success(shareRes) {
              resolve(shareRes.tempFilePath)
            },
            fail(err) {
              reject('海报生成失败')
            }
          }, that)
        }, that)
      },
      fail() {
        reject('图片获取失败')
      }
    })
  })
}

/**
 * 绘制红色实心五角星
 * @param {Object} ctx - uni.createCanvasContext 返回的上下文对象
 * @param {number} x - 五角星中心点X坐标
 * @param {number} y - 五角星中心点Y坐标
 * @param {number} R - 外圆半径（控制大小）
 * @param {string} [color='red'] - 填充颜色
 */
export function drawSolidStar(ctx, x, y, R, color = 'red') {
  const r = R * 0.4; // 内圆半径（固定比例，控制尖锐度）
  ctx.beginPath();

  // 计算十个顶点坐标（内外圆交替）
  for (let i = 0; i < 5; i++) {
    // 外圆顶点（大角）
    const outerAngle = (18 + i * 72) * Math.PI / 180;
    const outerX = x + R * Math.cos(outerAngle);
    const outerY = y - R * Math.sin(outerAngle);  // Y轴取反（Canvas坐标系向下）
    ctx.lineTo(outerX, outerY);

    // 内圆顶点（小角）
    const innerAngle = (54 + i * 72) * Math.PI / 180;
    const innerX = x + r * Math.cos(innerAngle);
    const innerY = y - r * Math.sin(innerAngle);
    ctx.lineTo(innerX, innerY);
  }

  ctx.closePath();
  ctx.setFillStyle(color);
  ctx.fill();  // 实心填充
}

/**
 * 绘制上圆角+下直角的矩形
 * @param {Object} ctx - Canvas上下文对象
 * @param {number} x - 矩形左上角X坐标
 * @param {number} y - 矩形左上角Y坐标
 * @param {number} width - 矩形宽度
 * @param {number} height - 矩形高度
 * @param {number} radius - 上角圆角半径
 * @param {string} color - 填充颜色
 */
function drawTopRoundedRect(ctx, x, y, width, height, radius, color = '#FFFFFF') {
  ctx.beginPath();
  // 左上角圆角（顺时针绘制）
  ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
  // 上边直线
  ctx.lineTo(x + width - radius, y);
  // 右上角圆角
  ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, 0);
  // 右边直线（直角）
  ctx.lineTo(x + width, y + height);
  // 底边直线（直角）
  ctx.lineTo(x, y + height);
  // 左边直线（直角）
  ctx.lineTo(x, y + radius); // 连接到左上角起点
  ctx.closePath();
  ctx.setFillStyle(color);
  ctx.fill();
  ctx.clip();  // 关键！裁剪后续内容
}

// 使用示例
const ctx = uni.createCanvasContext('myCanvas');
drawTopRoundedRect(ctx, 0, 0, 300, 500, 15, '#FFFFFF');
ctx.draw();

function drawWrapp(ctx, text, x, y, lineHeight = 18) {
  const maxWidth = 246	// 最大宽度
  const textWidth = 16	// 文字宽度
  const symbolWidth = 8	// 符号宽度
  const textArr = text.split('')
  let width = 0
  const lines = []
  let line = ''

  // 将内容切割成多个数组
  textArr.forEach((item, index) => {
    // 如果宽度大于最大宽度时，一行结束
    if (width >= maxWidth) {
      lines.push(line)
      line = ''
      width = 0
    }

    const textWidth = ctx.measureText(item)
    width += textWidth.width
    // const reg = /[\u4E00-\u9FA5]+/g	// 是否为汉字
    // 如果是文汉字的话
    // if(reg.test(item)) {
    //   width += textWidth
    // }else {
    //   width += symbolWidth
    // }
    line += item
  })

  if (lines[lines.length - 1] != line) {
    lines.push(line)
  }

  // 如果超出了两行那么在第二行最后添加...
  if (lines.length > 2) {
    lines[1] = lines[1].slice(0, -2) + '...'
  }
  for (let i = 0; i < lines.length && i < 2; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight)
  }
}

export function createCopyShareImage(vm, bgImg, items, currentTab) {
  return new Promise(async (resolve, reject) => {
    const canvasWidth = 320; // 画布宽度（单位：rpx）
    const canvasHeight = 256; // 画布高度

    // 2. 加载所有图片
    const loadImages = items.map(item => {
      return new Promise((resolve) => {
        uni.getImageInfo({
          src: item.image,
          success: (res) => resolve(res.path),
          fail: () => resolve(null)
        });
      });
    });

    const loadedImages = await Promise.all(loadImages);
    // 在绘制循环开始添加
    // console.log('所有加载的图片:', loadedImages);

    // 创建画布上下文
    const ctx = uni.createCanvasContext('shareCanvas', vm);

    // 1. 绘制背景图
    ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);

    // 2. 计算布局参数
    const padding = 12; // 内边距
    const itemWidth = (canvasWidth - padding * 3) / 2; // 每个商品的宽度
    const itemHeight = (canvasHeight - padding * 3) / 2; // 每个商品的高度
    // 圆角矩形绘制函数
    function drawRoundRect(x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius); // 圆角
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // 圆角
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius); // 圆角
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius); // 圆角
      ctx.closePath();
    }

    // 文字省略号处理函数
    function getEllipsisText(ctx, text, maxWidth) {
      const ellipsis = '...';
      const ellipsisWidth = ctx.measureText(ellipsis).width;

      if (ctx.measureText(text).width <= maxWidth) {
        return text;
      }

      let left = 0;
      let right = text.length;
      let mid = Math.floor((left + right) / 2);
      let result = text;

      while (left <= right) {
        const currentText = text.substring(0, mid);
        const currentWidth = ctx.measureText(currentText).width;

        if (currentWidth + ellipsisWidth <= maxWidth) {
          result = currentText + ellipsis;
          left = mid + 1;
        } else {
          right = mid - 1;
        }

        mid = Math.floor((left + right) / 2);
      }

      return result;
    }
    const kuang = [
      { x: 100, y: 94 },
      { x: 205, y: 94 },
      { x: 100, y: 197 },
      { x: 205, y: 197 },
    ]
    // 3. 遍历商品列表，绘制每个商品
    items.forEach((item, index) => {
      //  console.log(`商品${index}图片路径:`, item.image);
      //  const imgPath = loadedImages[index];
      //   if (!imgPath) return;
      const imgPath = loadedImages[index];

      if (!imgPath) {
        // console.error(`商品${index}图片加载失败，跳过绘制`, item.image);
        return;
      }

      const row = Math.floor(index / 2); // 行号（0或1）
      const col = index % 2;             // 列号（0或1）

      // 计算当前商品的位置
      const x = padding + col * (itemWidth + padding);
      const y = padding + row * (itemHeight + padding);

      // 绘制商品图片
      const imgWidth = 96;
      const imgHeight = 96;

      const imgOffset = {
        top: 0,    // 上移为负值，下移为正值
        left: 0    // 左移为负值，右移为正值
      };

      // 根据商品索引设置不同的偏移量
      switch (index) {
        case 0: // 第一个商品（向下移动30px）
          imgOffset.top = 15;  // 正值表示下移
          imgOffset.left = 56;
          break;
        case 1: // 第二个商品
          imgOffset.top = 15; // 上移25px
          imgOffset.left = 8; // 右移20px
          break;
        case 2: // 第三个商品
          imgOffset.top = -1;   // 轻微下移3px
          imgOffset.left = 60;
          break;
        case 3: // 第四个商品
          imgOffset.top = -1;
          imgOffset.left = 10; // 左移5px
          break;
      }
      // 计算图片最终位置（原居中位置+偏移量）
      const imgX = x + (itemWidth - imgWidth) / 2 + imgOffset.left;
      const imgY = y + imgOffset.top;

      //  console.log(`商品${index}图片位置:`, imgX, imgY);

      // 在绘制商品图片前添加调试矩形
      // ctx.setStrokeStyle('#00ff00'); // 绿色边框
      // ctx.strokeRect(imgX, y, imgWidth, imgHeight); // 标记商品图片区域

      // 绘制商品图片
      ctx.drawImage(imgPath, imgX, imgY, imgWidth, imgHeight);

      // 价格样式
      ctx.setFontSize(14);
      ctx.font = 'bold 17px sans-serif';
      const priceText = `￥${currentTab == 0 ? item.seckillPrice : item.price}`;

      const textWidth = ctx.measureText(priceText).width;
      const textHeight = 17; // 文字高度近似值
      ctx.setTextBaseline('middle'); // 垂直居中基准线

      // 价格背景矩形参数
      const bgPadding = 4; // 背景内边距
      const bgWidth = 80;

      // const bgHeight = textHeight + bgPadding * 2-6;
      const bgHeight = 25;
      const bgRadius = 11; // 圆角半径
      const maxTextWidth = 25 //最大允许宽度
      // const maxTextWidth = bgWidth - bgPadding * 2; // 最大文字宽度
      // console.log(`maxTextWidth:${maxTextWidth}`,maxTextWidth);

      // 处理文字省略
      function getEllipsisText(ctx, text, maxWidth) {
        const ellipsis = '...';
        const ellipsisWidth = ctx.measureText(ellipsis).width;

        if (ctx.measureText(text).width <= maxWidth) {
          return text; // 不需要省略
        }

        let left = 0;
        let right = text.length;
        let mid = Math.floor((left + right) / 2);
        let result = text;

        while (left <= right) {
          const currentText = text.substring(0, mid);
          const currentWidth = ctx.measureText(currentText).width;

          if (currentWidth + ellipsisWidth <= maxWidth) {
            result = currentText + ellipsis;
            left = mid + 1;
          } else {
            right = mid - 1;
          }

          mid = Math.floor((left + right) / 2);
        }

        return result;
      }
      // 处理文字省略
      const displayText = getEllipsisText(ctx, priceText, maxTextWidth);
      // console.log(`商品${index}价格:`, displayText);
      // 5. 计算文字绘制位置（居中）
      const textX = (32 - textWidth + 30) / 2;
      const textY = (textHeight + bgPadding * 2 - 30) / 2; // 垂直居中
      // 计算价格位置
      let priceX = x + (itemWidth - textWidth) / 2;
      let priceY = y + imgHeight + 15;

      switch (index) {
        case 0:
          priceX += 51;
          priceY -= 13;
          break;
        case 1:
          priceX -= 17;
          priceY -= 13;
          priceX += 14;
          break;
        case 2:
          priceX += 51;//da
          priceY -= 32;//xiao
          break;
        case 3:
          priceX += 2;
          priceY -= 32;
          // priceY += 5;
          break;
      }

      ctx.setFillStyle('rgba(0, 0, 0, 0.5)'); // 70% 不透明度
      // ctx.setFillStyle('#ff302e');
      drawRoundRect(
        kuang[index].x,
        kuang[index].y,
        bgWidth,
        bgHeight,
        bgRadius
      );
      ctx.fill();
      // 绘制价格文本
      // ctx.setFillStyle('#ff302e');
      ctx.setFillStyle('#fff');
      // 9. 绘制文字（相对于背景定位）
      const offersTextMetrics = ctx.measureText(priceText)
      const pffersTextWidth = offersTextMetrics.width; // 获取文字宽度
      ctx.fillText(priceText, kuang[index].x + ((75 - pffersTextWidth) / 2), priceY + textY)
      // ctx.fillText(priceText, priceX+textX, priceY+ textY);
    });

    ctx.draw(false, () => {
      // console.log('绘制完成回调触发'); // 确认是否执行
      uni.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        quality: 1,
        success: (res) => {
          // console.log('生成图片成功:', res); // 检查生成的临时路径
          resolve(res.tempFilePath);
        },
        fail: (err) => {
          // console.error('生成图片失败:', err); // 获取详细错误
          reject('生成图片失败: ' + JSON.stringify(err));
        }
      }, vm);
    });
  });
}
