//145
const cache = {}

const getCurrency = (date) => {
    if (cache[date]) {
        console.log('from cache')
        return new Promise((resolve) => resolve(cache[date]))
    } else {
        console.log('from BE')
        return fetch(`https://www.nbrb.by/api/exrates/rates/usd?parammode=2&ondate=${date}`)
            .then(res => res.json())
            .then(currency => {
                cache[date] = currency.Cur_OfficialRate
                return currency.Cur_OfficialRate
            })
    }

}
getCurrency('12-12-2021').then(console.log)

getCurrency('12-12-2021').then(console.log)

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

function setDates(e){
    startDate.setAttribute('max', endDate.value)

    if(startDate.value > endDate.value){
    startDate.value = endDate.value
    }
    if(startDate.value === ''){
        startDate.value = endDate.value
    }
}
setDates()

endDate.addEventListener('change', setDates)

