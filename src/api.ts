const express = require("express");
const bodyParser = require("body-parser");
const low = require("lowdb");

const FileSync = require("lowdb/adapters/FileSync");
import fs from "fs-extra";
import path from "path";
import axios from 'axios';
// creater server
const server = express();
server.use(bodyParser.json());
server.use(require("cors")());
const isDevelopment = process.env.NODE_ENV !== 'production'
const debugpath = isDevelopment ? __dirname :process.cwd()

const datapath = path.join(debugpath, "/data");

const timerfile = path.join(datapath,"/timer.txt")

// 数据库
const adapter = new FileSync(path.join(datapath, "/db.json"));
const db = low(adapter);

// 斗鱼礼物数据库
const douyu_adapter = new FileSync(path.join(datapath, "/gift.json"));
const douyu_db = low(douyu_adapter);

db.defaults({
  gift: [],
  user: [],
  command: [],
  config: {},
  defaultconfig: {},
  danmu:{},
  version: "0.1.0",
}).write();



server.get("/douyugiftlist",(req,res)=>{
  const giftlist = douyu_db.value();
  let giftarray = []
  for(let index in giftlist){
    giftarray.push(giftlist[index])
  }
  res.send(giftarray);
})


// 读取gift
server.get("/gift", (req, res) => {
  const gift = db.get("gift").value();
  res.send(gift);
});

// 读取gift
server.get("/gift/:id", (req, res) => {
  const gift = db
    .get("gift")
    .find({ id: req.params.id })
    .value();
  res.send(gift);
});

// 添加gift
server.post("/gift", async (req, res) => {
  if (
    db
      .get("gift")
      .find({ id: req.body.id })
      .value()
  ) {
    res.send({ error: "id already exists" });
  } else {
    const gift = await db
      .get("gift")
      .push(req.body)
      .write();
    res.send(gift);
  }
});

// 修改gift
server.put("/gift", (req, res) => {
  const { id, name, score, enable } = req.body;
  const newgift = db
    .get("gift")
    .find({ id })
    .assign({ id, name, score, enable })
    .write();
  res.send(newgift);
});

// 删除gift
server.delete("/gift/:id", (req, res) => {
  const newgift = db
    .get("gift")
    .remove({ id: req.params.id })
    .write();
  res.send(newgift);
});

// 读取command
server.get("/command", (req, res) => {
  const command = db.get("command").value();
  res.send(command);
});

// 读取command
server.get("/command/:id", (req, res) => {
  const command = db
    .get("command")
    .find({ id: req.params.id })
    .value();
  res.send(command);
});

// 添加command
server.post("/command", async (req, res) => {
  if (
    db
      .get("command")
      .find({ id: req.body.id })
      .value()
  ) {
    res.send({ error: "command already exists" });
  } else {
    const command = await db
      .get("command")
      .push(req.body)
      .write();
    res.send(command);
  }
});

// 修改command
server.put("/command", (req, res) => {
  const { id, command, des } = req.body;
  const newcommand = db
    .get("command")
    .find({ id })
    .assign({ command, des })
    .write();
  res.send(newcommand);
});

// 删除command
server.delete("/command/:id", (req, res) => {
  const newcommand = db
    .get("command")
    .remove({ id: req.params.id })
    .write();
  res.send(newcommand);
});

// 读取user
server.get("/user", (req, res) => {
  const user = db.get("user").value();
  res.send(user);
});

// 读取user
server.get("/user/:id", (req, res) => {
  const user = db
    .get("user")
    .find({ id: req.params.id })
    .value();
  res.send(user);
});

// 读取user
server.get("/userbyusername/:username", (req, res) => {
  const user = db
    .get("user")
    .find({ username: req.params.username })
    .value();
  res.send(user);
});

// 添加user
server.post("/user", async (req, res) => {
  if (
    db
      .get("user")
      .find({ id: req.body.id })
      .value()
  ) {
    res.send({ error: "user already exists" });
  } else {
    const user = await db
      .get("user")
      .push(req.body)
      .write();
    res.send(user);
  }
});

// 修改user
server.put("/user", (req, res) => {
  let { id, username, score ,fishnumber} = req.body;
  fishnumber = Number(fishnumber)
  const newuser = db
    .get("user")
    .find({ id })
    .assign({ score })
    .assign({ fishnumber })
    .write();
  res.send(newuser);
});


// 修改fishnumber

// 删除user
server.delete("/user/:id", (req, res) => {
  const newuser = db
    .get("user")
    .remove({ id: req.params.id })
    .write();
  res.send(newuser);
});

// 读取defaultconfig
server.get("/defaultconfig", (req, res) => {
  const defaultconfig = db.get("defaultconfig").value();
  res.send(defaultconfig);
});

// 读取config
server.get("/config", (req, res) => {
  const config = db.get("config").value();
  res.send(config);
});

// 编辑config
server.post("/config", async (req, res) => {
  const config = await db.set("config", req.body).write();
  res.send(config);
});


// 查询积分
server.post("/check", async (req, res) => {
  const id = req.body.id;
  const user = await db
    .get("user")
    .find({ id })
    .value();
  const filedata = `[查询] ${user.username}\n当前总积分${user.score}\n当前鱼头${user.fishnumber}`;
  fs.appendFileSync(signfile, filedata);
  setTimeout(() => {
    delelastline(signfile);
  }, 3000);
  res.send(user);
});

// 签到
server.post("/sign", async (req, res) => {
  const id = req.body.id;
  const signtime = Number(req.body.now);

  const user = await db
    .get("user")
    .find({ id })
    .value();
  const lastsign = Number(user.lastsign);
  const oldscore = Number(user.score);

  const signstep = Number(await db.get("config.signconfig.signstep").value());
  const signscore = Number(await db.get("config.signconfig.signscore").value());
  if (!lastsign || signtime - lastsign > signstep * 1000 * 60) {
    const newscore = oldscore + signscore;
    const username = user.username;
    const filedata = `签到成功!\t${username}通过签到获取积分${signscore}分,总积分${newscore}\r\n`;
    fs.appendFile(signfile, filedata, (err) => {
      setTimeout(() => {
        delefirstline(signfile);
      }, 3000);
    });
    await db
      .get("user")
      .find({ id })
      .assign({ lastsign: signtime, score: newscore })
      .write();
    const newuser = await db
      .get("user")
      .find({ id })
      .value();
    res.send(newuser);
  } else {
    res.send({ error: "冷却中" });
  }
});


server.listen(3000, () => {
  console.log("listening on 3000");
  init()
});




function initfile() {
  fs.writeFileSync(timerfile,"12:00");
}

function delefirstline(filename:any) {
  if (fs.existsSync(filename)) {
    const filedata = fs.readFileSync(filename, { encoding: "utf-8" });
    let datalist = filedata.toString().split("\r\n");
    datalist = datalist.slice(1, datalist.length - 1);
    let newdata = "";
    for (let index in datalist) {
      newdata += datalist[index] + "\r\n";
    }
    fs.writeFileSync(filename, newdata);
  }
}

function delelastline(filename: any) {
  if (fs.existsSync(filename)) {
    const filedata = fs.readFileSync(filename, { encoding: "utf-8" });
    let datalist = filedata.toString().split("\r\n");
    datalist = datalist.slice(0, datalist.length - 2);
    let newdata = "";
    for (let index in datalist) {
      newdata += datalist[index] + "\r\n";
    }
    fs.writeFileSync(filename, newdata);
  }
}


async function init(){
  console.log('init in')
  initfile()
  // await savecsvfile()
}

export { db, server };
