/**
 * 航班信息的DOM结构信息
 */
class DirectFlightCreator {
  constructor(root) {
    this.init();
    if (root == undefined) {
      return;
    }
    this.root = root;
    this.createFlightInfo();
  }

  createFlightInfo() {
    this.flightInfo = new FlightInfo();
    for (let propName in this.flightInfo) {
      // this.propName 存的值是选择器
      let selector = this[propName];
      // 用selector到this.root中去找，返回的就是航班的信息
      this.flightInfo[propName] = querySelector(this.root, selector);
    }
  }

  init() {
    /**
     * 起飞机场
     */
    this.fromAirport = '.right div+div';
    /**
     * 到达机场
     */
    this.toAirport = '.left div+div';
    /**
     * 航空公司
     */
    this.airline = '.logo .flight_logo';
    /**
     * 航班编号
     */
    this.flightNum = '.logo .flight_logo+span';
    /**
     * 机型
     */
    this.airplane = '.logo span[data-bit="FlightType"]';
    /**
     * 计划起飞时间
     */
    this.startTime = '.right .time';
    /**
     * 计划到达时间
     */
    this.endTime = '.left .time';
    /**
     * 总飞行时长
     */
    this.duration = function(node) {
      let start = querySelector(node, '.right .time');
      let startHour = parseInt(start.split(':')[0]);
      let startMinute = parseInt(start.split(':')[1]);
      let end = querySelector(node, '.left .time');
      let endHour = parseInt(end.split(':')[0]);
      let endMinute = parseInt(end.split(':')[1]);
      let hours = endHour - startHour;
      let minutes = endMinute - startMinute;
      if (hours < 0) {
        // 如果结束的hour小于开始的hour，认为是第二天到达的（国内直飞不考虑隔2天）
        hours += 24;
      }
      if (minutes < 0) {
        // 如果结束minute小于开始minute，向hour借一位
        minutes += 60;
        hours -= 1;
      }
      return `${hours}h ${minutes}m`;
    };
    /**
     * 经济舱价格
     */
    this.priceEconomy = function(node) {
      let temp = '<dfn>¥</dfn>';
      return '¥' + querySelector(node, '.price .base_price02').substr(temp.length);
    };
    /**
     * 商务舱价格
     */
    this.priceBusiness = '';
    /**
     * 头等舱价格
     */
    this.priceFirst = '';
    /**
     * 准点率
     */
    this.onTime = '.service span[data-bit="OnTimeRate"]';
  }
}
/**
 * 根据一个选择器，到node中去找，找到之后，返回innerHTML
 *
 * @param {*} node
 * @param {*} selector
 */
function querySelector(node, selector) {
  let resultStr = '';
  if (typeof selector == 'string' && selector != '') {
    // 单个选择器，选择元素，然后获取innerHTML
    let element = node.querySelector(selector);
    if (element != undefined) {
      resultStr = element.innerHTML;
    }
  } else if (Array.isArray(selector)) {
    // 数组选择器
    if (selector.length == 1) {
      // 数组中只有一个选择器，表示使用selectAll，然后将所有元素的innerHTML拼起来
      let nodelist = node.querySelectorAll(selector);
      // nodelist 转数组
      let elements = Array.prototype.slice.call(nodelist);
      resultStr = elements.map(element => element.innerHTML).join(' ');
    } else {
      //数组中有多个选择,递归每一项，然后拼起来（ps:暂时没有用到这种情况）
      resultStr = selector.map(_selector => querySelector(node, _selector)).join(' ');
    }
  } else if (typeof selector == 'function') {
    return selector(node);
  } else if (typeof selector == 'object') {
    // 选择器是对象类型
    // 不太好处理，先不处理这种情况吧
    // 对象类型的选择器，需要特殊处理
    resultStr = '';
  }
  // 最后要把内容中的`&nbsp;`换成空格
  resultStr = resultStr.replace(/\&nbsp;/g, ' ');
  return resultStr || '';
}
