const scoreResult = document.getElementById('score');
let eachScore = [0,0,0,0,0];

function Question1(event){
    const resultText = event.target.parentNode.querySelector('span');    
    let question = parseInt(prompt("What year is it now? ( Please enter a number )"));

    while(Number.isNaN(question)){
        question = parseInt(prompt("What year is it now? ( Please enter a number )"));
    }

    eachScore[0] =  CheckQuestions(question, 2021, resultText);
    UpdateTotalScore();
}

function Question2(event){
    const resultText = event.target.parentNode.querySelector('span');
    const question = confirm("It is second semester of Computer programming course ( True : OK, False : Cancel )");
    
    eachScore[1] = CheckQuestions(question, true, resultText);
    UpdateTotalScore();
}

function Question3(event){
    const resultText = event.target.parentNode.querySelector('span');
    const question = prompt("What is the name of the college you study?");

    eachScore[2] = CheckQuestions(question, "conestoga", resultText);
    UpdateTotalScore();
}

function Question4(event){
    const resultText = event.target.parentNode.querySelector('span');
    const question = confirm("The prog1800 class is interesting for students. ( True : OK, False : Cancel )");
    
    eachScore[3] = CheckQuestions(question, true, resultText);
    UpdateTotalScore();
}

function Question5(event){
    const resultText = event.target.parentNode.querySelector('span');
    const question = confirm("Computer Programming course is in Kitchener campus");
    
    eachScore[4] = CheckQuestions(question, false, resultText);
    UpdateTotalScore();
}

function CheckQuestions(question, answer, result){
    let score = 0;
    
    if(question === answer){
        result.innerText = 'Correct';
        result.classList.remove('incorrect');
        result.classList.add('correct');
        score = 20;
    }
    else{
        result.innerText = 'Incorrect';
        result.classList.remove('correct');
        result.classList.add('incorrect');
        score = 0;
    }

    return score;
}

function UpdateTotalScore(){
    let totalScore = 0;

    eachScore.forEach((score)=>{
        totalScore += score;
    });
    
    scoreResult.innerText = totalScore;
}
