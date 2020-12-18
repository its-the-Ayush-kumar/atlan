document.getElementById('upload').addEventListener('click', upload);

async function upload(e){
  let status = document.getElementById("status");
  status.innerHTML = "Uploading";
  let file = document.getElementById("file").files[0];
  let data = new FormData();
  data.append('file', file);
  
  createTask();
  let response = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: data
  });
  response = await response.json();
  status.innerHTML = response.msg;
  removeTask();
}

function createTask(){
  let handler = document.createElement('button');
  handler.id = "control";
  handler.addEventListener('click', control);
  handler.innerHTML = "Pause";
  document.getElementById('tasks').append(handler);
}

function removeTask(){
  document.getElementById('control').remove();
}

async function control(){
  let control = document.getElementById('control');
  let response = await fetch("http://localhost:3000/api/handle");
  if(response.status === 200){
    if(control.innerHTML === "Pause"){
      control.innerHTML = "Resume";
    } else {
      control.innerHTML = "Pause";
    }
  } else alert("There was some error in Pause / Resume");
    
}

document.getElementById('clear').addEventListener('click', clear);
async function clear(){
  alert("yo");
  let status = document.getElementById('status');
  let response = await fetch("http://localhost:3000/api/clear");
  console.log(response.status);
  status.innerHTML = (response.status === 200) ? "Junk cleared!" : "Could not clear junk files!";
}
