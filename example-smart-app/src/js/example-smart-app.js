(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    // LOINC
    // 18686-6  Respiration Rate
    // 59408-5  O2 Sat
    // 88658-0  Supp O2
    // 8310-5   Temp
    // 8480-6   SYS BP
    // 8867-4   Heart Rate
    // 80288-4  LOC


    // 8302-2   HEIGHT
    // 8462-4   DIA BP
    // 2085-9   Cholesterol in HDL [Mass/​volume] in Serum or Plasma
    // 2089-1   Cholesterol in LDL [Mass/​volume] in Serum or Plasma
    // 55284-4  Blood pressure systolic and diastolic

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
                              'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
                              'http://loinc.org|2089-1', 'http://loinc.org|55284-4',
                              'http://loinc.org|18686-6', 'http://loinc.org|59408-5',
                              'http://loinc.org|88658-0', 'http://loinc.org|8310-5',
                              'http://loinc.org|8867-4', 'http://loinc.org|80288-4']
                      }
                    }
                  });

        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          var byCodes = smart.byCodes(obv, 'code');
          var gender = patient.gender;
          var dob = new Date(patient.birthDate);
          var day = dob.getDate();
          var monthIndex = dob.getMonth() + 1;
          var year = dob.getFullYear();

          var dobStr = monthIndex + '/' + day + '/' + year;
          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given.join(' ');
            lname = patient.name[0].family.join(' ');
          }

          var height = byCodes('8302-2');
          var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
          var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
          var hdl = byCodes('2085-9');
          var ldl = byCodes('2089-1');

          var vtemp = byCodes('8310-5');
          var vheartRate = byCodes('8867-4');
          var vrespRate = byCodes('18686-6');
          var vosSat = byCodes('59408-5');
          var vonSupO2 = byCodes('88658-0');
          var vloc = byCodes('80288-4');

          var p = defaultPatient();
          p.birthdate = dobStr;
          p.gender = gender;
          p.fname = fname;
          p.lname = lname;
          p.age = parseInt(calculateAge(dob));
          p.height = getQuantityValueAndUnit(height[0]);

          if (typeof systolicbp != 'undefined')  {
            p.systolicbp = systolicbp;
          }

          if (typeof diastolicbp != 'undefined') {
            p.diastolicbp = diastolicbp;
          }

          //p.hdl = getQuantityValueAndUnit(hdl[0]);
          //p.ldl = getQuantityValueAndUnit(ldl[0]);
          
          p.temp = getQuantityValueAndUnit(vtemp[0]);
          p.heartrate = getQuantityValueAndUnit(vheartRate[0]);
          p.resprate = getQuantityValueAndUnit(vrespRate[0]);
          p.o2Sat = getQuantityValueAndUnit(vosSat[0]);
          p.onSupO2 = getQuantityValueAndUnit(vonSupO2[0]);
          p.loc = getQuantityValueAndUnit(vloc[0]);

          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      age: {value: ''},
      height: {value: ''},
      systolicbp: {value: ''},
      diastolicbp: {value: ''},
      ldl: {value: ''},
      hdl: {value: ''},
      heartrate: {value: ''},
      temp: {value: ''},
      resprate: {value: ''},
      o2Sat: {value: ''},
      onSupO2: {value: ''},
      loc: {value: ''},
      sepscore: {value: ''},
      sepalgo: {value: ''},
      sepresponse: {value: ''},
    };
  }

  function getBloodPressureValue(BPObservations, typeOfPressure) {
    var formattedBPObservations = [];
    BPObservations.forEach(function(observation){
      var BP = observation.component.find(function(component){
        return component.code.coding.find(function(coding) {
          return coding.code == typeOfPressure;
        });
      });
      if (BP) {
        observation.valueQuantity = BP.valueQuantity;
        formattedBPObservations.push(observation);
      }
    });

    return getQuantityValueAndUnit(formattedBPObservations[0]);
  }

  function isLeapYear(year) {
    return new Date(year, 1, 29).getMonth() === 1;
  }

  function calculateAge(date) {
    if (Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())) {
      var d = new Date(date), now = new Date();
      var years = now.getFullYear() - d.getFullYear();
      d.setFullYear(d.getFullYear() + years);
      if (d > now) {
        years--;
        d.setFullYear(d.getFullYear() - 1);
      }
      var days = (now.getTime() - d.getTime()) / (3600 * 24 * 1000);
      return years + days / (isLeapYear(now.getFullYear()) ? 366 : 365);
    }
    else {
      return undefined;
    }
  }

  function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
          return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
    } else {
      return undefined;
    }
  }

  function getSepsisScore(patient){

    const pingUrl = 'https://irmcv4.blupanda.com/PandaAPI.svc/API/PING';

    var request = new XMLHttpRequest();
    request.open('GET', pingUrl);
    request.responseType = 'json';

  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#age').html(p.age);

    $('#temp').html(p.temp);
    $('#heartrate').html(p.heartrate);
    $('#resprate').html(p.resprate);
    $('#systolicbp').html(p.systolicbp);
    $('#o2sat').html(p.o2Sat);
    $('#onsupo2').html(p.onSupO2);
    $('#loc').html(p.loc);

    $('#sepresp').html(p.sepresponse);
    $('#sepscore').html(p.sepscore);

    // $('#height').html(p.height);
    // $('#diastolicbp').html(p.diastolicbp);
    // $('#ldl').html(p.ldl);
    // $('#hdl').html(p.hdl);
  };

})(window);
