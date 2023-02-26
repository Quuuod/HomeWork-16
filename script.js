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
