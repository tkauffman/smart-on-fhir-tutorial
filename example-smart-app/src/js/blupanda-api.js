import request from 'request';
const base_url = 'https://irmcv4.blupanda.com/PandaAPI.svc/API/';
const api_key = 'd57a553b4bfd8a18b8d1afbaaed5bf56d26b684c0c5d205c8138609d5c9e51a6';
    
class BluPandaAPI
{
    constructor(api_key){
        //this.http = http;
        this.api_key = api_key;
    }

    news_api(callback){
        this._sendRequest("SEPSISSCORE", callback)
        // const api_url = '${base_url}/${api_key/SEPSISSCORE}';

        // return new Promise(function(resolve, reject){
        //     //https://irmcv4.blupanda.com/PandaAPI.svc/API/
        //     //d57a553b4bfd8a18b8d1afbaaed5bf56d26b684c0c5d205c8138609d5c9e51a6/SEPSISSCORE
        // });
    }

    _sendRequest(type, callback){
        const api_url = '${base_url}/${api_key/${type}';

        request(api_url, function(error, response, body){
            if (!error & response.statusCode === 200){
                callback(JSON.parse(body).results)
            }
        })
    }

    // {
    //     "SUBTYPE": "SEPSISPACK",
    //     "PVID": 0,
    //     "TEMP": 98.6,
    //     "HRATE": 80,
    //     "RRATE": 20,
    //     "SYSBP": 110,
    //     "OnSupO2": "Room Air",
    //     "O2SAT": 97,
    //     "LOC": "Alert and Oriented",
    //     "DT": "2019-07-24T15:26:03"
    // }
}