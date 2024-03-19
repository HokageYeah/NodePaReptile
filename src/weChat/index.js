import axios from "axios";

// 微信公众号的 AppID 和 AppSecret
const APPID = "wxa88c9b80089f3171";
const APPSECRET = "4f5f6a6e5319b2a0ff1476c7c8062cc0";

// 获取 access_token 的 URL
export const ACCESS_TOKEN_URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
let accessToken = "";
export const getWeaterData = async () => {
  try {
    // 获取access_token
    const requestToken = await axios.get(ACCESS_TOKEN_URL);
    const weaterApi = `http://v1.yiketianqi.com/free/day?appid=19324865&appsecret=fWufvW2v&unescape=1&city=郑州`;
    const {
      data: {
        result: { content, note },
      },
    } = await axios.get("https://api.oioweb.cn/api/common/OneDayEnglish");
    const { data: weaterResponse } = await axios.get(weaterApi);
    accessToken = requestToken.data.access_token;
    if (accessToken) {
      const tipsMap = {
        晴: "天气晴朗，记得出门戴口罩哦！",
        多云: "天气多云，记得多带件外套哦！",
        阴: "天气阴，记得出门带伞！",
        阵雨: "天气阵雨，记得出门带伞！",
        雷阵雨: "天气雷阵雨，记得出门带伞！",
        雷阵雨伴有冰雹: "天气阴沉，记得出门带伞！",
        雨夹雪: "天气阴沉，记得出门带伞！",
      };
      const weekList = {
        星期一: "早上好呀，牛马，今天又是元气满满的一天，加油吧，打工人",
        星期二: "早上好呀，加油吧，打工人，还有三天就是周末了",
        星期三: "早上好呀，牛马，加油吧，还有两天，周末快到了",
        星期四: "早上好呀，牛马，今天你疯狂了？v我50",
        星期五: "早上好呀，牛马，摸鱼搞起来",
        星期六: "牛马，快乐周末开始了",
        星期日: "牛马，好好休息吧，明天要上班啦，呜呜呜",
      };
      const weatherData = {
        date: new Date().toLocaleDateString() + " - " + weaterResponse.week,
        weather: `${weaterResponse.city}-天气${weaterResponse.wea}-${weaterResponse.win}${weaterResponse.win_speed}`,
        temperature: `${weaterResponse.tem_night}°C - ${weaterResponse.tem_day}°C`,
        tip: tipsMap[weaterResponse.wea], // 这里可以根据天气情况给出不同的提示,
        day: calculateDaysSince("2023/11/26"),
        note,
        content,
        love: weekList[weaterResponse.week],
      };
      console.log("🚀 ~ main ~ weatherData:", weatherData);
      await sendWechatMessage(
        accessToken,
        weatherData,
        "oCwzb6M11fJk6Xm3yFdbRmvgvmNA"
      );
    }
  } catch (error) {
    console.error("获取 access_token 出错：", error);
  }
};

const calculateDaysSince = (dateString) => {
  const startDate = new Date(dateString);
  const currentDate = new Date();

  // 计算两个日期之间的时间差（以毫秒为单位）
  const timeDifference = currentDate - startDate;

  // 将时间差转换为天数
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  // 返回天数差的绝对值并向下取整
  return Math.floor(Math.abs(daysDifference));
};

export const sendWechatMessage = async (accessToken, weatherData, user_id) => {
  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;
  const data = {
    // touser: 'oNY2V6sZfOqHhhfAVn5zqR_C3n1Y', // 用户的 OpenID
    touser: user_id, // 用户的 OpenID
    template_id: "1X_Ab8SKPssXo-T1ivEAset5Y-00t_Keyfpcy99WqNg", // 模板ID
    data: {
      // 根据您的模板内容，这里填写对应的字段
      date: {
        value: weatherData.date, // 使用 weatherData 中的日期
        color: "#173177",
      },
      weather: {
        value: weatherData.weather, // 使用 weatherData 中的天气情况
        color: "#173177",
      },
      temperature: {
        value: weatherData.temperature, // 使用 weatherData 中的温度范围
        color: "#173177",
      },
      tip: {
        value: weatherData.tip, // 使用 weatherData 中的提示信息
        color: "#FF4500",
      },
      day: {
        value: weatherData.day,
        color: "#173177",
      },
      content: {
        value: weatherData.content,
        color: "#173177",
      },
      note: {
        value: weatherData.note,
        color: "#173177",
      },
      love: {
        value: weatherData.love,
        color: "#173177",
      },
      // ...其他模板数据
    },
  };
  try {
    const response = await axios.post(url, data);
    console.log("消息发送结果：", response.data);
  } catch (error) {
    console.error("发送消息失败：", error);
  }
};
