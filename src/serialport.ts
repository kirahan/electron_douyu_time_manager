import axios from 'axios'
const sp =  (server,db) =>{
    const serialport =  require("serialport");
    let cnn = null
    const endflag = db.get("config.hwconfig.hwendflag").value()  

// 获取串口列表
server.get("/serialport", async (req, res) => {
  const ports = await serialport.list()
  if(ports){
    res.send({data:ports})
  }
  else{
    res.send({data:ports,error:"no com port"});
  }
});


// 获取串口配置
server.get("/serialport/configport", async (req, res) => {
  const port = db.get("config.hwconfig").value();
  res.send(port);
});

// 获取串口是否工作
server.get("/serialport/iscnn", async (req, res) => {
  if(cnn){
    res.send({cnn:cnn,isOpen:cnn.isOpen,path:cnn.path,binding:cnn.binding,baudRate:cnn.baudRate});
  }else{
    res.send({cnn:false,message:'未连接'})
  }
  
});


// 链接某个串口
server.post("/serialport/cnn", async (req, res) => {
  const  {port, baudrate} = req.body
  console.log('cnn seriialport',port, baudrate,cnn==null?'未连接串口':`之前已经连接过串口编号${cnn.path}`)
  cnn =  new  serialport(port,{
    baudRate : Number(baudrate),
  },(err)=>{
    // console.log(err)
    return res.send({data:[],error:err})
  })
  // 成功连接触发
  cnn.on('open', function() {
    console.log('cnn success')
  })

  // 断开触发
  cnn.on('close', function() {
    console.log('cnn closed')
  })

  // 错误触发
  cnn.on('error', function(err) {
    console.log('cnn error',err.message)
  })

  // Switches the port into "flowing mode"
  cnn.on('data', function (data) {
    
    const command = data.toString().split('/')[0]
    const number = data.toString().split('/')[1]
    const state = data.toString().split('/')[2].trim()
    console.log('Data:', command,number,state,state=='success')
    if(command=='release'){
        if(state=='success'){
          axios.post(`http://localhost:3000/stage/release/${number}`,{state:true})
          
        }else{
          axios.post(`http://localhost:3000/stage/release/${number}`,{state:false})
        }
    }
    
  })
  const str = 'hello'
  cnn.write(str)

  // return res.send({data:[],success:true})

});


function stringToHex(str){
  　　　　 var val= "";
  　　　　 for(var i = 0; i < str.length; i++){
  　　　　　　 if(val == "")
  　　　　　　　　 val = str.charCodeAt(i).toString(16);
  　　　　　　 else
  　　　　　　　　 val += str.charCodeAt(i).toString(16);
  　　　　 }
          val += endflag
  　　　　 return val;
}

function HexTostring(hexCharCodeStr){

    　　var trimedStr = hexCharCodeStr.trim();
    　　var rawStr =
    　　trimedStr.substr(0,2).toLowerCase() === "0x"
    　　?
    　　trimedStr.substr(2)
    　　:
    　　trimedStr;
    　　var len = rawStr.length;
    　　if(len % 2 !== 0) {
    　　　　alert("Illegal Format ASCII Code!");
    　　　　return "";
    　　}
    　　var curCharCode;
    　　var resultStr = [];
    　　for(var i = 0; i < len;i = i + 2) {
    　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    　　　　resultStr.push(String.fromCharCode(curCharCode));
    　　}
    　　return resultStr.join("");
}

// 发送数据
server.post("/serialport/send",async (req, res) => {
  const data = req.body.data
  console.log(req.body)
  if(cnn){
    // console.log('发送串口数据',data+endflag)
    console.log('发送串口数据',data+HexTostring(endflag))
    // cnn.write(stringToHex(data))
    cnn.write(data+HexTostring(endflag))
    res.send({success:true})
  }else{
    res.send({error:'没有连接'})
  }
})

// 关闭串口
server.get("/serialport/close", async (req, res) => {
  if(cnn){
    cnn.close((err)=>{
      console.log(err)
      res.send({success:true})
    });
  }else{
    res.send({error:'没有连接'})
  }
})

}

export default sp
