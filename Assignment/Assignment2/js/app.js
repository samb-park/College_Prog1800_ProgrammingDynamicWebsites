const icons = document.querySelectorAll('.itemImage');
const btnSubmit = document.getElementById('btnSubmit');
const price = document.getElementById('price');
const username = document.getElementById('username'),
      address = document.getElementById('address'),
      city = document.getElementById('city'),
      province = document.getElementById('province'),
      credit = document.getElementById('credit'),
      email = document.getElementById('email'),
      password = document.getElementById('password'),
      confirmPassword = document.getElementById('confirmPassword')
      itemList = document.getElementById('itemList'),
      finalMessage = document.getElementById('message');

let totalPrice = 0;
const priceOfItem = [5,5,5,5];
const nameOfItem = ["Javascript ","Node.JS ","HTML ","CSS "];

function Success(element,message){
    const small = element.parentElement.children[2];

    element.classList.add('successBorder');
    element.classList.remove('errorBorder');

    small.classList.remove('errorFont');
}

function Error(element,message){
    const small = element.parentElement.children[2];

    element.classList.add('errorBorder');
    element.classList.remove('successBorder');

    small.classList.add('errorFont');
    small.innerText = message;
}

function CheckCredit(source){
    const regex = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
    let message = "Credit is not valid";

    if(regex.test(source)){
        message = undefined;
    }
    return message;
}

function CheckEmail(source){
    const regex = /^[a-zA-Z]+\@[a-zA-Z]+\.[a-zA-Z]+$/;
    let message = "Email is not valid";

    if(regex.test(source)){
        message = undefined;
    }
    return message;
}

function ValidatePassword(){
    let returnValue = false;
    if(password.value !== confirmPassword.value){
        Error(confirmPassword,"Password does not match");

    }
    else if(confirmPassword.value === ""){
        Error(confirmPassword,"Password is requred");
    }
    else{
        Success(confirmPassword,undefined);
        returnValue = true;
    }
    return returnValue;
}

function ValidateElement(element,errorMessage){
    let returnValue = false;
    if(element.value === ""){
        Error(element,`${element.id} is requried`);
    }
    else if(errorMessage !== undefined){

        Error(element,errorMessage);
    }
    else{
        Success(element,undefined);
        returnValue =true;
    }
    return returnValue;
}
function CalculateTotalPrice(){
    totalPrice = 0;
    let items = "";
    for(let i = 0; i < 4 ; i++){
        if(icons[i].classList.length === 4){
            totalPrice += priceOfItem[i];
            items += `${nameOfItem[i]}`;
        }
    }
    if(totalPrice){
        price.innerText = `${totalPrice} `;
        itemList.innerText = items;
    }
    else{
        price.innerText = "0";
        itemList.innerText ="-";
    }
    
}

icons.forEach((icon)=>{
    icon.onclick = function (event){
        event.target.parentElement.children[1].classList.toggle('visible');
        event.target.classList.toggle("checked");

        CalculateTotalPrice()
    };
});

btnSubmit.onclick = function(){
    let isSuccess = true;

    isSuccess = ValidateElement(username, undefined) && isSuccess;
    isSuccess = ValidateElement(address, undefined) && isSuccess;
    isSuccess = ValidateElement(city,  undefined) && isSuccess;
    isSuccess = ValidateElement(province, undefined) && isSuccess;
    isSuccess = ValidateElement(credit, CheckCredit(credit.value)) && isSuccess;
    isSuccess = ValidateElement(email, CheckEmail(email.value)) && isSuccess;
    isSuccess = ValidateElement(password, undefined) && isSuccess;
    isSuccess = ValidatePassword() && isSuccess;

    if(itemList.innerText == "-"){
        isSuccess = false;
        finalMessage.innerText = "Please select course.";
    }
    else if(parseInt(price.innerText) < 10){
        isSuccess = false;
        finalMessage.innerText = "You have to buy more than $10 to get a receipt.";
    }

    if(isSuccess){
        let gst = 0.05;
        let hst = (parseFloat(province.value)*100).toFixed(2);
        let itemPrice = parseInt(price.innerText);
        let total = parseInt(price.innerText)*(parseFloat(gst) + parseFloat(parseFloat(province.value)) +1);
        let finalPrice = `Price : $${itemPrice}, GST : 5%, HST: ${hst}%, Total : ${total.toFixed(2)}`;

        sessionStorage.setItem("username",username.value);
        sessionStorage.setItem("address",address.value);
        sessionStorage.setItem("city",city.value);
        sessionStorage.setItem("province",province.options[province.selectedIndex].text);
        sessionStorage.setItem("credit",credit.value);
        sessionStorage.setItem("email",email.value);
        sessionStorage.setItem("itemList",itemList.innerText);
        sessionStorage.setItem("price",finalPrice);

        finalMessage.innerText = "Sucesses!";

        window.open("receipt.html","Receipt","width=1000, height=600");
    }
};
