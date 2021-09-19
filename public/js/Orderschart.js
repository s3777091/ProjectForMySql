ChartOrders();
// gọi function chartUnitInStock
async function ChartOrders() {
  const data = await getData();
  //goi lai function getData()
  const ctx = document.getElementById("ChartOrders").getContext("2d");
  // tên biến id của chart là UnitInStockChart

  const myChart = new Chart(ctx, {
    type: "line",
    // bar char
    data: {
      labels: data.XproductName,
      // data trục x cần bỏ
      datasets: [
        {
          label: "Orders",
          data: data.YSubTotal,
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
      },
    },
  });
}

async function getData() {
  const XproductName = [];
  const YSubTotal = [];
  // tạo biến private
  // mở crt + F11 mở cửa sổ console sẽ thấy
  // gọi giá trị stock là cái nhập vào đẻ filter nhưng ko hiểu sao ko vào
  const response = await fetch("https://tradesql.herokuapp.com/admin/api/order1000");

  // sử dụng api từ web
  const data = await response.json();
  // đọc api sử dụng await có nghĩa là function là async giống như function bth nhưng nhanh hơn
  for (let item in data) {
    //vòng lặp
    var ProductName = data[item].ProductName;
    var SubTotal = data[item].Quantity;
    // bỏ data vào với biến productName và số lương sản phẩm
    XproductName.push(ProductName);
    YSubTotal.push(SubTotal);
    //thêm giá trị của data vào hai biến đã gọi ở trên
  }
  return { XproductName, YSubTotal };
}