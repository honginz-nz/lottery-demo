new Vue({
  el: '#app',
  data() {
    return {
      orderInput: '',            // 用户输入的订单号
      prizeList: [],             // 奖品列表
      orderPrizeMap: {},         // 订单→奖品索引 映射
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
        if (Array.isArray(data.prizeList)) {
          this.prizeList = data.prizeList;
        } else {
          // 回退到硬编码列表
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

      const key = this.orderInput.trim();
      if (key && this.orderPrizeMap[key] != null) {
        // 如果输入匹配 JSON 中指定订单 → 定中奖品索引
        winIdx = this.orderPrizeMap[key];
      } else {
        // 随机抽（排除“免单”，假设其索引是 3）
        const exclude = 3;
        const pool = this.prizeList.map((_,i) => i).filter(i => i !== exclude);
        winIdx = pool[Math.floor(Math.random() * pool.length)];
      }

      // 计算旋转角度：4 圈 + 让第 winIdx 扇区对准顶部指针
      const baseSpins    = 4 * 360;
      // 核心修正：用 360 - winIdx*seg 使其停在正确位置
      const targetOffset = (360 - winIdx * seg) % 360;
      this.currentRotation += baseSpins + targetOffset;

      // 动画结束后弹窗
      setTimeout(() => {
        this.isSpinning      = false;
        this.finalPrizeName  = this.prizeList[winIdx].name;
        alert(`恭喜获得：${this.finalPrizeName}！`);
      }, 4500);
    }
  }
});
