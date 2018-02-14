/**
 * 航班信息
 */
class FlightInfo {
  constructor() {
    this.init();
  }
  toCsv() {
    console.log(this);
    if (this.middleFlight1 instanceof MiddleFlightInfo == false) {
      this.middleFlight1 = new MiddleFlightInfo();
    }
    if (this.middleFlight2 instanceof MiddleFlightInfo == false) {
      this.middleFlight2 = new MiddleFlightInfo();
    }
    let csv = `
    ${this.airline},${this.flightNum},${this.airplane},${this.fromAirport},${this.startTime},${this.middleFlight1.middleAirport},${this
      .middleFlight1.middleTime && this.middleFlight1.middleTime.split('~')[0]},,,${this.middleFlight1.duration},${this.stoppedCity},${
      this.middleFlight1.middleAirport
    },${this.middleFlight1.middleTime && this.middleFlight1.middleTime.split('~')[1]},,,${this.toAirport},${this.endTime},${
      this.duration
    },${this.priceBusiness},${this.priceEconomy},${this.onTime}`;
    return csv;
  }

  init() {
    /**
     * 起飞机场
     */
    this.fromAirport = '';
    /**
     * 到达机场
     */
    this.toAirport = '';
    /**
     * 航空公司
     */
    this.airline = '';
    /**
     * 航班编号
     */
    this.flightNum = '';
    /**
     * 机型
     */
    this.airplane = '';
    /**
     * 计划起飞时间
     */
    this.startTime = '';
    /**
     * 计划到达时间
     */
    this.endTime = '';
    /**
     * 总飞行时长
     */
    this.duration = '';
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
     * 准点率
     */
    this.onTime = '';

    /**
     * 经停
     */
    this.stoppedCity = '';

    /**
     * 中转航班1
     */
    this.middleFlight1 = new MiddleFlightInfo();

    /**
     * 中转航班2
     */
    this.middleFlight2 = new MiddleFlightInfo();
  }
}
class MiddleFlightInfo {
  constructor() {
    /**
     * 中转城市
     */
    this.middleCity = '';
    /**
     * 中转机场
     */
    this.middleAirport = '';
    /**
     * 中转时间(20:25~06:15)
     */
    this.middleTime = '';
    /**
     * 中转停留时间(9小时50分钟)
     */
    this.duration = '';
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
