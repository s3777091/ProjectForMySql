ChartUnitInStock();
// gọi function chartUnitInStock
async function ChartUnitInStock() {
  const data = await getData();
  //goi lai function getData()
  const ctx = document.getElementById("UnitStock").getContext("2d");
  // tên biến id của chart là UnitInStockChart

  const myChart = new Chart(ctx, {
    type: "bar",
    // bar char
    data: {
      labels: data.XproductName,
      // data trục x cần bỏ
      datasets: [
        {
          label: "Unit In Stock",
          data: data.Ystock,
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
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
  const Ystock = [];
  // tạo biến private
  // mở crt + F11 mở cửa sổ console sẽ thấy
  // gọi giá trị stock là cái nhập vào đẻ filter nhưng ko hiểu sao ko vào
  const response = await fetch('https://tradesql.herokuapp.com/admin/api/UnitInStock');

  // sử dụng api từ web
  const data = await response.json();
  // đọc api sử dụng await có nghĩa là function là async giống như function bth nhưng nhanh hơn
  for (let item in data) {
    //vòng lặp
    var Name = data[item].ProductName;
    var Stock = data[item].UnitsInStock;
    // bỏ data vào với biến productName và số lương sản phẩm
    XproductName.push(Name);
    Ystock.push(Stock);
    //thêm giá trị của data vào hai biến đã gọi ở trên
  }
  return { XproductName, Ystock };
}