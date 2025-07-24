new Vue({
  el: '#app',
  data() {
    return {
      prizeList: [
        { name: "饮料",                img: "images/boxeddrink.png"       },
        { name: "巧克力",              img: "images/chocolate.png"        },
        { name: "$5优惠券<br/>小程序可用", img: "images/coupon.png"           },
        { name: "免单",                img: "images/free.png"             },
        { name: "保健品",              img: "images/healthsupplements.png" },
        { name: "麦卢卡蜂蜜",          img: "images/honey.png"            },
        { name: "安佳全脂奶粉",        img: "images/milkpowder.png"       },
        { name: "牙膏",                img: "images/toothpaste.png"       }
      ],
      orderNumber: '',        // 用户输入的订单号
      orderPrizeMap: {},      // 从 orders.json 读取的映射
      isSpinning: false,
      currentRotation: 0,
      finalPrizeName: ''
    };
  },
  created() {
    // 加载订单映射
    fetch('orders.json')
      .then(res => res.json())
      .then(data => {
        // 如果你的 JSON 结构是 { "orderPrizeMap": { ... } }
        this.orderPrizeMap = data.orderPrizeMap || {};
      })
      .catch(console.error);
  },
  methods: {
    startDraw() {
      if (this.isSpinning) return;
      this.isSpinning = true;

      const seg        = 360 / this.prizeList.length;
      let   idx;

      const key = this.orderNumber.trim();
      // 如果映射里存在，必中对应奖项
      if (key && this.orderPrizeMap[key] !== undefined) {
        idx = this.orderPrizeMap[key];
      } else {
        // 否则随机（排除“免单”index=3）
        const allowed = this.prizeList.map((_, i) => i).filter(i => i !== 3);
        idx = allowed[Math.floor(Math.random() * allowed.length)];
      }

      // 旋转角度
      this.currentRotation += 4 * 360 + idx * seg;

      // 动画结束后弹窗
      setTimeout(() => {
        this.isSpinning = false;
        // 计算落在哪个扇区
        const norm     = (this.currentRotation % 360 + 360) % 360;
        const winIndex = Math.round((360 - norm) / seg) % this.prizeList.length;
        this.finalPrizeName = this.prizeList[winIndex].name.replace(/<br\/?>/g, ' ');
        alert(`恭喜获得：${this.finalPrizeName}！`);
      }, 4500);
    }
  }
});
