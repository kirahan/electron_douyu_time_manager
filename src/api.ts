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

const obspath = path.join(debugpath, "/obstemplate");
const datapath = path.join(debugpath, "/data");

const fishfile = path.join(datapath,"/鱼头记录.csv")
const helpfile = path.join(obspath, "/帮助.txt");
const signfile = path.join(obspath, "/签到.txt");
const giftfile = path.join(obspath, "/礼物.txt");
const stage1file = path.join(obspath, "/上麦1.txt");
const stage2file = path.join(obspath, "/上麦2.txt");
const stage3file = path.join(obspath, "/上麦3.txt");
const stage4file = path.join(obspath, "/上麦4.txt");

const adapter = new FileSync(path.join(datapath, "/db.json"));
const db = low(adapter);

let stageloop;

db.defaults({
  gift: [],
  user: [],
  command: [],
  config: {},
  stage1:{},
  stage2:{},
  stage3:{},
  stage4:{},
  defaultconfig: {},
  version: "0.1.0",
}).write();




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
  const { id, username, score } = req.body;
  const newuser = db
    .get("user")
    .find({ id })
    .assign({ score })
    .write();
  res.send(newuser);
});

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

// 读取stage1
server.get("/stage1", (req, res) => {
  const state = db.get("stage1").value();
  res.send(state);
});
// 编辑stage1
server.post("/stage1", async (req, res) => {
  const config = await db.set("state1", req.body).write();
  res.send(config);
});
// 读取stage2
server.get("/stage2", (req, res) => {
  const state = db.get("stage2").value();
  res.send(state);
});
// 编辑stage2
server.post("/stage2", async (req, res) => {
  const config = await db.set("state2", req.body).write();
  res.send(config);
});
// 读取stage3
server.get("/stage3", (req, res) => {
  const state = db.get("stage3").value();
  res.send(state);
});
// 编辑stage3
server.post("/stage3", async (req, res) => {
  const config = await db.set("state2", req.body).write();
  res.send(config);
});
// 读取stage4
server.get("/stage4", (req, res) => {
  const state = db.get("stage4").value();
  res.send(state);
});
// 编辑stage4
server.post("/stage4", async (req, res) => {
  const config = await db.set("state2", req.body).write();
  res.send(config);
});

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

server.post("/catchgift", async (req, res) => {
  const id = req.body.id;
  const gfid = req.body.gfid;
  const giftdata = await db
    .get("gift")
    .find({ id: gfid })
    .value();
  const gfname = giftdata.name;
  const gfscore = Number(giftdata.score);
  const user = await db
    .get("user")
    .find({ id })
    .value();
  const oldscore = Number(user.score);

  if (giftdata && giftdata.enable) {
    const newscore = oldscore + gfscore;
    const addscore = await db
      .get("user")
      .find({ id })
      .assign({ score: newscore })
      .write();
    const filedata = `感谢${user.username}赠送的${gfname},获的${gfscore}积分,总积分${newscore}\r\n`;
    fs.appendFile(giftfile, filedata, (err) => {
      setTimeout(() => {
        delefirstline(giftfile);
      }, 3000);
    });
    res.send(addscore);
  } else {
    res.send({ error: "未知礼物" });
  }
});

server.post("/stage/onstage", async (req, res) => {
  const { id, stagename } = req.body;
  const stage = await db.get(stagename).value();
  if (stage.state == "idle") {
    await change2onstage({ id, stagename });
    res.send({success:true});
  }else{
    res.send({error:'not idel state'})
  }
});

server.post("/stage/catch", async (req, res) => {
  const { id } = req.body;
  const stageconfig = await db.get("config.stageconfig").value();
  const scorestep = await db.get("config.stageconfig.stagespendscore").value();
  const minscore = Number(stageconfig.stageminscore);
  const stage1id = await db.get("stage1.userid").value();
  const stage2id = await db.get("stage2.userid").value();
  const stage3id = await db.get("stage3.userid").value();
  const stage4id = await db.get("stage4.userid").value();
  let stagename = "";
  if (stage1id == id) {
    stagename = "stage1";
  } else if (stage2id == id) {
    stagename = "stage2";
  } else if (stage3id == id) {
    stagename = "stage3";
  }else if (stage4id == id) {
    stagename = "stage4";
  }else {
    stagename = "";
  }

  if (stagename) {
    const stage = await db.get(stagename).value();
    if (stage.state == "onstage") {
      const user = await db
        .get("user")
        .find({ id })
        .value();
      const userscore = Number(user.score);
      const newscore = userscore - scorestep;
      const newuser = await db
        .get("user")
        .find({ id })
        .assign({ score: newscore })
        .value();
      clearInterval(stageloop);
      // do catch
      if (newscore > minscore) {
        await db
          .get(stagename)
          .assign({ state: "catching" })
          .write();
      } else {
        await db
          .get(stagename)
          .assign({ state: "catchingthen2idle" })
          .write();
      }
      initfile(stagename, { username: user.username, score: newscore });
      res.send({ success: true });
      talktohw('catch', stagename);
    }else{
    res.send({ error: "unknown stage" });
    }
  }else{
    res.send({ error: "unknown user" });
  }
});

server.post("/stage/release/:stageindex", async (req, res) => {
  const stagename  = 'stage' + req.params.stageindex;
  const fishstate = req.body.state
  const stage = await db.get(stagename).value();
  const { state, userid } = stage;
  console.log(fishstate,state,userid)
  if (state == "catching") {
    // 抓到鱼了
    if(fishstate){
      const  fishnumber = db.get("user").find({id:userid}).value().fishnumber + 1
      await db
      .get("user")
      .find({id:userid})
      .assign({fishnumber})
      .write();
      // 重写fishnumber
      await savecsvfile()
    }
    await change2onstage({ id: userid, stagename });
    res.send({success:true});
  } else if (state == "catchingthen2idle") {
    // 抓到鱼了
    if(fishstate){
      const  fishnumber = db.get("user").find({id:userid}).value().fishnumber + 1
      await db
      .get("user")
      .find({id:userid})
      .assign({fishnumber})
      .write();
      // 重写fishnumber
      await savecsvfile()
    }
    // 修改状态
    await db
      .get(stagename)
      .assign({ state: "idle" })
      .write();
      await savecsvfile()    
      await initfile(stagename);

    res.send({success:true});
  }else{
    res.send({error:'unknow state'});
  }
});

server.post("/stage/offstage", async (req, res) => {
  const { id } = req.body;
  const stage1id = await db.get("stage1.userid").value();
  const stage2id = await db.get("stage2.userid").value();
  const stage3id = await db.get("stage3.userid").value();
  const stage4id = await db.get("stage4.userid").value();
  let stagename = "";
  if (stage1id == id) {
    stagename = "stage1";
  } else if (stage2id == id) {
    stagename = "stage2";
  } else if (stage3id == id) {
    stagename = "stage3";
  }else if (stage4id == id) {
    stagename = "stage4";
  }else {
    stagename = "";
  }
  if (stagename) {
    const stage = await db.get(stagename).value();
    if (stage.state == "onstage") {
      clearInterval(stageloop);
      await db
        .get(stagename)
        .assign({ state: "idle", userid: "" })
        .write();
      initfile(stagename);
      res.send({ success: "回到空闲状态" });
      talktohw('offstage', stagename);
    }else{
    res.send({ error: "不在上麦状态" });

    }
  }else{
  res.send({ error: "非上麦人消息" });

  }
});

server.post('/stage/setidle', async (req, res) => {
  await init();
  res.send({success: true, message:'set all stage to idel state'})
})


// 投食
server.post("/feedfish", async (req, res) => {
  const id = req.body.id;
  const user = await db
    .get("user")
    .find({ id })
    .value();
  const feedscore = Number(await db.get("config.stageconfig.feedscore").value());
  const oldscore = Number(user.score);

  if(user){
    if(oldscore >= feedscore) {
     const newscore = oldscore - feedscore;
     const filedata = `[投食] ${user.username}消耗积分${feedscore},剩余积分${newscore}`;
     const newuser = await db
        .get("user")
        .find({ id })
        .assign({ score: newscore })
        .value();
     fs.appendFileSync(signfile, filedata);
     setTimeout(() => {
       delelastline(signfile);
     }, 3000);
     res.send({success: true,message:'投食'});
     await talktohw('feedfish');
    }else{
      const filedata = `[投食]积分不足，需要消耗积分${feedscore},当前积分${oldscore}`;
     fs.appendFileSync(signfile, filedata);
     setTimeout(() => {
       delelastline(signfile);
     }, 3000);
      res.send({error:"no enough score"})
    }
  }else{
    res.send({error:"unknown user"})
  }
 
  
});





server.listen(3000, () => {
  console.log("listening on 3000");
  init()
});

async function change2onstage(data) {
  const { id, stagename } = data;
  const stageconfig = await db.get("config.stageconfig").value();
  const minscore = Number(stageconfig.stageminscore);
  const stageperiod = Number(stageconfig.stageperiod);
  const user = await db
    .get("user")
    .find({ id })
    .value();
  const userscore = Number(user.score);
  let filename
  if(stagename == "stage1"){
    filename = stage1file;
  }else if(stagename == "stage2"){
    filename = stage2file;
  }else if(stagename == "stage3"){
    filename = stage3file;
  }else if(stagename == "stage4"){
    filename = stage4file;
  }

  if (userscore > minscore) {
    await db
      .get(stagename)
      .assign({ state: "onstage", userid: id })
      .write();
    talktohw('onstage', stagename);
    let counter_start = Date.now();
    stageloop = setInterval(async () => {
      const now = Date.now() - counter_start;
      if (now < stageperiod * 1000) {
        fs.writeFileSync(filename, "");
        const filedata = stagetxttemplate({
          stage: stagename.split("stage")[1],
          state: "onstage",
          username: user.username,
          counter: Math.floor(stageperiod - now / 1000),
          score: userscore,
        });
        fs.appendFileSync(filename, filedata);
      } else {
        clearInterval(stageloop);
        await db
          .get(stagename)
          .assign({ state: "idle", userid: "" })
          .write();
        initfile(stagename);
      }
    }, 500);
  } else {
    const errormessage = `积分不足，最低积分${minscore}，您只有${userscore}\r\n`;
    fs.appendFileSync(filename, errormessage);
    setTimeout(() => {
      delelastline(filename);
    }, 3000);
  }
}

function initfile(stagename, data?: {}) {
  let filename
  if(stagename == "stage1"){
    filename = stage1file;
  }else if(stagename == "stage2"){
    filename = stage2file;
  }else if(stagename == "stage3"){
    filename = stage3file;
  }else if(stagename == "stage4"){
    filename = stage4file;
  }
  const stagestate = db.get(`${stagename}.state`).value();
  fs.writeFileSync(
    filename,
    stagetxttemplate({
      stage: stagename.split("stage")[1],
      state: stagestate,
      ...data,
    })
  );
}

function stagetxttemplate(data) {
  const { stage, state, username, counter, score } = data;
  const scorestep = db.get("config.stageconfig.stagespendscore").value();
  if (state == "idle") {
    return `舞台${stage}\r\n当前:\t\t空闲\r\n`;
  } else if (state == "onstage") {
    if (counter < 10 && counter % 2 == 0) {
      return `舞台${stage}  请尽快操作否则将会自动下麦\r\n当前:    ${username}\r\n倒计时:    ${counter}\r\n单次记分:  ${scorestep}\r\n剩余积分:  ${score}\r\n`;
    } else {
      return `舞台${stage}\r\n当前:    \t\t${username}\r\n倒计时:    ${counter}\r\n单次记分:  ${scorestep}\r\n剩余积分:  ${score}\r\n`;
    }
  } else if (state == "catching") {
    return `舞台${stage}\r\n当前:    \t\t${username}\r\n状态:    正在抓取..\r\n单次记分:  ${scorestep}\r\n剩余积分:  ${score}\r\n`;
  } else if (state == "catchingthen2idle") {
    return `积分不足抓取结束后将自动下麦\r\n舞台${stage}\r\n当前:    \t\t${username}\r\n状态:    正在抓取..\r\n单次记分:  ${scorestep}\r\n剩余积分:  ${score}\r\n`;
  }else{
    return "unknown state"
  }
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

async function savecsvfile(){
  // const users = await db.get("user").fliter(o=>o.fishnumber>0).sortBy("fishnumber").value()
  // 手写fishnumber排序
  const users = await db.get("user").sort((m,n)=>{return n.fishnumber-m.fishnumber}).filter(o=>o.fishnumber).value()
  // 细节坑 必须加个前缀\ufeff表示 这是一个表头，就可以在excel中正常显示中文了
  let csvdata  =  '\ufeff用户名,ID,鱼头数,积分\n'
  // 存在鱼头数大于0的用户
  if(users){
    for(let index in users){
      const user  = users[index]
      const {id, username,score,fishnumber} =   user
      const datastring = `${username},${id},${fishnumber},${score}\n`
      csvdata += datastring
    }

    fs.writeFileSync(fishfile,csvdata,{encoding:'utf-8'})
  }
  
}


async function talktohw(type:string,stagename?:string){
  const hwconfig =  await db.get('config.hwconfig').value();
  const {hwport,hwonstage,hwcatch,hwfeedfish,hwoffstage} = hwconfig;
  const stageindex = stagename? stagename.split('stage')[1]:''
  let hwurl = 'http://localhost:' + `${hwport}/`
  if(type=='onstage'){
    hwurl += `${hwonstage}/${stageindex}`
  }else if(type=='offstage'){
    hwurl += `${hwoffstage}/${stageindex}`
  }else if(type=='catch'){
    hwurl += `${hwcatch}/${stageindex}`
  }else if(type=='feedfish'){
    hwurl += `${hwfeedfish}`
  }
  let spsendurl = 'http://localhost:3000/serialport/send'
  let spsenddata = ''
  if(type=='onstage'){
    spsenddata = `${hwonstage}/${stageindex}`
  }else if(type=='offstage'){
    spsenddata = `${hwoffstage}/${stageindex}`
  }else if(type=='catch'){
    spsenddata = `${hwcatch}/${stageindex}`
  }else if(type=='feedfish'){
    spsenddata = `${hwfeedfish}`
  }
  console.log(hwurl);
  console.log(spsenddata);
  try{
    axios.get(hwurl).catch(err => {
      console.log('error')
    })
    axios.post(spsendurl,{data:spsenddata}).catch(err => {
      console.log('error')
    })
  }catch(err){
    console.log(err)
  };
}

async function init(){
  console.log('init in')
  await db.get("stage1").assign({state:'idle',userid:''}).write()
  await db.get("stage2").assign({state:'idle',userid:''}).write()
  await db.get("stage3").assign({state:'idle',userid:''}).write()
  await db.get("stage4").assign({state:'idle',userid:''}).write()
  await initfile('stage1')
  await initfile('stage2')
  await initfile('stage3')
  await initfile('stage4')
  await savecsvfile()
}


export { db, server };
