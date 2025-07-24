new Vue({
  el: '#app',
  data() {
    return {
      orderId: '',
      prizeList: [
        { name: "饮料",           img: "images/boxeddrink.png"       },
        { name: "巧克力",         img: "images/chocolate.png"        },
        { name: "$5优惠券<br/>小程序可用", img: "images/coupon.png"         },
        { name: "免单",           img: "images/free.png"             },
        { name: "保健品",         img: "images/healthsupplements.png" },
        { name: "麦卢卡蜂蜜",     img: "images/honey.png"            },
        { name: "安佳全脂奶粉",   img: "images/milkpowder.png"       },
        { name: "牙膏",           img: "images/toothpaste.png"       }
      ],
      isSpinning: false,
      currentRotation: 0,
      // 从 order.json 里加载：
      orderPrizeMap: {},
    };
  },
  created() {
    // 启动时读取 order.json
    fetch('order.json')
      .then(r => r.json())
      .then(data => {
        this.orderPrizeMap = data.orderPrizeMap || {};
      })
      .catch(() => {
        console.warn('加载 order.json 失败，订单映射功能不可用。');
      });
  },
  methods: {
    startDraw() {
      // 1. 校验：9位数字
      if (!/^\d{9}$/.test(this.orderId)) {
        alert('订单号输入有误');
        return;
      }
      if (this.isSpinning) return;
      this.isSpinning = true;

      // 2. 决定中奖索引
      const seg = 360 / this.prizeList.length;
      let targetIndex;

      if (this.orderPrizeMap[this.orderId] != null) {
        // 映射到固定奖品
        targetIndex = this.orderPrizeMap[this.orderId];
      } else {
        // 随机，排除“免单”(索引3)
        const candidates = this.prizeList
          .map((_, i) => i)
          .filter(i => i !== 3);
        targetIndex = candidates[
          Math.floor(Math.random() * candidates.length)
        ];
      }

      // 3. 计算旋转角度
      const baseSpins = 4;
      const targetDeg  = targetIndex * seg;
      this.currentRotation += baseSpins * 360 + targetDeg;

      // 4. 动画结束后弹窗
      setTimeout(() => {
        this.isSpinning = false;

        // 规整角度
        const norm = (this.currentRotation % 360 + 360) % 360;
        const winIndex = Math.round((360 - norm) / seg) % this.prizeList.length;
        let prizeText = this.prizeList[winIndex].name;
        // 去掉 <br/>，只留纯文本
        prizeText = prizeText.replace(/<br\s*\/?>/g, ' ');
        alert(`恭喜获得：${prizeText}！`);
      }, 4500);
    }
  }
});
