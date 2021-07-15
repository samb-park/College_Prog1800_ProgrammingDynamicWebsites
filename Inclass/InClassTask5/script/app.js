let animateFlag = true;

$(document).ready(function(){
    $("#btnHide").click(function(){
        $("#hide").toggle("hide");
    })
    $("#btnFade").click(function(){
        $("#fade").toggle("fade");
    })
    $("#btnSlide").click(function(){
        $("#slide").toggle("slide");
    })
    $("#btnAnimate").click(function(){
        if(animateFlag)
        {
            $("#animate").animate({
                borderColor: "red",
                color: "green"
            })
            animateFlag = false;
        }
        else{
            $("#animate").animate({
                borderColor: "green",
                color: "red"
            })
            animateFlag = true;
        }
    })

})
