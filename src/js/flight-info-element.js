/**
 * 航班信息的DOM结构信息
 */
class FlightInfoElement {
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
    for (var propName in this.flightInfo) {
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
    this.fromAirport = ['.col-time .sep-lf .airport span'];
    /**
     * 到达机场
     */
    this.toAirport = ['.col-time .sep-rt .airport span'];
    /**
     * 航空公司
     */
    this.airline = '.col-airline .air span';
    /**
     * 航班编号
     */
    this.flightNum = '.col-airline .num .n';
    /**
     * 机型
     */
    this.airplane = '.col-airline .num .n+.n';
    /**
     * 计划起飞时间
     */
    this.startTime = '.col-time .sep-lf h2 span';
    /**
     * 计划到达时间
     */
    this.endTime = '.col-time .sep-rt h2';
    /**
     * 总飞行时长
     */
    this.duration = '.col-time .sep-ct .range';
    /**
     * 经济舱价格
     */
    this.priceEconomy = '';
    /**
     * 商务舱价格
     */
    this.priceBusiness = '';
    /**
     * 头等舱价格
     */
    this.priceFirst = '';

    /**
     * 中转航班
     */
    this.middleFlight = new MiddleFlightInfoElement();

    /**
     * 经停
     */
    this.stoppedFlight = new StoppedFlightInfoElement();
  }
}
class MiddleFlightInfoElement {
  constructor(root) {
    this.init();
    if (root == undefined) {
      return;
    }
    this.root = root;
    this.createMiddleFlightInfo();
  }

  createMiddleFlightInfo() {
    this.middleFlightInfo = new MiddleFlightInfo();
    for (var propName in this.middleFlightInfo) {
      // this.propName 存的值是选择器
      let selector = this[propName];
      // 用selector到this.root中去找，返回的就是航班的信息
      this.middleFlightInfo[propName] = querySelector(this.root, selector);
    }
  }

  init() {
    /**
     * 中转城市
     */
    this.middleCity = '.t-item:nth-of-type(1) .info';
    /**
     * 中转机场
     */
    this.middleAirport = '.t-item:nth-of-type(2) .info';
    /**
     * 中转时间(20:25~06:15)
     */
    this.middleTime = '.t-item:nth-of-type(3) .info span';
    /**
     * 中转停留时间(9小时50分钟)
     */
    this.duration = '.t-item:nth-of-type(4) .info';
    /**
     * 中转起始时间（即上一航班的到达时间）
     */
    this.middleStartTime = '';
    /**
     * 中转结束时间（即下一航班的起飞时间）
     */
    this.middleEndTime = '';
  }
}
class StoppedFlightInfoElement {
  constructor(root) {
    this.init();
    if (root == undefined) {
      return;
    }
    this.root = root;
    this.createStoppedFlightInfo();
  }

  createStoppedFlightInfo() {
    this.stoppedFlightInfo = new StoppedFlightInfo();
    for (var propName in this.stoppedFlightInfo) {
      // this.propName 存的值是选择器
      let selector = this[propName];
      // 用selector到this.root中去找，返回的就是航班的信息
      this.stoppedFlightInfo[propName] = querySelector(this.root, selector);
    }
  }
  init() {
    /**
     * 经停城市
     */
    this.stoppedCity = '.t-item:nth-of-type(2) .info';
    /**
     * 经停航班
     */
    this.stoppedFlightNum = '.t-item:nth-of-type(1) .info';
    /**
     * 经停时间
     */
    this.stoppedTime = '.t-item:nth-of-type(3) .info span';
    /**
     * 经停停留时间
     */
    this.duration = '.t-item:nth-of-type(4) .info';
    /**
     * 经停起始时间
     */
    this.stoppedStartTime = '';
    /**
     * 经停结束时间
     */
    this.stoppedEndTime = '';
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
