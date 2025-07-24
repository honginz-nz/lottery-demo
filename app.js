new Vue({
  el: '#app',
  data() {
    return {
      orderInput: '',       // 用户输入的订单号
      prizeList: [],        // 奖品列表
      orderPrizeMap: {},    // 订单号 → 奖品索引 映射
      isSpinning: false,
      currentRotation: 0,
      finalPrizeName: ''
    };
  },
  created() {
    fetch('orders.json')
      .then(r => r.json())
      .then(data => {
        this.orderPrizeMap = data.orderPrizeMap || {};
        // 如果你把 prizeList 也放到 JSON 里，可以这样加载；否则这里 fallback 硬编码
        if (Array.isArray(data.prizeList)) {
          this.prizeList = data.prizeList;
        } else {
          this.prizeList = [
            { name: "饮料",             img: "images/boxeddrink.png"      },
            { name: "巧克力",           img: "images/chocolate.png"       },
            { name: "$5优惠券<br/>小程序可用", img: "images/coupon.png"    },
            { name: "免单",             img: "images/free.png"            },
            { name: "保健品",           img: "images/healthsupplements.png"},
            { name: "麦卢卡蜂蜜",       img: "images/honey.png"           },
            { name: "安佳全脂奶粉",     img: "images/milkpowder.png"      },
            { name: "牙膏",             img: "images/toothpaste.png"      }
          ];
        }
      })
      .catch(console.error);
  },
  methods: {
    startDraw() {
      if (this.isSpinning) return;
      this.isSpinning = true;

      const seg = 360 / this.prizeList.length;
      let winIdx;

      // 1) 指定订单号则映射，否则随机（排除“免单”，索引假设为 3）
      const key = this.orderInput.trim();
      if (key && this.orderPrizeMap[key] != null) {
        winIdx = this.orderPrizeMap[key];
      } else {
        const exclude = 3;
        const pool = this.prizeList.map((_, i) => i).filter(i => i !== exclude);
        winIdx = pool[Math.floor(Math.random() * pool.length)];
      }

      // 2) 计算旋转差值：保持累加 fullSpin（4 圈），再加上让当前角度对齐目标的 delta
      const fullSpin = 4 * 360;  // 4 圈
      const prevMod   = ((this.currentRotation % 360) + 360) % 360;
      const targetOff = (360 - winIdx * seg) % 360;
      const delta     = (targetOff - prevMod + 360) % 360;

      this.currentRotation += fullSpin + delta;

      // 3) 动画结束后弹窗
      setTimeout(() => {
        this.isSpinning     = false;
        this.finalPrizeName = this.prizeList[winIdx].name;
        alert(`恭喜获得：${this.finalPrizeName}！`);
      }, 4500); // 要与 CSS transition 时间一致
    }
  }
});
