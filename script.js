var goto;
var xhr = new XMLHttpRequest();
xhr.open("get", "goto_interpreter.js")
xhr.send();
xhr.onreadystatechange = function() {
  if( xhr.readyState === 4 && xhr.status === 200) {
    goto = eval(this.responseText);
    goto.getInput = function(){
      return this.input.shift();
    }
    console.log("OK");
  }
};
async function run(){
  document.getElementById("output").value="";
  var c=document.getElementById("code").value;
  var inp = document.getElementById("input").value.split("\n")
  var ou=document.getElementById("output");
  goto.input = inp;
  var out = await goto.main(c);
  console.log(out);
  console.log(goto);
  for(var r in out){
    ou.value+=out[r].type+": Line "+out[r].line+" : "+out[r].text+"\n";
  }
}
