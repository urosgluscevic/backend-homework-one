let arr = ["pete", "steve", "mark", "anne", "mitar"];

let ind = arr.findIndex(
    item => item.indexOf("mark") > -1
)

if (ind > -1){
    arr.splice(ind, 2)
}

console.log(ind)
console.log(arr)