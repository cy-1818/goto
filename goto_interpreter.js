({
	"values":{},
	"nums":["0","1","2","3","4","5","6","7","8","9","."],
	"notValue":["*","/","-","+","!","?","<",">","=","%","#"],
	"main":(async function(Program){
	  var program = Program.trim();
	  var code = program.split("\n");
	  var labels = {};
	  var line,n,i,k,l,w;
	  var time = Date.now();
	  this.values = {
	    "true":true,
	    "false":false,
	    "und":undefined,
	    "inf":Infinity,
	    "limit":2000
	  };
	  this.setUp();
	  n=0;
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
	      if((this.strCount(line,'"')-this.strCount(line,'\\"'))%2==0){
	        i = program.indexOf("*/",k);
	        program = program.slice(0,k) + program.slice(i+2);
	      }else{
	        n=k+2;
	      }
	    }else if(k == -1 || (i < k && i!= -1)){
	      k = program.lastIndexOf("\n",i);
	      line = program.slice(k,i);
	      if((this.strCount(line,'"')-this.strCount(line,'\\"'))%2==0){
	        k = program.indexOf("\n",i);
	        program = program.slice(0,i) + program.slice(k);
	      }else{
	        n=i+2;
	      }
	    }
	    if(Date.now()>time+this.values.limit){
	      await this.printOutput({
	        type:"Runtime error",
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
	      await this.printOutput({
	        type:"syntax error",
	        line:n,
	        text:"The line can't start with space"
	      });
	    }else if(line.startsWith('"')){
	      if(line.endsWith(':')){
	        i=line.indexOf('"',1);
	        if(i != -1){
	          labels[line.slice(0,i+1)]=n;
	        }else{
	          await this.printOutput({
	            type:"syntax error",
	            line:n,
	            text:"Can't find end of str"
	          });
	        }
	      }else{
	        await this.printOutput({
	          type:"syntax error",
	          line:n,
	          text:"The line making label must end with \":\""
	        });
	      }
	    }
	    if(Date.now()>time+this.values.limit){
	      await this.printOutput({
	        type:"Runtime error",
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
	        if((this.strCount(l,'"')-this.strCount(l,'\\"'))%2 === 0){
	          i=this.calc(line.slice(line.indexOf(" ",line.indexOf("when")),-1));
	          if(!i){
	            n++;
	            continue;
	          }
	          w=this.calc(line.slice(line.indexOf(" "),line.indexOf("when")));
	        }else{
	          if(line.includes(" ")){
	            w=this.calc(line.slice(line.indexOf(" "),-1));
	          }
	        }
	      }else if(line.includes(" ")){
	        w=this.calc(line.slice(line.indexOf(" "),-1));
	      }
	      if(line.startsWith("goto")){
	        if(labels.hasOwnProperty(w)){
	          n = labels[w];
	        }else{
	          await this.printOutput({
	            type:"reference error",
	            line:n,
	            text:"Can't find "+w+" as label name"
	          });
	        }
	      }else if(line.startsWith("goout")){
	        await this.printOutput({
	          type:"output",
	          line:n,
	          text:String(w)
	        });
	      }else if(line.startsWith("getto")){
	        i=line.indexOf(" ");
	        this.values[line.slice(i+1,line.indexOf(" ",i+1))] = await this.getInput();
	      }else if(line.includes("=")){
	        if(line.indexOf(" ")<line.indexOf("=")&&line.includes(" ")){
	          i=line.slice(0,line.indexOf(" "));
	        }else{
	          i=line.slice(0,line.indexOf("="));
	        }
	        this.values[i]=this.calc(line.slice(line.indexOf("=")+1,-1));
	      }else{
	        await this.printOutput({
	          type:"syntax error",
	          line:n,
	          text:"Cant find "+line.slice(0,line.indexOf(" "))
	        });
	      }
	    }else{
	      if(!code[n].endsWith(":")){
	        await this.printOutput({
	          type:"syntax error",
	          line:n,
	          text:"The line must end with \";\""
	        });
	      }
	    }
	    if(Date.now()>time+this.values.limit){
	      await this.printOutput({
	        type:"Runtime error",
	        line:n,
	        text:"Time is limit"
	      });
	      break;
	    }
	    n++;
	  }
	  return this.End();
	}),
	"strCount":function(s,q){
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
	},
	"assignment":function(asl, atype){
	  if(atype=="num"){
	    asl[asl.length-1]=Number(asl[asl.length-1]);
	  }else if(atype=="value"){
	    asl[asl.length-1]=this.values[asl[asl.length-1]];
	  }
	  return asl;
	},
	"calc":function(st){
	  var sl = [],type="",h=0,j,u,s=st;
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
	      sl = this.assignment(sl, type);
	      type="";
	      continue;
	    }else if(s[m]=="("){
	      sl = this.assignment(sl, type);
	      sl[sl.length]=s[m];
	      type="";
	      continue;
	    }else if(s[m]==")"){
	      sl = this.assignment(sl, type);
	      sl[sl.length]=s[m];
	      type="";
	      continue;
	    }else if(type=="value"){
	      if(this.notValue.includes(s[m])){
	        type="";
	        sl[sl.length-1]=this.values[sl[sl.length-1]];
	      }else{
	        sl[sl.length-1]+=s[m];
	      }
	    }else if(type=="num"){
	      if(this.nums.includes(s[m])){
	        sl[sl.length-1]+=s[m];
	      }else{
	        sl[sl.length-1]=Number(sl[sl.length-1]);
	        type="";
	      }
	    }else if(type=="calc"){
	      if(this.notValue.includes(s[m])){
	        sl[sl.length-1]+=s[m];
	      }else{
	        type="";
	      }
	    }
	    if(type===""){
	      if(this.nums.includes(s[m])){
	        type="num";
	        sl[sl.length]=s[m];
	      }else if(this.notValue.includes(s[m])){
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
	  sl = this.assignment(sl, type);
	  while(true){
	    if(sl.includes("(")){
	      j=sl.indexOf("(",h);
	      u=sl.indexOf(")",j+1);
	      if(sl.indexOf("(",j+1)>u||sl.indexOf("(",j+1)==-1){
	        sl.splice(j,u-j+1,this.culcLine(sl.slice(j+1,u)));
	      }else{
	        h=j+1;
	        continue;
	      }
	    }else{
	      return this.culcLine(sl);
	      break;
	    }
	  }
	},
	"culcLine":function(s){
	  var sl = s,h,j,u;
	  while(sl.length>1){
	    for(var q = 0;q<sl.length;q++){
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
	        sl.splice(q-1,2,String(sl[q-1]));
	        q--;
	      }else if(sl[q]=="#"){
	        if(typeof(sl[q-1])=="string" && sl[q-1].startsWith('"')){
	          sl[q-1]=sl[q-1].slice(1,-1);
	        }
	        sl.splice(q-1,3,String(sl[q-1])[sl[q+1]]);
	        q--;
	      }else if(sl[q]=="="){
	        sl=["ERROR"];
	        break;
	      }
	    }
	    for(var q=0;q<sl.length;q++){
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
	      if(sl[q]=="*"){
	        if(typeof(sl[q+1])=="string"){
	          sl=["ERROR"];
	        }else if(typeof(sl[q-1])=="string"){
	          if(sl[q-1].startsWith('"')){
	            sl[q-1]=sl[q-1].slice(1,-1);
	            sl.splice(q-1,2,'"'+sl[q-1].repeat(sl[q+1])+'"');
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
	      if(sl[q]=="+"){
	        if(typeof(sl[q-1])=="string" && sl[q-1].startsWith('"')){ 
	          sl[q-1]=sl[q-1].slice(0,-1);
	        }
	        if(typeof(sl[q+1])=="string" && sl[q+1].startsWith('"')){
	          sl[q+1]=sl[q+1].slice(1);
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
	},
	"getInput":function(){
	  return "None";
	},
	"printOutput":function(obj){
	  this.output.push(obj);
	},
	"End":function(){
	  return this.output;
	},
	"setUp":function(){
	  this.output = [];
	}
})
