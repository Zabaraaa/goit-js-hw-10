const URL = `https://restcountries.com/v3.1/name/`

function fetchData(countryName) {
    return fetch(`${URL}/${countryName}?fields=name,capital,population,flags,languages`
    ).then(response => {
        if (!response.ok) {
            throw new Error('Data fail!');
        }
        return response.json();
    
    });
}

export default fetchData;