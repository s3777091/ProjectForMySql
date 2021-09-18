ChartUnitInStock();
// gọi function chartUnitInStock
async function ChartUnitInStock() {
  const data = await getData();
  //goi lai function getData()
  const ctx = document.getElementById("UnitInStockChart").getContext("2d");
  // tên biến id của chart là UnitInStockChart

  const myChart = new Chart(ctx, {
    type: "radar",
    // bar char
    data: {
      labels: data.XproductName,
      // data trục x cần bỏ
      datasets: [
        {
          label: "Unit iN Stock",
          data: data.YinStock,
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
  const XproductName = [];
  const YinStock = [];
  // tạo biến private
  // mở crt + F11 mở cửa sổ console sẽ thấy
  // gọi giá trị stock là cái nhập vào đẻ filter nhưng ko hiểu sao ko vào
  const response = await fetch('http://127.0.0.1:5500/data/UnitStock.json');

  // sử dụng api từ web
  const data = await response.json();
  // đọc api sử dụng await có nghĩa là function là async giống như function bth nhưng nhanh hơn
  for (let item in data) {
    //vòng lặp
    var ProductName = data[item].ProductName;
    var UnitsInStock = data[item].UnitsInStock;
    // bỏ data vào với biến productName và số lương sản phẩm
    XproductName.push(ProductName);
    YinStock.push(UnitsInStock);
    //thêm giá trị của data vào hai biến đã gọi ở trên
  }
  return { XproductName, YinStock };
}
