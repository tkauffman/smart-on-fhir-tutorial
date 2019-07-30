// import request from 'request';
// const base_url = 'https://irmcv4.blupanda.com/PandaAPI.svc/API/';
// const api_key = 'd57a553b4bfd8a18b8d1afbaaed5bf56d26b684c0c5d205c8138609d5c9e51a6';
    
class BluPandaAPI
{
    constructor(api_key){
        //this.http = http;
        this.panda_api_url = 'https://irmcv4.blupanda.com/PandaAPI.svc/API'
        this.api_key = api_key;
    }

    is_panda_API_available() {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', "https://irmcv4.blupanda.com/PandaAPI.svc/API/PING", true);        
        xhr.onreadystatechange = function(){
            if (xhr.readyState == XMLHttpRequest.DONE){
                console.log(xhr.response);
                if (200 == xhr.status)
                {
                    if (1000 == xhr.response.Code)
                    {
                        return true;
                    }
                }
            }
        }
        xhr.send();

        return false;
    }

    generate_news_score(){
        var api_url = `${this.panda_api_url}/${this.api_key}/SEPSISSCORE`;

        let subPack = this.create_sepsis_sub_pack();

        console.log('Sending SubPack for score')

        var xhr = new XMLHttpRequest();
        xhr.open('POST', api_url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //xhr.withCredentials = true;
        xhr.responseType = 'json';
        xhr.onreadystatechange = function(){
            if (xhr.readyState == XMLHttpRequest.DONE){
                console.log(xhr.response);
            }
            else {
                console.log('An error occurred');
                console.log(JSON.parse(xhr.responseText));
                console.log(xhr.status);
            }
        }
        xhr.send(subPack);

        return subPack;
        // https://irmcv4.blupanda.com/PandaAPI.svc/API/d57a553b4bfd8a18b8d1afbaaed5bf56d26b684c0c5d205c8138609d5c9e51a6/SEPSISSCORE
    }


    news_api(){

        const rootURL = 'https://irmcv4.blupanda.com/PandaAPI.svc/API/PING';
        const apiKey = this.api_key;

        const api_url = `${rootURL}`;

        console.log(api_url);

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';

        xhr.onreadystatechange = function(){
            if (xhr.readyState == XMLHttpRequest.DONE){
                console.log(xhr.response)
            }
        }

        xhr.open('GET', api_url);

        // request.onload = function(){
        //   console.log(request.response)
        // }

        xhr.send();

        // if (response.statusCode === 200){
        //     return (JSON.parse(body).results)
        // }else{
        //     return 'Error';
        // }

        // function load(url, callback) {
        //     var xhr = new XMLHttpRequest();
          
        //     xhr.onreadystatechange = function() {
        //       if (xhr.readyState === 4) {
        //         callback(xhr.response);
        //       }
        //     }
          
        //     xhr.open('GET', url, true);
        //     xhr.send('');
        //   }

        //this._sendRequest("SEPSISSCORE", callback)
        // const api_url = '${base_url}/${api_key/SEPSISSCORE}';

        // return new Promise(function(resolve, reject){
        //     //https://irmcv4.blupanda.com/PandaAPI.svc/API/
        //     //d57a553b4bfd8a18b8d1afbaaed5bf56d26b684c0c5d205c8138609d5c9e51a6/SEPSISSCORE
        // });
    }

    _sendRequest(requestURL, callback){
        //const api_url = '${base_url}/${api_key}/${type}';

        request(requestURL, function(error, response, body){
            if (!error & response.statusCode === 200){
                callback(JSON.parse(body).results)
            }
        })
    }

    create_sepsis_sub_pack(){
        var pack = `
            {
                "SUBTYPE": "SEPSISPACK",
                "PVID": 0,
                "TEMP": 98.6,
                "HRATE": 80,
                "RRATE": 20,
                "SYSBP": 110,
                "OnSupO2": "RoomAir",
                "O2SAT": 97,
                "LOC": "Alert and Oriented",
                "DT": "2019-07-29T154:00:00"
            }`;
            return pack;
    }


}