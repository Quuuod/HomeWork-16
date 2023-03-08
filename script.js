// //145
// const cache = {}

// const getCurrency = (date) => {
//     if (cache[date]) {
//         console.log('from cache')
//         return new Promise((resolve) => resolve(cache[date]))
//     } else {
//         console.log('from BE')
//         return fetch(`https://www.nbrb.by/api/exrates/rates/usd?parammode=2&ondate=${date}`)
//             .then(res => res.json())
//             .then(currency => {
//                 cache[date] = currency.Cur_OfficialRate
//                 return currency.Cur_OfficialRate
//             })
//     }

// }
// getCurrency('12-12-2021').then(console.log)

// getCurrency('12-12-2021').then(console.log)

// document.querySelector('button').addEventListener('click', () => {
//     getCurrency('12-12-2021').then(console.log)
//
// })

const min = document.querySelector('#min')
const max = document.querySelector('#max')

const btnSubmit = document.querySelector('#submit')

let today = new Date()
let dd = today.getDate()
let mm = today.getMonth() + 1
let yyyy = today.getFullYear()

if (dd < 10) {
    dd = '0' + dd
}

if (mm < 10) {
    mm = '0' + mm
}
today = yyyy + '-' + mm + '-' + dd

const startDate = document.querySelector('#startDate')
const endDate = document.querySelector('#endDate')

endDate.setAttribute('max', today)
endDate.value = today

function setEndDate() {
    startDate.setAttribute('max', endDate.value)

    if (startDate.value > endDate.value) startDate.value = endDate.value

    if (endDate.value > today) endDate.value = today
}

function setStartDate() {
    if (startDate.value === '') startDate.value = endDate.value

    if (startDate.value > today) startDate.value = today
}

setEndDate()
setStartDate()

endDate.addEventListener('change', setEndDate)
endDate.addEventListener('blur', () => {
    if (endDate.value < endDate.getAttribute('min')) {
        endDate.value = endDate.getAttribute('min')
    }
})

startDate.addEventListener('change', setStartDate)
startDate.addEventListener('blur', () => {
    if (startDate.value < startDate.getAttribute('min')) {
        startDate.value = startDate.getAttribute('min')
    }
})


btnSubmit.addEventListener('click', e => {
    const start = Date.parse(startDate.value)
    const end = Date.parse(endDate.value)
    const datesArray = []
    let result = []

    for (let i = start; i <= end; i = i + 24 * 60 * 60 * 1000) { // шаг цикла 1 день в милисекундах
        datesArray.push(new Date(i).toISOString().slice(0, 10))
    }

    const requests = datesArray.map(date => fetch(`https://www.nbrb.by/api/exrates/rates/usd?parammode=2&ondate=${date}`));

    (async function () {
        result = await Promise.all(requests)
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(currencies => {
                currencies.forEach(currency => {
                    result.push({
                        [currency.Date.slice(0, 10)]: currency.Cur_OfficialRate
                    })
                })
                result = Object.entries(result)
                //удаление суббот и воскресений из массива(если они не первый элемент)
                for (let i = 0; i < result.length; i++) {
                    const weekDay = new Date(Object.keys(result[i][1]))
                    if ((weekDay.getDay() === 6 || weekDay.getDay() === 0) && result.indexOf(result[i]) !== 0) {
                        result.splice(i, 1)
                        i--
                        //нужно из за того что при splice индексы элементов сдвигаются и если удалённый элемент 
                        //был например суббота с индексом 2 то следующий за ним элемент воскресенье получит индекс 2 
                        //но массив пропустит его так как i уже равно 3 
                    }
                }

                result = result.sort((a, b) => Object.values(a[1]) - Object.values(b[1]))
                
                min.innerText = `${Object.keys(result[0][1])} : ${Object.values(result[0][1])} `
                max.innerText = `${Object.keys(result[result.length - 1][1])} : ${Object.values(result[result.length - 1][1])} `
            })
    })()
})