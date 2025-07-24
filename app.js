new Vue({
  el: '#app',
  data() {
    return {
      // 奖品列表：顺序与转盘扇区一一对应
      prizeList: [
        { name: "饮料",           img: "images/boxeddrink.png"      },
        { name: "巧克力",         img: "images/chocolate.png"       },
        { name: "$5小程序优惠券", img: "images/coupon.png"          },
        { name: "免单",           img: "images/free.png"            },
        { name: "保健品",         img: "images/healthsupplements.png"},
        { name: "麦卢卡蜂蜜",     img: "images/honey.png"           },
        { name: "安佳全脂奶粉",   img: "images/milkpowder.png"      },
        { name: "牙膏",           img: "images/toothpaste.png"      }
      ],
      isSpinning: false,       // 正在旋转中
      currentRotation: 0,      // 当前旋转角度
      finalPrizeName: ''       // 最终中奖名称（可用于后续展示）
    };
  },
  methods: {
    startDraw() {
      if (this.isSpinning) return;
      this.isSpinning = true;

      const baseSpins = 4;                              // 基础整圈数
      const seg = 360 / this.prizeList.length;          // 每一项对应的角度
      const idx = Math.floor(Math.random() * this.prizeList.length); // 随机选中一个索引
      const target = idx * seg;                         // 目标扇区的起始角度

      // 累加旋转角度：4圈 + 目标扇区偏移
      this.currentRotation += baseSpins * 360 + target;

      // 等待动画结束后计算并弹出结果
      setTimeout(() => {
        this.isSpinning = false;

        // 规范化到 0–360°
        const norm = (this.currentRotation % 360 + 360) % 360;
        // 逆时针计算落到哪个扇区
        const winIndex = Math.round((360 - norm) / seg) % this.prizeList.length;
        this.finalPrizeName = this.prizeList[winIndex].name;

        alert(`恭喜获得：${this.finalPrizeName}！`);
      }, 4500); // 与 CSS 里 transition 的 4.5s 保持一致
    }
  }
});
