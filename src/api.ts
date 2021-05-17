const express = require("express");
const bodyParser = require("body-parser");
const low = require("lowdb");
import { ipcMain } from "electron";

const FileSync = require("lowdb/adapters/FileSync");
import fs from "fs-extra";
import path from "path";
import axios from "axios";
// creater server
const server = express();
server.use(bodyParser.json());
server.use(require("cors")());
const isDevelopment = process.env.NODE_ENV !== "production";
const debugpath = isDevelopment ? __dirname : process.cwd();

const datapath = path.join(debugpath, "/data");

const timerfile = path.join(datapath, "/timer.txt");

// 数据库
const adapter = new FileSync(path.join(datapath, "/db.json"));
const db = low(adapter);

// 斗鱼礼物数据库
const douyu_adapter = new FileSync(path.join(datapath, "/gift.json"));
const douyu_db = low(douyu_adapter);

let obs_timer_loopid = null;
let obs_timer_first_timestamp = Date.now();

db.defaults({
  gift: [],
  user: [],
  command: [],
  config: {},
  defaultconfig: {},
  danmu: {},
  version: "0.1.0",
}).write();

server.get("/douyugiftlist", (req, res) => {
  const giftlist = douyu_db.value();
  let giftarray = [];
  for (let index in giftlist) {
    giftarray.push(giftlist[index]);
  }
  res.send(giftarray);
});

server.get("/douyugiftobj", (req, res) => {
  const giftlist = douyu_db.value();
  res.send(giftlist);
});

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
  const { id, name, price, timevalue, enable } = req.body;
  const newgift = db
    .get("gift")
    .find({ id })
    .assign({ id, name, price, timevalue, enable })
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
  let { id, username, score, fishnumber } = req.body;
  fishnumber = Number(fishnumber);
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


// 修改gift
server.post("/addcustomgift", async (req, res) => {
  const {id,name} = req.body
  console.log(req.body)
  const config = await douyu_db.set(id, req.body).write();
  res.send(config);
});

// 控制时间
server.post("changetime", async (req, res) => {
  const d_time = Number(req.body.dtime);
  const oldtime = await db.get("timergap").value();
  const newtime = await db.set("timergap", oldtime + d_time).write();
  res.send(newtime);
});

function changetime(dtime) {
  const d_time = Number(dtime);
  const oldtime = db.get("timergap").value();
  const newtime = db.set("timergap", oldtime + d_time).write();
}

//检测到关注上升
server.post("/followsup", async (req, res) => {
  console.log("关注上涨");
  const newfol = req.body.follownumber;
  const oldfol = await db.get("follows").value();
  const followaddtime =
    (await db.get("config.timerconfig.followaddtime").value()) * 60;

  if (Number(newfol) - Number(oldfol) > 0) {
    changetime(followaddtime);
    res.send(true);
  } else {
    res.send({ error: "未知礼物" });
  }
});

// 收到礼物
server.post("/catchgift", async (req, res) => {
  console.log("获取礼物");
  const gfid = req.body.gfid;
  const gfcnt = req.body.gfcnt || 1;
  const giftdata = await db
    .get("gift")
    .find({ id: gfid })
    .value();

  if (giftdata && giftdata.enable) {
    const gftime = Number(giftdata.timevalue) * 60 * gfcnt;
    changetime(gftime);
    res.send(true);
  } else {
    res.send({ error: "未知礼物" });
  }
});

let apichannel = null;

// 握手
ipcMain.on("api-client-init", (event, arg) => {
  console.log(arg); // prints "ping"
  apichannel = event;
  event.reply("api-server-save-client-channel", "pong");
});

server.get("/timer/start", async (req, res) => {
  // 控制计时器
  let first_time = db.get("timer").value();
  obs_timer_first_timestamp = Date.now();
  obs_timer_loopid = setInterval(() => {
    const timestamp = Date.now();
    const gap = (timestamp - obs_timer_first_timestamp) / 1000;
    const timer_gap = db.get("timergap").value();

    const realtime = first_time + timer_gap - gap;
    // console.log('[first_time]',first_time)
    // console.log('[gap]',gap)
    // console.log('[timer_gap]',timer_gap)
    // console.log('[realtime]',realtime)
    formatTime(realtime);
  }, 33);
  res.send(true);
});
server.get("/timer/pause", async (req, res) => {
  clearInterval(obs_timer_loopid);
  res.send(true);
});
server.get("/timer/reset", async (req, res) => {
  clearInterval(obs_timer_loopid);
  initfile();
  res.send(true);
});

server.post("/timer/change", async (req, res) => {
  const newtimer = req.body.time;
  let starttime = newtimer * 60;
  db.set("timer", starttime).write();
  db.set("timergap", 0).write();
  formatTime(starttime);
  res.send(true);
});

function formatTime(timevalue) {
  const format = db.get("config.timerconfig.timerformat").value();
  const t_value = Math.floor(Number(timevalue));
  const sec_part =
    t_value % 60 > 9
      ? (t_value % 60).toString()
      : "0" + (t_value % 60).toString();
  const min_part =
    (t_value % 3600) / 60 < 9 && t_value > 3600
      ? "0" + Math.floor((t_value % 3600) / 60).toString()
      : Math.floor((t_value % 3600) / 60).toString();
  const hour_part =
    t_value < 3600 ? undefined : Math.floor(t_value / 3600).toString();
  let finnal_string = "";
  let format_text = [];
  switch (format) {
    case 0:
      format_text = [":", ":"];
      if (hour_part) {
        finnal_string = `${hour_part}${format_text[0]}${min_part}${format_text[1]}${sec_part}`;
      } else {
        finnal_string = `${min_part}${format_text[1]}${sec_part}`;
      }
      break;
    case 1:
      format_text = [":"];
      if (hour_part) {
        finnal_string = `${hour_part}${format_text[0]}${min_part}`;
      } else {
        finnal_string = `${min_part}`;
      }
      break;
    case 2:
      format_text = ["小时", "分钟", "秒"];
      if (hour_part) {
        finnal_string = `${hour_part}${format_text[0]}${min_part}${format_text[1]}${sec_part}${format_text[2]}`;
      } else {
        finnal_string = `${min_part}${format_text[1]}${sec_part}${format_text[2]}`;
      }
      break;
    case 3:
      format_text = ["小时", "分钟"];
      if (hour_part) {
        finnal_string = `${hour_part}${format_text[0]}${min_part}${format_text[1]}`;
      } else {
        finnal_string = `${min_part}${format_text[1]}`;
      }
      break;
  }

  if (apichannel) {
    apichannel.reply("update-timer-data", finnal_string);
  }
  fs.writeFileSync(timerfile, finnal_string);
}

server.listen(3000, () => {
  console.log("listening on 3000");
  init();
});

function initfile() {
  let starttime = db.get("config.timerconfig.starttime").value() * 60;
  db.set("timer", starttime).write();
  db.set("timergap", 0).write();
  formatTime(starttime);
}

function delefirstline(filename: any) {
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

async function init() {
  console.log("init in");
  initfile();
  // await savecsvfile()
}

export { db, server };
