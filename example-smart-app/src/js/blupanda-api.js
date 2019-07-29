// import request from 'request';
// const base_url = 'https://irmcv4.blupanda.com/PandaAPI.svc/API/';
// const api_key = 'd57a553b4bfd8a18b8d1afbaaed5bf56d26b684c0c5d205c8138609d5c9e51a6';
    
class BluPandaAPI
{
    constructor(api_key){
        //this.http = http;
        this.panda_api_url = 'https://irmcv4.blupanda.com/PandaAPI.svc/API/'
        this.api_key = api_key;
    }

    generate_news_score(){
        let subPack = this.create_sepsis_sub_pack();

        return subPack;
        // https://irmcv4.blupanda.com/PandaAPI.svc/API/d57a553b4bfd8a18b8d1afbaaed5bf56d26b684c0c5d205c8138609d5c9e51a6/SEPSISSCORE
    }

    news_api(){

        const rootURL = 'https://irmcv4.blupanda.com/PandaAPI.svc/API/PING';
        const apiKey = this.api_key;

        //const api_url = `${rootURL}/${apiKey}/SEPSISSCORE`;
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

    _sendRequest(type, callback){
        const api_url = '${base_url}/${api_key}/${type}';

        request(api_url, function(error, response, body){
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