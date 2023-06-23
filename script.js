var goto;
var xhr = new XMLHttpRequest();
xhr.open("get", "goto_interpreter.js")
xhr.send();
xhr.onreadystatechange = function() {
  if( xhr.readyState === 4 && xhr.status === 200) {
    console.log(this.responseText);
    goto = eval(this.responseText);
  }
};
console.log(goto)
function run(){
  document.getElementById("output").value="";
  var c=document.getElementById("code").value;
  var inp = document.getElementById("input").value;
  var ou=document.getElementById("output");
  var out = goto.main(c,inp);
  for(var r in out){
    if(out[r].text.startsWith('"')){
      out[r].text=out[r].text.slice(1,-1);
    }
    ou.value+="\n"+out[r].type+": Line "+out[r].line+" : "+out[r].text;
  }
}
