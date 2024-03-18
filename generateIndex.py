import jieba #引入结巴库
from wordcloud import WordCloud #引入词云图
import matplotlib.pyplot as plt
import sys
import os
text = sys.argv[1]
title = sys.argv[2]
words = jieba.cut(text) #中文分词
#添加字体文件 随便找一个字体文件就行 不然不支持中文
font = './font.ttf'
info = WordCloud(font_path=font,width=1000,height=800,background_color='white').generate(''.join(words))

# 如果没有此文件夹则创建
if not os.path.exists('wordcloud'):
    os.mkdir('wordcloud')
    # 将词云图保存到本地
    info.to_file(f'wordcloud/{title}.png')
    print(f'没有文件夹wordcloud/{title}.png')
else:
    info.to_file(f'wordcloud/{title}.png')
    print(f'有文件夹wordcloud/{title}.png')

#输出词云图
plt.imshow(info,interpolation='bilinear')
plt.axis('off')
plt.show()


