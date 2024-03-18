import puppeteer from "puppeteer";
import { spawn } from "child_process";

// 获取命令传递过来的参数
export const crawler = async () => {
  const btnText = process.argv.slice(2)[0];

  const browser = await puppeteer.launch({
    headless: false, //取消无头模式
  });

  const page = await browser.newPage(); // 打开一个页面
  // 设置页面宽高
  await page.setViewport({ width: 1366, height: 768 });
  // 跳转代掘金
  await page.goto("https://juejin.cn/");

  // 等到元素出现
  await page.waitForSelector(".side-navigator-wrap");

  //获取menu下面的span
  //  $获取单个元素、$$获取多个元素
  const menu = await page.$$(".side-navigator-wrap .nav-item-wrap span");
  console.log(menu);
  for await (let el of menu) {
    // 获取span中的文本
    const text = await el.getProperty("innerText"); //获取span的属性
    const title = await text.jsonValue(); //获取内容
    console.log(title);
    if (title.trim() === btnText.trim()) {
      // 点击
      await el.click();
      // 调用函数
      collectFunc(title);
      break;
    }
  }
  const articleList = [];
  async function collectFunc(title) {
    // 获取列表消息
    await page.waitForSelector(".entry-list");
    const list = await page.$$(".entry-list .title-row a");
    for await (let el of list) {
      const text = await el.getProperty("innerText");
      const title = await text.jsonValue();
      articleList.push(title);
    }
    console.log(articleList);

    //  调用python脚本进行中文分词 输出词云图
    const pythonProcess = spawn("python", [
      "generateIndex.py",
      articleList.join(","),
      title,
    ]);
    pythonProcess.stdout.on("data", (backData) => {
      // backData 返回的是一个buffer
      console.log(backData.toString());
    });
    pythonProcess.stderr.on("data", (backData) => {
      console.log(backData.toString());
    });
    pythonProcess.on("close", () => {
      console.log("词云图生成完毕");
      browser.close(); //关闭浏览器
    });
  }
};
