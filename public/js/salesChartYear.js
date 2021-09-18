ChartUnitInStock();
// gọi function chartUnitInStock
async function ChartUnitInStock() {
  const data = await getData();
  //goi lai function getData()
  const ctx = document.getElementById("yearSales").getContext("2d");
  // tên biến id của chart là UnitInStockChart

  const myChart = new Chart(ctx, {
    type: "line",
    // bar char
    data: {
      labels: data.Xtime,
      // data trục x cần bỏ
      datasets: [
        {
          label: "Sales (VND)",
          data: data.Ysales,
          // data trục y cần bỏ
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          // bỏ màu cho nó
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          // cái này là dùng để thay đổi cấu trúc trụ Y ví dụ nó sẽ bắt đầu từ 0 or có thể thêm đơn vị cái bên cạnh số lượng sản phẩm
        },
      },
    },
  });
}

async function getData() {
  const Xtime = [];
  const Ysales = [];
  // tạo biến private
  // mở crt + F11 mở cửa sổ console sẽ thấy
  // gọi giá trị stock là cái nhập vào đẻ filter nhưng ko hiểu sao ko vào
  const response = await fetch('http://localhost:9999/admin/api/SalesYear');

  // sử dụng api từ web
  const data = await response.json();
  // đọc api sử dụng await có nghĩa là function là async giống như function bth nhưng nhanh hơn
  for (let item in data) {
    //vòng lặp
    var Time = data[item].Time;
    var Sales = data[item].Sales;
    // bỏ data vào với biến productName và số lương sản phẩm
    Xtime.push(Time);
    Ysales.push(Sales);
    //thêm giá trị của data vào hai biến đã gọi ở trên
  }
  return { Xtime, Ysales };
}
