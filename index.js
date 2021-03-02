/**
 * Amazon Rekognition Sample
 *   画像の内容にラベルを付ける
 *
 */

//-----------------------------------------------
// 定数
//-----------------------------------------------
// ファイルリスト
const FILES = [
  {origin:'image/sample1.jpg', out:'image/sample1o.jpg', json:'image/sample1.json', width:1024, height:576},   // 0: いきなりステーキ
  {origin:'image/sample2.jpg', out:'image/sample2o.jpg', json:'image/sample2.json', width:1024, height:768},   // 1: パンダ
  {origin:'image/sample3.jpg', out:'image/sample3o.jpg', json:'image/sample3.json', width:1024, height:768}    // 2: 金閣寺
]

// 解析するファイル
const FILE = FILES[2]


//-----------------------------------------------
// モジュール
//-----------------------------------------------
const AWS = require('aws-sdk')
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

// .envを環境変数に
require('dotenv').config()

//-----------------------------------------------
// 画像解析
//-----------------------------------------------
// IAM設定
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

// Rekognitionに渡す値を準備
const client = new AWS.Rekognition();
const params = {
  Image: {
    Bytes: getFile(FILE.origin)
  },
  MaxLabels: 10
}

// Rekognitionで解析
client.detectLabels(params, (err, response) =>{
  if (err) {
    console.log(err, err.stack)
  }
  else {
    // 画像に線を引いて保存
    drawLine(response.Labels)

    // レスポンスを保存
    saveFile(FILE.json, JSON.stringify(response, null, 2))
  }
})


/**
 * 発見されたラベルの箇所に線を引く
 *
 * @param {object} label  Rekognitionからのレスポンス
 */
async function drawLine(labels){
  const canvas = createCanvas(FILE.width, FILE.height)
  const ctx = canvas.getContext('2d')

  // 画像を貼り付け
  const image = await loadImage(FILE.origin)
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // 線のスタイル設定
  ctx.strokeStyle = 'blue'
  ctx.lineWidth   = 5

  // 線を描く
  for( let label of labels ){
    const name = label.Name
    for( let instance of label.Instances ){
      // 画像上の座標に変換
      const box = instance.BoundingBox
      const boxLeft   = Math.floor(box.Left * FILE.width)
      const boxTop    = Math.floor(box.Top  * FILE.height)
      const boxWidth  = Math.floor(box.Width * FILE.width)
      const boxHeight = Math.floor(box.Height * FILE.height)

      // ラベル
      ctx.font = '20px serif';
      ctx.fillText(name, boxLeft+10, boxTop+20);

      // 線
      ctx.beginPath();
      ctx.moveTo(boxLeft, boxTop);                    // 左上からスタート
      ctx.lineTo(boxLeft+boxWidth, boxTop);           // 右上
      ctx.lineTo(boxLeft+boxWidth, boxTop+boxHeight); // 右下
      ctx.lineTo(boxLeft,boxTop+boxHeight);           // 左下
      ctx.lineTo(boxLeft, boxTop);                    // 左上に戻る
      ctx.stroke();
    }
  }

  // JPEGに変換して保存
  canvas.toBuffer((err, buff) => {
      if (err) throw err
      saveFile(FILE.out, buff)
    },
    'image/jpeg', { quality: 0.95 })
}

/**
 * 指定ファイルのデータを返却する
 *
 * @param {string} path
 * @return {string}
 */
function getFile(path){
  try{
    const image = fs.readFileSync(path)
    return(image)
  }
  catch(e){
    console.error(e.message)
    process.exit()
  }
}

/**
 * 指定ファイルにデータを保存する
 *
 * @param {string} path
 * @param {any} data
 */
function saveFile(path, data){
  try{
    fs.writeFileSync(path, data)
  }
  catch(e){
    console.error(e.message)
    process.exit()
  }
}