ChartUnitInStock();
// gọi function chartUnitInStock
async function ChartUnitInStock() {
  const data = await getData();
  //goi lai function getData()
  const ctx = document.getElementById("UnitInStockChart").getContext("2d");
  // tên biến id của chart là UnitInStockChart

  const myChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: data.xUserName,
      // data trục x cần bỏ
      datasets: [
        {
          label: "Quanlity of product user buy",
          data: data.Yquantity,
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(255, 99, 132)",
        },
        {
          label: "Total money they spend",
          data: data.Zmoney,
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(255, 99, 132)",
        },
      ],
    },
    options: {
      scales: {
        r: {
          angleLines: {
            color: 'red'
          }
        }
      },
    },
  });
}

async function getData() {
  const xUserName = [];
  const Yquantity = [];
  const Zmoney = [];
  // tạo biến private
  // mở crt + F11 mở cửa sổ console sẽ thấy
  // gọi giá trị stock là cái nhập vào đẻ filter nhưng ko hiểu sao ko vào
  const response = await fetch("http://localhost:9999/admin/api/topuser");

  // sử dụng api từ web
  const data = await response.json();
  // đọc api sử dụng await có nghĩa là function là async giống như function bth nhưng nhanh hơn
  for (let item in data) {
    //vòng lặp
    var UserFullName = data[item].Username;
    var quantity = data[item].Quality;
    var money = data[item].TOTALMONEY;
    // bỏ data vào với biến productName và số lương sản phẩm
    xUserName.push(UserFullName);
    Yquantity.push(quantity);
    Zmoney.push(money);
    //thêm giá trị của data vào hai biến đã gọi ở trên
  }
  return { xUserName, Yquantity, Zmoney };
}
