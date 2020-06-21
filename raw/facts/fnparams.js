//pass a variable as a parameter to a function
//pass a function as a parameter to function

function myFun(param){
    console.log(param);
    let rval = param();
    console.log(rval);
}

//myFun(10);
myFun(function smallerfn(){
    let a = 10;
    a++;
    console.log("i am a function passed to myfun");
    return a;
});