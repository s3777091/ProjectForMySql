ChartUnitInStock();
// gọi function chartUnitInStock
async function ChartUnitInStock() {
  const data = await getData();
  //goi lai function getData()
  const ctx = document.getElementById("manufrac").getContext("2d");
  // tên biến id của chart là UnitInStockChart

  const myChart = new Chart(ctx, {
    type: "doughnut",
    // bar char
    data: {
      labels: data.Xtime,
      // data trục x cần bỏ
      datasets: [
        {
          label: "ManuFactory Year For Products",
          data: data.Yquantity,
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

async function getData() {
  const Xtime = [];
  const Yquantity = [];
  // tạo biến private
  // mở crt + F11 mở cửa sổ console sẽ thấy
  // gọi giá trị stock là cái nhập vào đẻ filter nhưng ko hiểu sao ko vào
  const response = await fetch("http://localhost:9999/admin/api/manuyear");

  // sử dụng api từ web
  const data = await response.json();
  // đọc api sử dụng await có nghĩa là function là async giống như function bth nhưng nhanh hơn
  for (let item in data) {
    //vòng lặp
    var Time = data[item].ManufactureYear;
    var Quantity = data[item].Quantity;
    // bỏ data vào với biến productName và số lương sản phẩm
    Xtime.push(Time);
    Yquantity.push(Quantity);
    //thêm giá trị của data vào hai biến đã gọi ở trên
  }
  return { Xtime, Yquantity };
}
