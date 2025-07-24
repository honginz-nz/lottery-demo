new Vue({
  el: '#app',
  data() {
    return {
      orderInput: '',
      isSpinning: false,
      currentRotation: 0,
      prizeList: [
        { name: "饮料",           img: "images/boxeddrink.png"      },
        { name: "巧克力",         img: "images/chocolate.png"       },
        { name: "$5优惠券<br/>小程序可用", img: "images/coupon.png"          },
        { name: "免单",           img: "images/free.png"            },
        { name: "保健品",         img: "images/healthsupplements.png"},
        { name: "麦卢卡蜂蜜",     img: "images/honey.png"           },
        { name: "安佳全脂奶粉",   img: "images/milkpowder.png"      },
        { name: "牙膏",           img: "images/toothpaste.png"      }
      ],
      orderPrizeMap: {
        "ORDER10001": 2,
        "ORDER10002": 5
      }
    };
  },
  methods: {
    startDraw() {
      // 先校验 9 位数字
      if (!/^\d{9}$/.test(this.orderInput)) {
        alert("订单号输入有误");
        return;
      }

      if (this.isSpinning) return;
      this.isSpinning = true;

      const baseSpins = 4;
      const seg       = 360 / this.prizeList.length;
      let idx;

      // 如果在 map 里，取指定索引；否则随机（排除“免单”索引 3）
      if (this.orderPrizeMap[this.orderInput] !== undefined) {
        idx = this.orderPrizeMap[this.orderInput];
      } else {
        const choices = this.prizeList
          .map((_, i) => i)
          .filter(i => i !== 3);
        idx = choices[Math.floor(Math.random() * choices.length)];
      }

      const target = idx * seg;
      this.currentRotation += baseSpins * 360 + target;

      setTimeout(() => {
        this.isSpinning = false;
        const norm = (this.currentRotation % 360 + 360) % 360;
        const winIndex = Math.round((360 - norm) / seg) % this.prizeList.length;
        const name = this.prizeList[winIndex].name.replace(/<br\/?>/g, '');
        alert(`恭喜获得：${name}！`);
      }, 4500);
    }
  }
});
