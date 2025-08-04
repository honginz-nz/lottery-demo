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
              { name: "巧克力奶",               img: "images/vitasoychocolate.png"      },
              { name: "菊花茶",                img: "images/vitajuhuacha.png"       },
              { name: "自制冰棒机",             img: "images/zokuquickpopmaker.png"    },
              { name: "爆米花机",               img: "images/popcornmaker.png"            },
              { name: "指甲护理套装",             img: "images/schollvelvetsmooth.png"},
              { name: "再减$10",                img: "images/10nzd.png"           },
              { name: "再减5%",                 img: "images/5off.png"      },
              { name: "全额返还",                 img: "images/free.png"      }
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
        winIdx = this.orderPrizeMap[key];  // 有白名单的订单，固定中奖
      } else {
        const pool = this.prizeList.map((_, i) => i).filter(i => i !== 7);
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
