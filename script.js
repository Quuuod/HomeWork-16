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

function setDates(e) {
    startDate.setAttribute('max', endDate.value)

    if (startDate.value > endDate.value) {
        startDate.value = endDate.value
    }
    if (startDate.value === '') {
        startDate.value = endDate.value
    }
}
setDates()

endDate.addEventListener('change', setDates)


const btnSubmit = document.querySelector('#submit')

btnSubmit.addEventListener('click', e => {
    const start = Date.parse(startDate.value)
    const end = Date.parse(endDate.value)
    const datesArray = []
    const result = {}

    for (let i = start; i <= end; i = i + 24 * 60 * 60 * 1000) {
        datesArray.push(new Date(i).toISOString().slice(0, 10))
    }

    let requests = datesArray.map(date => fetch(`https://www.nbrb.by/api/exrates/rates/usd?parammode=2&ondate=${date}`));

    Promise.all(requests)
        .then(responses => responses)
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(currencies => currencies.forEach(currency => result[currency.Date.slice(0, 10)] = currency.Cur_OfficialRate));

    console.log(result)
})

