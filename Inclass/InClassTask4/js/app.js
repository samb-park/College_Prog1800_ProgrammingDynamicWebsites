const image = document.getElementById('image');
const description = document.getElementById('description');


// Click event handler : it changes the image to new
image.onclick = function (){
    image.src = "./images/two.png";
    description.innerText = "Please double click above image";
}

// Double click event handler : it changes the image to default
image.ondblclick = function (){
    image.src = "./images/one.png";
    description.innerText = "Please click above image";
}