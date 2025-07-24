new Vue({
  el: '#app',
  data() {
    return {
      prizeList: [
        { name: "饮料",                  img: "images/boxeddrink.png"       },
        { name: "巧克力",                img: "images/chocolate.png"        },
        { name: "$5优惠券<br/>小程序可用",  img: "images/coupon.png"           },
        { name: "免单",                  img: "images/free.png"             },
        { name: "保健品",                img: "images/healthsupplements.png" },
        { name: "麦卢卡蜂蜜",            img: "images/honey.png"            },
        { name: "安佳全脂奶粉",          img: "images/milkpowder.png"       },
        { name: "牙膏",                  img: "images/toothpaste.png"       }
      ],
      orderNumber: '',        // 用户输入的订单号
      orderPrizeMap: {},      // 从 orders.json 读取的映射
      isSpinning: false,
      currentRotation: 0,
      finalPrizeName: ''
    };
  },
  created() {
    fetch('orders.json')
      .then(res => res.json())
      .then(data => {
        // 支持两种 JSON 结构：{ orderPrizeMap: {...} } 或者 顶层就是映射对象
        this.orderPrizeMap = data.orderPrizeMap || data;
      })
      .catch(console.error);
  },
  methods: {
    startDraw() {
      if (this.isSpinning) return;
      this.isSpinning = true;

      const seg = 360 / this.prizeList.length;
      let idx;

      // 用大写匹配映射
      const key = this.orderNumber.trim().toUpperCase();
      if (key && this.orderPrizeMap[key] !== undefined) {
        idx = this.orderPrizeMap[key];
      } else {
        // 排除“免单” (index = 3)，其余随机
        const allowed = this.prizeList.map((_, i) => i).filter(i => i !== 3);
        idx = allowed[Math.floor(Math.random() * allowed.length)];
      }

      // 累加旋转
      this.currentRotation += 4 * 360 + idx * seg;

      setTimeout(() => {
        this.isSpinning = false;
        const norm     = (this.currentRotation % 360 + 360) % 360;
        const winIndex = Math.round((360 - norm) / seg) % this.prizeList.length;
        this.finalPrizeName = this.prizeList[winIndex].name.replace(/<br\/?>/g, ' ');
        alert(`恭喜获得：${this.finalPrizeName}！`);
      }, 4500);
    }
  }
});
