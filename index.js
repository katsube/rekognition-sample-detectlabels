/**
 * Amazon Rekognition Sample
 *   画像の内容にラベルを付ける
 *
 */

//-----------------------------------------------
// 定数
//-----------------------------------------------
const FILE = 'sample1.jpg'

//-----------------------------------------------
// モジュール
//-----------------------------------------------
const AWS = require('aws-sdk')
const fs = require('fs')
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
    Bytes: getImage(FILE)
  },
  MaxLabels: 10
}

// Rekognitionで解析
client.detectLabels(params, (err, response) =>{
  if (err) {
    console.log(err, err.stack)
  }
  else {
    console.log(response)
  }
})


/**
 * 指定ファイルを返却する 
 *
 * @param {string} path
 * @return {string}
 */
function getImage(path){
  try{
    const image = fs.readFileSync(path)
    return(image)
  }
  catch(e){
    console.error(e.message)
    process.exit()
  }
}
