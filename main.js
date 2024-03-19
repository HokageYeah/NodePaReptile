import { crawler } from "./src/crawlerParticiple/index.js";
import { sendEmail } from "./src/smtpEmail/index.js";
import { sendWechatMessage, getWeaterData } from "./src/weChat/index.js";

// 获取argv参数
const argv = process.argv.slice(2);
// 执行爬虫、并且中分分词、生成词云图并且保存到相应文件夹
if (argv.length > 1) {
  crawler();
} else if (argv.length == 1) {
  const argument = argv[0];
  if (argument == "email") {
    sendEmail();
  } else if (argument == "wechat") {
    await getWeaterData();
    // await sendWechatMessage();
  }
}
