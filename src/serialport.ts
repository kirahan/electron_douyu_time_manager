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

  // 断开触发
  cnn.on('error', function() {
    console.log('cnn error')
  })

  // Switches the port into "flowing mode"
  cnn.on('data', function (data) {
    
    const command = data.toString().split('/')[0]
    const number = data.toString().split('/')[1]
    console.log('Data:', command,number)
    if(command=='release'){
        axios.post(`http://localhost:3000/stage/release/${number}`)
    }
    
  })
  const str = 'hello'
  cnn.write(stringToHex(str))

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

// 发送数据
server.post("/serialport/send",async (req, res) => {
  const data = req.body.data
  console.log(req.body)
  if(cnn){
    cnn.write(stringToHex(data))
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
