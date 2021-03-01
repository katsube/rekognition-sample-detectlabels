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
const FILE = FILES[0]


//-----------------------------------------------
// モジュール
//-----------------------------------------------
const AWS = require('aws-sdk')
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
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
    drawLine(response.Labels)
    saveFile(FILE.json, JSON.stringify(response, null, 2))
  }
})


/**
 * 発見されたラベルの箇所に線を引く
 *
 * @param {object} label  Rekognitionからのレスポンス
 * @param {string} path   元画像ファイルのパス
 * @param {number} width  画像の横幅
 * @param {number} height 画像の高さ
 */
async function drawLine(labels){
  const canvas = createCanvas(FILE.width, FILE.height)
  const image = await loadImage(FILE.origin)
  const ctx = canvas.getContext('2d')

  // 画像を貼り付け
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // 線のスタイル設定
  ctx.strokeStyle = 'blue'
  ctx.lineWidth   = 5

  // 線を描く
  for( let label of labels ){
    console.log(`${label.Name} - ${label.Confidence}`)
    for( let instance of label.Instances ){
      const box = instance.BoundingBox
      const boxleft   = Math.floor(box.Left * FILE.width)
      const boxtop    = Math.floor(box.Top  * FILE.height)
      const boxwidth  = Math.floor(box.Width * FILE.width)
      const boxheight = Math.floor(box.Height * FILE.height)
      console.log(`  ${boxleft},${boxtop},${boxwidth},${boxheight}`)

      ctx.beginPath();
      ctx.moveTo(boxleft, boxtop);                    // 左上からスタート
      ctx.lineTo(boxleft+boxwidth, boxtop);           // 右上
      ctx.lineTo(boxleft+boxwidth, boxtop+boxheight); // 右下
      ctx.lineTo(boxleft,boxtop+boxheight);           // 左下
      ctx.lineTo(boxleft, boxtop);                    // 左上に戻る
      ctx.stroke();
    }
  }

  // JPEGに変換して保存
  canvas.toBuffer((err, buff) => {
    if (err) throw err
    saveFile(FILE.out, buff)
  }, 'image/jpeg', { quality: 0.95 })
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