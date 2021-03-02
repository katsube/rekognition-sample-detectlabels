# Amazon Rekognition Sample - Detecting labels in an image

Rekognitionにローカルの画像ファイルを送信し、ラベルをつけるNode.jsのサンプルです。

## 解説ページ
* [[AWS] Rekognitionで画像内に何が存在するか解析する](https://blog.katsubemakito.net/aws/rekognition-label)

## 利用方法
### 準備
このリポジトリをCloneします。
```shellsession
$ git clone https://github.com/katsube/rekognition-sample-detectlabels.git
```

[Node.js](https://nodejs.org/ja/)が入っている状態で、`npm install`を行い必要なモジュールを取得します。
```shellsession
$ cd rekognition-sample-detectlabels
$ npm install
```

node-canvasが必要とする[ライブラリ](https://github.com/Automattic/node-canvas/wiki)をインストールしてください。


最後に`.env`という名前のファイルを作成しAWSのIAMのアクセスキーとシークレットを記述します。
```ini
AWS_ACCESS_KEY_ID=XXXXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=YYYYYYYYYYYYYYYYYYYYYYYYYYYY
AWS_REGION=ap-northeast-1
```

### 実行
nodeコマンドでindex.jsを実行するだけです。imageフォルダに解析結果が保存されます。
```shellsession
$ node index.js
```

解析したい画像ファイルを変更したい場合は、index.jsの冒頭部分を編集します。
```javascript
// ファイルリスト
const FILES = [
  {origin:'image/sample1.jpg', out:'image/sample1o.jpg', json:'image/sample1.json', width:1024, height:576},   // 0: いきなりステーキ
  {origin:'image/sample2.jpg', out:'image/sample2o.jpg', json:'image/sample2.json', width:1024, height:768},   // 1: パンダ
  {origin:'image/sample3.jpg', out:'image/sample3o.jpg', json:'image/sample3.json', width:1024, height:768}    // 2: 金閣寺
]

// 解析するファイル
const FILE = FILES[2]
```

