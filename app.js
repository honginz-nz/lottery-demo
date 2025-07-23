new Vue({
  el: "#app",
  data() {
    return {
      prizeList: [
        {
          name: "專屬優惠",
          img: "https://cdn-icons-png.flaticon.com/512/1405/1405225.png"
        },
        {
          name: "變形金剛",
          img: "https://cdn-icons-png.flaticon.com/512/7926/7926936.png"
        },
        {
          name: "貝斯特鑄鐵鍋<br/>三件組",
          img: "https://cdn-icons-png.flaticon.com/512/3063/3063504.png"
        },
        {
          name: "麗克特<br/>格子吐司機",
          img: "https://cdn-icons-png.flaticon.com/512/4353/4353006.png"
        },
        {
          name: "折價券",
          img: "https://cdn-icons-png.flaticon.com/512/612/612885.png"
        },
        {
          name: "佩佩豬<br/>紅包袋",
          img: "https://cdn-icons-png.flaticon.com/512/677/677721.png"
        },
        {
          name: "迪士尼<br/>彩色隨手瓶",
          img: "https://cdn-icons-png.flaticon.com/512/4982/4982355.png"
        },
        {
          name: "美國濕式熟成<br/>牛排(五入組)",
          img: "https://cdn-icons-png.flaticon.com/512/5854/5854248.png"
        }
      ],
      isSpinning: false,
      currentRotation: 0,
      finalPrizeName: ""
    };
  },
  methods: {
    startDraw() {
      if (this.isSpinning) return;

      this.isSpinning = true;
      const baseSpins = 4;
      const degreePerPrize = 360 / this.prizeList.length;

      const selectedIndex = Math.floor(Math.random() * this.prizeList.length);
      const targetDegree = selectedIndex * degreePerPrize;

      // 總旋轉角度（累加）
      this.currentRotation += baseSpins * 360 + targetDegree;

      // 等待動畫完成
      setTimeout(() => {
        this.isSpinning = false;

        const normalizedDegree = ((this.currentRotation % 360) + 360) % 360;
        const index =
          Math.round((360 - normalizedDegree) / degreePerPrize) %
          this.prizeList.length;

        const prizeHtml = this.prizeList[index].name.replace(/<br\/?>/g, "");
        this.finalPrizeName = prizeHtml;

        alert(`恭喜獲得：${prizeHtml}!!`);
      }, 4500); // 需與 transition 秒數一致
    }
  }
});
