import nodemailer from "nodemailer";
import path from "node:path";
import fs from "node:fs";
export const sendEmailWithImage = (attachmentPath, recipientEmail) => {
  console.log("🚀 ~ sendEmailWithImage ~ attachmentPath:", attachmentPath);
  // 发送邮件
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com", // 您的SMTP服务提供商的主机名
    port: 465, // SMTP端口
    secure: true, // true for 465, false for other ports
    auth: {
      user: "2410292164@qq.com", // 你的邮箱
      pass: "mjubxmzuuhkcecce", // 密码框里面输入16位授权码进行验证
    },
  });
  // 生成邮件内容
  let htmlContent = "<h1>这里是每日词云图推荐频道的推荐:</h1>";
  console.log(
    "🚀 ~ sendEmailWithImage ~ attachmentPath.entries():",
    attachmentPath.entries()
  );
  attachmentPath.forEach((item, index) => {
    const filename = path.basename(item);
    htmlContent += `
        <div>
            <strong>${filename.split(".")[0]}</strong>
            <br />
            <img src="cid:image${index}" style="max-width: 100%;" />
        </div>
        <br />
        `;
  });
  console.log("🚀 ~ sendEmailWithImage ~ htmlContent:", htmlContent);

  //  设置邮件内容
  let mailOptions = {
    from: '"掘金词云图" <2410292164@qq.com>', // 发件人
    to: recipientEmail, // 收件人
    subject: "每日词云图推荐", // 标题
    html: htmlContent, // 邮件内容
    attachments: attachmentPath.map((item, index) => ({
      filename: path.basename(item),
      path: item,
      cid: `image${index}`, // Content ID，用于在HTML内容中引用图片
    })), // 附件
  };
  //   发送邮件
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("🚀 ~ sendEmailWithImage ~ error:", error);
    } else {
      console.log("🚀 ~ sendEmailWithImage ~ info:", info);
    }
  });
};

const getWordCloudImages = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("🚀 ~ getWordCloudImages ~ files:", files);
      // 过滤出图片并且拿到图片的完整路径
      const imagePaths = files
        .filter((item) => /\.(png|jpe?g|gif)$/i.test(item))
        .map((item) => path.join(directory, item));
      resolve(imagePaths);
    });
  });
};
export const sendEmail = async () => {
  const wordCloudDirectory = "./wordcloud";
  const imagePaths = await getWordCloudImages(wordCloudDirectory);
  console.log("🚀 ~ sendEmail ~ impagePath:", imagePaths);
  //   发送邮件
  sendEmailWithImage(imagePaths, "659672626@qq.com");
};
