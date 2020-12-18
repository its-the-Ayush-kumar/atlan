document.getElementById('upload').addEventListener('click', upload);

async function upload(e){
  let progress = document.getElementById("progress");
  progress.innerHTML = "Uploading";
  let file = document.getElementById("file").files[0];
  let data = new FormData();
  data.append('file', file);
  
  createTask();
  let response = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: data
  });
  response = await response.json();
  progress.innerHTML = response.msg;
  removeTask();
}

function createTask(){
  let handler = document.createElement('button');
  handler.id = "status";
  handler.addEventListener('click', pause);
  handler.innerHTML = "Pause";
  document.getElementById('tasks').append(handler);
}

function removeTask(){
  document.getElementById('status').remove();
}

async function pause(task){
  let response = await fetch("http://localhost:3000/api/handle", {
    method: "POST",
  });
}
