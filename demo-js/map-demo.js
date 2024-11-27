const array = [1,2,3,4,5,6];

//객체(혹은 배열 등)에서 한개 꺼내고 콜백 함수를 부름
const arrayForeach = array.forEach(function(value,index,all){
                    //한 개의 값, 인덱스,모든 값
    console.log(`value : ${value}, index : ${index}, all : ${all}`);
    return value*2;
    // 값이 저장이 안됨
})



const arrayMap = array.map(function(value,index,all){
    console.log(`value : ${value}, index : ${index}, all : ${all}`);
    return value*2;
    //값을 리턴 받아 새로운 map을 만듬
})


console.log(`foreach : ${arrayForeach}, map : ${arrayMap}`)