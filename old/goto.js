var values = {};
var nums = ["0","1","2","3","4","5","6","7","8","9","."];
var notValue = ["*","/","-","+","!","?","<",">","=","%","#"];
function goto(Program,Input){
  var program = Program;
  var code = program.split("\n");
  var output = [];
  var input = Input.split("\n");
  var labels = {}
  var line,n,i,k,l,w;
  var time = Date.now();
  values = {"true":true,
            "false":false,
            "und":undefined,
            "inf":Infinity,
            "limit":2000};
  n=0
  while(n < code.length){
    if(code[n].startsWith("#define")){
      line = code[n].split(" ");
      program = program.split(line[1]).join(line[2]);
      code = program.split("\n");
    }
    n++;
  }
  n=0;
  while(true){
    i = program.indexOf("//",n);
    k = program.indexOf("/*",n);
    if(i == -1 && k == -1){
      break;
    }else if(i == -1 || (k < i && k!= -1)){
      i = program.lastIndexOf("\n",k);
      line = program.slice(i,k);
      if((strCount(line,'"')-strCount(line,'\\"'))%2==0){
        i = program.indexOf("*/",k);
        program = program.slice(0,k) + program.slice(i+2);
      }else{
        n=k+2;
      }
    }else if(k == -1 || (i < k && i!= -1)){
      k = program.lastIndexOf("\n",i);
      line = program.slice(k,i);
      if((strCount(line,'"')-strCount(line,'\\"'))%2==0){
        k = program.indexOf("\n",i);
        program = program.slice(0,i) + program.slice(k);
      }else{
        n=i+2;
      }
    }
    if(Date.now()>time+values.limit){
      output.push({type:"Runtime error",
                     line:n,
                     text:"Time is limit"
                     });
      break;
    }
  }
  code = program.split("\n");
  n = 0;
  while(n < code.length){
    line = code[n];
    if(line.startsWith(" ")){
      output.push({type:"syntax error",
                   line:n,
                   text:"The line can't start with space"
                   });
    }else if(line.startsWith('"')){
      if(line.endsWith(':')){
        i=line.indexOf('"',1);
        if(i != -1){
          labels[line.slice(0,i+1)]=n;
        }else{
          output.push({type:"syntax error",
                     line:n,
                     text:"Can't find end of str"
                     });
        }
      }else{
        output.push({type:"syntax error",
                     line:n,
                     text:"The line making label must end with \":\""
                     });
      }
    }
    if(Date.now()>time+values.limit){
      output.push({type:"Runtime error",
                     line:n,
                     text:"Time is limit"
                     });
      break;
    }
    n++;
  }
  n = 0;
  while(n < code.length){
    if(code[n].startsWith("#")){
      n++;
      continue;
    }
    if(code[n].endsWith(";")){
      line = code[n];
      if(line.includes(" when ")){
        l = line.slice(0,line.indexOf("when"));
        if((strCount(l,'"')-strCount(l,'\\"'))%2 === 0){
          i=calc(line.slice(line.indexOf(" ",line.indexOf("when")),-1));
          if(!i){
            n++;
            continue;
          }
          w=calc(line.slice(line.indexOf(" "),line.indexOf("when")));
        }else{
          if(line.includes(" ")){
            w=calc(line.slice(line.indexOf(" "),-1));
          }
        }
      }else if(line.includes(" ")){
        w=calc(line.slice(line.indexOf(" "),-1));
      }
      if(line.startsWith("goto")){
        if(labels.hasOwnProperty(w)){
          n = labels[w];
        }else{
          output.push({type:"reference error",
                       line:n,
                       text:"Can't find "+w+" as label name"
                       });
        }
      }else if(line.startsWith("goout")){
        output.push({type:"output",
                     line:n,
                     text:String(w)
                     });
      }else if(line.startsWith("getto")){
        i=line.indexOf(" ");
        values[line.slice(i+1,line.indexOf(" ",i+1))] = input[0];
        input.shift();
      }else if(line.includes("=")){
        if(line.indexOf(" ")<line.indexOf("=")&&line.includes(" ")){
          i=line.slice(0,line.indexOf(" "));
        }else{
          i=line.slice(0,line.indexOf("="));
        }
        console.log(i);
        values[i]=calc(line.slice(line.indexOf("=")+1,-1));
        console.log(values);
      }else{
        output.push({type:"syntax error",
                     line:n,
                     text:"Cant find "+line.slice(0,line.indexOf(" "))
                     });
      }
    }else{
      if(!code[n].endsWith(":")){
        output.push({type:"syntax error",
                     line:n,
                     text:"The line must end with \";\""
                     });
      }
    }
    if(Date.now()>time+values.limit){
      output.push({type:"Runtime error",
                     line:n,
                     text:"Time is limit"
                     });
      break;
    }
    n++;
  }
  return output;
}

function strCount(s,q){
  var m = 0;
  var a = 0;
  while(m!=-1){
    m=s.indexOf(q,m+1);
    if(m != -1){
      a++;
    }else{
      break;
    }
  }
  return a;
}

function calc(st){
  var sl = [],type="",h=0,j,u,s=st;
  function assignment(){
    if(type=="num"){
      sl[sl.length-1]=Number(sl[sl.length-1]);
    }else if(type=="value"){
      if(typeof(values[sl[sl.length-1]])=="string"){
        sl[sl.length-1]='"'+values[sl[sl.length-1]]+'"';
      }else{
        sl[sl.length-1]=values[sl[sl.length-1]];
      }
    }
  }
  for(var m = 0;m<s.length;m++){
    if(type=="str"){
      if(s[m]=='"' && s[m-1]!="\\"){
        sl[sl.length-1]+=s[m];
        type="";
        continue;
      }else{
        sl[sl.length-1]+=s[m];
      }
    }else if(s[m]==" "){
      assignment();
      type="";
      continue;
    }else if(s[m]=="("){
      assignment();
      sl[sl.length]=s[m];
      type="";
      continue;
    }else if(s[m]==")"){
      assignment();
      sl[sl.length]=s[m];
      type="";
      continue;
    }else if(type=="value"){
      if(notValue.includes(s[m])){
        type="";
        if(typeof(values[sl[sl.length-1]])=="string"){
          sl[sl.length-1]='"'+values[sl[sl.length-1]]+'"';
        }else{
          sl[sl.length-1]=values[sl[sl.length-1]];
        }
      }else{
        sl[sl.length-1]+=s[m];
      }
    }else if(type=="num"){
      if(nums.includes(s[m])){
        sl[sl.length-1]+=s[m];
      }else{
        sl[sl.length-1]=Number(sl[sl.length-1]);
        type="";
      }
    }else if(type=="calc"){
      if(notValue.includes(s[m])){
        sl[sl.length-1]+=s[m];
      }else{
        type="";
      }
    }
    if(type===""){
      if(nums.includes(s[m])){
        type="num";
        sl[sl.length]=s[m];
      }else if(notValue.includes(s[m])){
        type="calc";
        sl[sl.length]=s[m];
      }else if(s[m]=='"'){
        type="str";
        sl[sl.length]=s[m];
      }else{
        type="value";
        sl[sl.length]=s[m];
      }
    }
  }
  assignment();
  console.log(sl);
  console.log(values);
  while(true){
    if(sl.includes("(")){
      j=sl.indexOf("(",h);
      u=sl.indexOf(")",j+1);
      if(sl.indexOf("(",j+1)>u||sl.indexOf("(",j+1)==-1){
        sl.splice(j,u-j+1,culcLine(sl.slice(j+1,u)));
      }else{
        h=j+1;
        continue;
      }
    }else{
      return culcLine(sl);
      break;
    }
  }
}
function culcLine(s){
  var sl = s,h,j,u;
  while(sl.length>1){
    for(var q = 0;q<sl.length;q++){
      console.log(sl);
      if(sl[q]=="!"){
        if(typeof(sl[q-1])=="string" && sl[q-1].startsWith('"')){
          sl[q-1]=sl[q-1].slice(1,-1);
        }
        sl.splice(q-1,2,Number(sl[q-1]));
        q--;
      }else if(sl[q]=="?"){
        if(typeof(sl[q-1])=="string" && sl[q-1].startsWith('"')){
          sl[q-1]=sl[q-1].slice(1,-1);
        }
        sl.splice(q-1,2,'"'+String(sl[q-1])+'"');
        q--;
      }else if(sl[q]=="#"){
        if(typeof(sl[q-1])=="string" && sl[q-1].startsWith('"')){
          sl[q-1]=sl[q-1].slice(1,-1);
        }
        sl.splice(i-1,3,'"'+String(sl[i-1])[sl[i+1]]+'"');
        q--;
      }else if(sl[q]=="="){
        sl=["ERROR"];
        break;
      }
    }
    for(var q=0;q<sl.length;q++){
      console.log(sl);
      if(sl[q]=="**"){
        if(typeof(sl[q-1])=="string"||typeof(sl[q+1])=="string"){
          sl=["ERROR"];
        }else{
          sl.splice(q-1,3,sl[q-1]**sl[q+1]);
          q--;
        }
      }
    }
    for(var q=0;q<sl.length;q++){
      console.log(sl);
      if(sl[q]=="*"){
        if(typeof(sl[q+1])=="string"){
          sl=["ERROR"];
        }else if(typeof(sl[q-1])=="string"){
          if(sl[q-1].startsWith('"')){
            sl[q-1]=sl[q-1].slice(1,-1);
            sl.splice(q-1,2,sl[q-1].repeat(sl[q+1]));
            q--;
          }else{
            sl=["ERROR"];
          }
        }else{
          sl.splice(q-1,3,sl[q-1]*sl[q+1]);
          q--;
        }
      }else if(sl[q]=="/"){
        if(typeof(sl[q-1])=="string"||typeof(sl[q+1])=="string"){
          sl=["ERROR"];
        }else{
          sl.splice(q-1,3,sl[q-1]/sl[q+1]);
          q--;
        }
      }else if(sl[q]=="%"){
        if(typeof(sl[q-1])=="string"||typeof(sl[q+1])=="string"){
          sl=["ERROR"];
        }else{
          sl.splice(q-1,3,sl[q-1]%sl[q+1]);
          q--;
        }
      }
    }
    for(var q=0;q<sl.length;q++){
      console.log(sl);
      if(sl[q]=="+"){
        if(typeof(sl[q-1])=="string" && sl[q-1].startsWith('"')){ 
          sl[q-1]=sl[q-1].slice(1,-1);
        }
        if(typeof(sl[q+1])=="string" && sl[q+1].startsWith('"')){
          sl[q+1]=sl[q+1].slice(1,-1);
        }
        sl.splice(q-1,3,sl[q-1]+sl[q+1]);
        q--;
      }else if(sl[q]=="-"){
        if(typeof(sl[q-1])=="string"||typeof(sl[q+1])=="string"){
          sl=["ERROR"];
        }else{
          sl.splice(q-1,3,sl[q-1]-sl[q+1]);
          q--;
        }
      }
    }
    for(var q=0;q<sl.length;q++){
      console.log(sl);
      if(sl[q]=="=="){
        sl.splice(q-1,3,sl[q-1]===sl[q+1]);
        q--;
      }else if(sl[q]=="!="){
        sl.splice(q-1,3,sl[q-1]!==sl[q+1]);
        q--;
      }else if(sl[q]=="<"){
        if(typeof(sl[q-1])=="string"||typeof(sl[q+1])=="string"){
          sl=["ERROR"];
        }else{
          sl.splice(q-1,3,sl[q-1]<sl[q+1]);
          q--;
        }
      }else if(sl[q]=="<="){
        if(typeof(sl[q-1])=="string"||typeof(sl[q+1])=="string"){
          sl=["ERROR"];
        }else{
          sl.splice(q-1,3,sl[q-1]<=sl[q+1]);
          q--;
        }
      }else if(sl[q]==">"){
        if(typeof(sl[q-1])=="string"||typeof(sl[q+1])=="string"){
          sl=["ERROR"];
        }else{
          sl.splice(q-1,3,sl[q-1]>sl[q+1]);
          q--;
        }
      }else if(sl[q]==">="){
        if(typeof(sl[q-1])=="string"||typeof(sl[q+1])=="string"){
          sl=["ERROR"];
        }else{
          sl.splice(q-1,3,sl[q-1]>=sl[q+1]);
          q--;
        }
      }
    }
  }
  return sl[0];
}
function run(){
  document.getElementById("output").value="";
  var c=document.getElementById("code").value;
  var inp = document.getElementById("input").value;
  var ou=document.getElementById("output");
  var out = goto(c,inp);
  for(var r in out){
    if(out[r].text.startsWith('"')){
      out[r].text=out[r].text.slice(1,-1);
    }
    ou.value+="\n"+out[r].type+": Line "+out[r].line+" : "+out[r].text;
  }
}
