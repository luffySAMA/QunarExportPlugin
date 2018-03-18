// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == 'download') {
    if (window.location.href.indexOf('flights.ctrip.com/international/') != -1) {
      // 国际航班
      let value = document.querySelector('#drpSubClass').value;
      let seat = '';
      if (value == 'Y_S') {
        seat = '经济票';
      } else if (value == 'C_F' || value == 'C' || value == 'F') {
        seat = '商务票';
      }
      log(`开始下载国际航班${seat}...`);
      window.scrollTo(0, 9999);
      document.querySelectorAll('.flight-action-more a').forEach(linkMore => {
        linkMore.click();
      });
      log(`请等待${seat}数据加载完后重新点击下载按钮...`);
      setTimeout(() => {
        let fileName = getFileName(seat);
        let csv = getCsv(seat);
        download(fileName, csv);
        if (seat == '经济票') {
          document.querySelector('#drpSubClass').value = 'C_F';
        } else if (seat == '商务票') {
          document.querySelector('#drpSubClass').value = 'Y_S';
        }
        setTimeout(() => {
          document.querySelector('#btnSearch').click();
        }, 2000);
      }, 1000);
    }
    if (window.location.href.indexOf('flights.ctrip.com/booking/') != -1) {
      // 国内航班
      document.querySelectorAll("#J_flightFilter input[name='filter_Classes']")[0].click();
      // document.querySelector('.btn_book.J_expandBtn').click();
      window.scrollTo(0, 9999);
      setTimeout(() => {
        let fileName = getFileName('经济票');
        let csv = getCsv('经济票');
        download(fileName, csv);
        log(`开始下载国内航班经济票...`);
        document.querySelectorAll("#J_flightFilter input[name='filter_Classes']")[1].click();
        // document.querySelector('.btn_book.J_expandBtn').click();
        window.scrollTo(0, 9999);
        setTimeout(() => {
          let fileName = getFileName('商务票');
          let csv = getCsv('商务票');
          log(`开始下载国内航班商务票...`);
          download(fileName, csv);
        }, 1000);
      }, 1000);
    }
  }
});

function getFileName(seat) {
  // 起飞机场
  let fromAirport = getFromAirport();
  // 目的机场
  let toAirport = getToAirport();
  // 日期
  let flightDate = getFlightDate();

  // 文件名
  let fileName = `${fromAirport}-${toAirport}-${flightDate}-${seat}.csv`;
  return fileName;
}

function getCsv(seat) {
  // 文件内容
  let csv = `航空公司,航班编号,机型,起飞机场,计划起飞时间,是否中转/经停,,,,,,,,,,,,,,,,到达机场,计划到达时间,总飞行时长,${seat}价（元）,总到达准点率
,,,,,第一航段到达机场,第一航段到达时间,第一航段飞行时间,第一航段准点率,中转停留时间,经停机场,第二航段起飞机场,第二航段起飞时间,第二航段飞行时间,第二航段准点率,第二航段中转停留时间,第二航段经停机场,第三航段起飞机场,第三航段起飞时间,第三航段飞行时间,第三航段准点率`;
  getFlightInfo().forEach(flight => {
    if (flight) {
      // 中转航班如果没有把鼠标放上去，就不导出
      csv += FlightInfo.prototype.toCsv.apply(flight);
    }
  });
  return csv;
}
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
  let stopDivList = document.querySelectorAll('.popup_transfer_detail');
  document.querySelectorAll('.search_transfer_header.J_header_row.J_header_wrap').forEach((flightDiv, i) => {
    let stopDiv = stopDivList[i];
    let flight = new StopFlightCreator(flightDiv, stopDiv).flightInfo;
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
function log(title, message) {
  chrome.extension.sendMessage({ type: 'notification', title: title, message: message }, function(response) {
    console.log('收到来自后台的回复：' + response);
  });
}

function airport() {
  return [
    'ADL',
    'ADL',
    'AKL',
    'HKG',
    'AMS',
    'MAN',
    'PEK',
    'ANC',
    'YYZ',
    'AQG',
    'CAN',
    'AUH',
    'BKK',
    'BAH',
    'DXB',
    'BAV',
    'WUH',
    'BHY',
    'KMG',
    'SZX',
    'ZUH',
    'BKI',
    'KCH',
    'VIE',
    'SIN',
    'CMB',
    'LIS',
    'MCT',
    'IST',
    'KLU',
    'MFM',
    'BOM',
    'JNB',
    'BNE',
    'CNS',
    'SYD',
    'BOD',
    'TLV',
    'DEL',
    'ZRH',
    'BOS',
    'ORD',
    'BWN',
    'CTU',
    'CKG',
    'NGB',
    'SWA',
    'TSN',
    'XUZ',
    'CGD',
    'ZHA',
    'PEN',
    'KUL',
    'HYN',
    'JDZ',
    'HFE',
    'KOW',
    'CGO',
    'XFN',
    'NNG',
    'PNH',
    'TYN',
    'LYG',
    'MNL',
    'LYA',
    'KHN',
    'SGN',
    'DLC',
    'HAK',
    'NNY',
    'URC',
    'SEL',
    'JJN',
    'LHW',
    'CGQ',
    'YIW',
    'SYX',
    'TNA',
    'SHE',
    'XIY',
    'WXN',
    'JUZ',
    'HRB',
    'KIX',
    'MXZ',
    'LZH',
    'HHA',
    'JIU',
    'LAX',
    'SHS',
    'INC',
    'NTG',
    'CSX',
    'YNT',
    'XNN',
    'TXN',
    'CGK',
    'KWE',
    'YBP',
    'HAN',
    'WEH',
    'SJW',
    'YIH',
    'HGH',
    'FOC',
    'WUS',
    'CZX',
    'NKG',
    'KWL',
    'WNZ',
    'DYG',
    'TAO',
    'SHA',
    'XMN',
    'CDG',
    'FRA',
    'CEB',
    'SUB',
    'CNX',
    'CPH',
    'CPT',
    'GRU',
    'CRK',
    'CTS',
    'DAC',
    'DDG',
    'LHR',
    'DPS',
    'DTW',
    'EWR',
    'MSP',
    'FCO',
    'FNJ',
    'HSN',
    'FUK',
    'OKA',
    'TPE',
    'KOJ',
    'GIG',
    'GUM',
    'SPN',
    'HET',
    'HIJ',
    'SDJ',
    'KHH',
    'SVO',
    'MRU',
    'RGN',
    'MXP',
    'NOP',
    'PER',
    'POM',
    'KTM',
    'UTP',
    'HKT',
    'SFS',
    'NGO',
    'LGK',
    'NRT',
    'YVR',
    'SFO',
    'IAD',
    'JFK',
    'JHG',
    'JIL',
    'JNZ',
    'LJG',
    'VTE',
    'MDG',
    'DAD',
    'NDG',
    'DCA',
    'SEA',
    'ADD',
    'JIB',
    'RUH',
    'KHI',
    'NBO',
    'HEL',
    'ISB',
    'NAO',
    'MIG',
    'KHV',
    'TAE',
    'WUX',
    'LXA',
    'TEN',
    'LZO',
    'MES',
    'DAX',
    'ICN',
    'LYI',
    'DIG',
    'YNZ',
    'PVG',
    'GYS',
    'DLU',
    'DME',
    'SXF',
    'HDY',
    'LAO',
    'REP',
    'MUC',
    'PUS',
    'HNL',
    'HSG',
    'LCX',
    'DAT',
    'CJJ',
    'JZH',
    'HJJ',
    'LHE',
    'DEN',
    'DMM',
    'DQA',
    'SAH',
    'LOS',
    'JED',
    'ENH',
    'ENY',
    'FUO',
    'NZH',
    'HLD',
    'HKD',
    'NAN',
    'MAA',
    'HUN',
    'HND',
    'RMQ',
    'IAH',
    'IBR',
    'IKA',
    'JGS',
    'JMU',
    'KHG',
    'KIJ',
    'TCZ',
    'LUM',
    'YGJ',
    'OKJ',
    'TAK',
    'MWX',
    'UBJ',
    'SLC',
    'PHX',
    'SHP',
    'UYN',
    'WUA',
    'ACX',
    'AEB',
    'AKJ',
    'ALA',
    'ALG',
    'AOG',
    'ARN',
    'AVA',
    'BAR',
    'BAX',
    'BFJ',
    'BGW',
    'BPE',
    'ZYI',
    'SIA',
    'LPF',
    'NNB',
    'PQC',
    'LLB',
    'WUT',
    'CXR',
    'JUH',
    'KBV',
    'YTY',
    'LZY',
    'NBS',
    'MDC',
    'LFQ',
    'KJH',
    'JHB',
    'CHC',
    'MKZ',
    'HIA',
    'HPH',
    'DMK',
    'NYT',
    'WDS',
    'RIZ',
    'SQJ',
    'YIC',
    'IQN',
    'CCU',
    'CEI',
    'HUZ',
    'ZGC',
    'DFW',
    'LGA',
    'DNH',
    'DUS',
    'FSZ',
    'GYD',
    'MYJ',
    'MAD',
    'OVB',
    'ISG',
    'KMI',
    'MDL',
    'KKJ',
    'ILO',
    'KMJ',
    'HYD',
    'VVO',
    'IKT',
    'KLO',
    'ULN',
    'TNN',
    'OOL',
    'LGW',
    'UCB',
    'HZG',
    'JGN',
    'JXA',
    'XIC',
    'WNH',
    'LLV',
    'ROR',
    'PZI',
    'ZQZ',
    'ZAT',
    'TKK',
    'TNH',
    'VKO',
    'LLF',
    'PHL',
    'XZM',
    'YNJ',
    'AMM',
    'ATL',
    'BDL',
    'TNR',
    'USM',
    'CAI',
    'RUN',
    'BLR',
    'BSD',
    'NAY',
    'WEF',
    'HZH',
    'WUZ',
    'HDG',
    'FUG',
    'JNG',
    'YCU',
    'CJU',
    'DOH',
    'TVS',
    'OBO',
    'MMB',
    'MLE',
    'URT',
    'HMI',
    'CIH',
    'DSN',
    'CIF'
  ];
}
