new Vue({
  el: '#app',
  data() {
    return {
      prizeList: [
        { name: "专属优惠", img: "https://cdn-icons-png.flaticon.com/512/1405/1405225.png" },
        { name: "变形金刚", img: "https://cdn-icons-png.flaticon.com/512/7926/7926936.png" },
        { name: "贝斯特铸铁锅\n三件套", img: "https://cdn-icons-png.flaticon.com/512/3063/3063504.png" },
        { name: "利仁格子吐司机", img: "https://cdn-icons-png.flaticon.com/512/4353/4353006.png" },
        { name: "折价券", img: "https://cdn-icons-png.flaticon.com/512/612/612885.png" },
        { name: "佩佩猪红包袋", img: "https://cdn-icons-png.flaticon.com/512/677/677721.png" },
        { name: "迪士尼彩色随手瓶", img: "https://cdn-icons-png.flaticon.com/512/4982/4982355.png" },
        { name: "美国湿式熟成牛排（五人份）", img: "https://cdn-icons-png.flaticon.com/512/5854/5854248.png" }
      ],
      isSpinning: false,
      currentRotation: 0,
      finalPrizeName: ''
    };
  },
  methods: {
    startDraw() {
      if (this.isSpinning) return;

      this.isSpinning = true;
      const baseSpins = 4;
      const seg = 360 / this.prizeList.length;

      // 随机或指定
      const idx = Math.floor(Math.random() * this.prizeList.length);
      const target = idx * seg;
      this.currentRotation += baseSpins * 360 + target;

      // 等转完
      setTimeout(() => {
        this.isSpinning = false;
        const norm = (this.currentRotation % 360 + 360) % 360;
        const winIndex = Math.round((360 - norm) / seg) % this.prizeList.length;
        this.finalPrizeName = this.prizeList[winIndex].name;
        alert(`恭喜获得：${this.finalPrizeName}！`);
      }, 4500);
    }
  }
});
