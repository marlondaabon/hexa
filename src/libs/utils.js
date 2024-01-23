import endpoints from './endPoint';
import { HttpPostGetPhotos } from './https';

import {
    ToastAndroid,
  } from 'react-native';

export const repeatString = (string, repeat) => {

    let aux = '';
    
    for (let i = 0; i < repeat; i++) {
        aux+=string+',';
    }

    return aux.slice(0,-1);
}

export const insertDataSurveys = (data) =>  { 

    let dataInsert = [];

    for(let i = 0; i < data.length; i++) {
        dataInsert.push(parseInt(data[i].id),data[i].title);
    }
    
    return dataInsert;

}

export const insertDataQuestions = (q) =>  { 

    let dataInsert = [];

    for(let i = 0; i < q.length; i++) {
        dataInsert.push(q[i].questionId, q[i].questionText, q[i].survey_id, q[i].placeholderText, q[i].questionType, JSON.stringify(q[i].options));
    }
    
    return dataInsert;

}

export const uploadImages = async (photos) => {

    const data = new FormData();

    if(photos.length > 0) {
      photos.forEach((photo, i) => {
        data.append(i, {
          uri: photo.uri,
          name: photo.user_id+"_"+photo.survey_id+"_"+photo.created_at, 
          type: 'image/jpeg'
        });
      });

      const resp =  await HttpPostGetPhotos(endpoints.syncImg, data);
      
      if(resp === `"OK"`){
        ToastAndroid.show("Imágenes sincronizadas!", ToastAndroid.LONG);
      }else{
        ToastAndroid.show(resp, ToastAndroid.LONG);
      }
      return resp;
    }

}