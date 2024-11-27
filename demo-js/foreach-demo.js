const array = [1,2,3,4,5,6];

//객체(혹은 배열 등)에서 한개 꺼내고 콜백 함수를 부름
array.forEach(function(value,index,all){
                    //한 개의 값, 인덱스,모든 값
    console.log(`value : ${value}, index : ${index}, all : ${all}`);
})

let map = new Map();
map.set(1,"one");
map.set(4,"four");
map.set(2,"two");
map.forEach(function(value,index,all){
    console.log(`value : ${value}, index : ${index}, all : ${all}`);
})