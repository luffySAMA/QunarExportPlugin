// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == 'download') {
    // 起飞机场
    let fromAirport = getFromAirport();
    // 目的机场
    let toAirport = getToAirport();
    // 日期
    let flightDate = getFlightDate();

    // 文件名
    let fileName = `${fromAirport}-${toAirport}-${flightDate}.csv`;
    // 文件内容
    let csvContent = `航空公司,航班编号,机型,起飞机场,计划起飞时间,是否中转/经停,,,,,,,,,,到达机场,计划到达时间,总飞行时长,商务票价（元）,经济票价（元）,总到达准点率
,,,,,第一航段到达机场,第一航段到达时间,第一航段飞行时间,第一航段准点率,中转停留时间,经停机场,第二航段起飞机场,第二航段起飞时间,第二航段飞行时间,第二航段准点率`;
    getFlightInfo().forEach(flight => {
      csvContent += FlightInfo.prototype.toCsv.apply(flight);
    });
    download(fileName, csvContent);
  }
});

/**
 * 从输入框中查询起飞机场
 */
function getFromAirport() {
  if (window.location.href.indexOf('flights.ctrip.com/international/') != -1) {
    // 国际航班
    return document.querySelectorAll('#homeCity')[0].value;
  } else if (window.location.href.indexOf('flights.ctrip.com/booking/') != -1) {
    // 国内航班
    return document.querySelectorAll('#DCityName1')[0].value;
  }
}
/**
 * 从输入框中查询目的机场
 */
function getToAirport() {
  if (window.location.href.indexOf('flights.ctrip.com/international/') != -1) {
    // 国际航班
    return document.querySelectorAll('#destCity')[0].value;
  } else if (window.location.href.indexOf('flights.ctrip.com/booking/') != -1) {
    // 国内航班
    return document.querySelectorAll('#ACityName1')[0].value;
  }
}
/**
 * 从输入框中查询起飞日期
 */
function getFlightDate() {
  if (window.location.href.indexOf('flights.ctrip.com/international/') != -1) {
    // 国际航班
    return document.querySelectorAll('#DDate')[0].value;
  } else if (window.location.href.indexOf('flights.ctrip.com/booking/') != -1) {
    // 国内航班
    return document.querySelectorAll('#DDate1')[0].value;
  }
}
/**
 * 从页面获取所有的航班信息
 *
 * 返回FlightInfo的数组
 */
function getFlightInfo() {
  let resultFlights = [];
  // 查找国内直飞
  document.querySelectorAll('.search_table_header .J_header_row').forEach(flightDiv => {
    let flight = new DirectFlightCreator(flightDiv).flightInfo;
    resultFlights.push(flight);
  });
  // 查找国内中转
  document.querySelectorAll('.search_transfer_header.J_header_row.J_header_wrap').forEach(flightDiv => {
    let flight = new StopFlightCreator(flightDiv).flightInfo;
    resultFlights.push(flight);
  });
  // 查找国际航班
  document.querySelectorAll('.flight-item').forEach(flightDiv => {
    let flight = new InternationalFlightCreator(flightDiv).flightInfo;
    resultFlights.push(flight);
  });
  return resultFlights;
}

/**
 * 下载文件
 * @param {*} fileName 文件名
 * @param {*} content 文件内容
 */
function download(fileName, content) {
  let blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, fileName);
}
