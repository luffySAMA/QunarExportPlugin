/**
 * 航班信息
 */
class FlightInfo {
  constructor() {
    this.init();
  }
  toCsv() {
    let csv = `
    ${this.airline},${this.flightNum},${this.airplane},${this.fromAirport},${this.startTime},${this.flight1ArriveAddress},${
      this.flight1ArriveTime
    },${this.flight1Duration},${this.flight1OnTime},${this.stopTime},${this.stoppedCity},${this.flight2ArriveAddress},${
      this.flight2ArriveTime
    },${this.flight2Duration},${this.flight2OnTime},${this.toAirport},${this.endTime},${this.duration},${this.priceBusiness},${
      this.priceEconomy
    },${this.onTime}`;
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
     * 中转停留时间
     */
    this.stopTime = '';

    /**
     * 经停
     */
    this.stoppedCity = '';

    /**
     * 第一航班到达时间
     */
    this.flight1ArriveTime = '';
    /**
     * 第一航班到达机场
     */
    this.flight1ArriveAddress = '';
    /**
     * 第一航班准点率
     */
    this.flight1OnTime = '';
    /**
     * 第一航班飞行时间
     */
    this.flight1Duration = '';

    /**
     * 第二航班到达时间
     */
    this.flight2ArriveTime = '';
    /**
     * 第二航班到达机场
     */
    this.flight2ArriveAddress = '';
    /**
     * 第二航班准点率
     */
    this.flight2OnTime = '';
    /**
     * 第二航班飞行时间
     */
    this.flight2Duration = '';
  }
}
