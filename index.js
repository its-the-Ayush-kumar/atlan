document.getElementById('upload').addEventListener('click', upload);

function upload(){
  let progress = document.getElementById('progress');
  progress.innerHTML = "Uploading!";

  let file = document.getElementById("file").files[0];
  let fileData = (new FormData()).append("file", file);
  
  fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: fileData
  }).then(response => {
    progress.innerHTML = response.msg;
  });
}
