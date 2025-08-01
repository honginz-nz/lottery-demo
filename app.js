new Vue({
  el: '#app',
  data() {
    return {
      orderInput: '',
      prizeList: [],
      orderPrizeMap: {},
      isSpinning: false,
      currentRotation: 0,
      finalPrizeName: '',
      messages: []    // 新增：存放播报信息
    };
  },
  created() {
    fetch('orders.json')
      .then(r => r.json())
      .then(data => {
        this.orderPrizeMap = data.orderPrizeMap || {};
        this.prizeList = Array.isArray(data.prizeList)
          ? data.prizeList
          : [
              { name: "饮料",               img: "images/boxeddrink.png"      },
              { name: "巧克力",             img: "images/chocolate.png"       },
              { name: "$5优惠券<br/>小程序可用", img: "images/coupon.png"    },
              { name: "免单",               img: "images/free.png"            },
              { name: "保健品",             img: "images/healthsupplements.png"},
              { name: "麦卢卡蜂蜜",         img: "images/honey.png"           },
              { name: "安佳全脂奶粉",       img: "images/milkpowder.png"      },
              { name: "牙膏",               img: "images/toothpaste.png"      }
            ];
      })
      .catch(console.error);
  },
  methods: {
    startDraw() {
      if (!this.orderInput || this.isSpinning) return;

      const key = this.orderInput.trim();
      if (!/^\d{9}$/.test(key)) {
        alert('订单号输入有误');
        return;
      }

      this.isSpinning = true;
      const seg      = 360 / this.prizeList.length;
      const fullSpin = 4 * 360;
      const prevMod  = ((this.currentRotation % 360) + 360) % 360;

      let winIdx;
      if (this.orderPrizeMap[key] != null) {
        winIdx = this.orderPrizeMap[key];
      } else {
        const pool = this.prizeList.map((_, i) => i).filter(i => i !== 3);
        winIdx = pool[Math.floor(Math.random() * pool.length)];
      }

      const targetOff = (360 - winIdx * seg) % 360;
      const delta     = (targetOff - prevMod + 360) % 360;
      this.currentRotation += fullSpin + delta;

      setTimeout(() => {
        this.isSpinning     = false;
        this.finalPrizeName = this.prizeList[winIdx].name;
        const text = this.finalPrizeName.replace(/<[^>]+>/g, '');
        alert(`恭喜获得：${text}！`);

        // 播报信息插入到最前面
        this.messages.unshift(`恭喜 订单号：${key} 获得奖品${text}！`);
      }, 4500);
    }
  }
});
