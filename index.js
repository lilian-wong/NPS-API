'use strict';

const apiKey = '';
const searchURL = 'https://developer.nps.gov/api/v1/parks/';
const requestFields = ['addresses'];

function formatQueryParams(params){
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
      return queryItems.join('&');
}

function formatAddress(addr){
    let PhysicalAddr = addr[getPhysicalAddr(addr)];
    return `<h4>Address:</h4>
        <p>${PhysicalAddr.line1}
        ${PhysicalAddr.line2}
        ${PhysicalAddr.line3}
        ${PhysicalAddr.stateCode}
        ${PhysicalAddr.postalCode}
        <p>`      
}

function getPhysicalAddr(addr){
    let index = 0;
    addr.forEach(function(a){
        if(a.type==='Physical'){
            index = addr.indexOf(a);

        }
    });
    return index;
}

function displayResults(responseJson){
    $('#results-list').empty();
    for (let i=0; i<responseJson.limit; i++){
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
            <p>Description:${responseJson.data[i].description}</p>
            ${formatAddress(responseJson.data[i].addresses)}
            <a href=${responseJson.data[i].url}>Website</a>`
        )
    };

    $('#results').removeClass('hidden');
};

function getNationalParkService(query, maxResults=10){
    const params = {
        api_key:apiKey,
        q:query,
        fields:requestFields,
        limit:maxResults,
    };
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' +queryString;

    fetch(url)
        .then(response =>{
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
} 

function watchForm(){
    $('form').submit(event =>{
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        getNationalParkService(searchTerm, maxResults);
    })
}

$(watchForm);