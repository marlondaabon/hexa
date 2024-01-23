# Hexa &middot; [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react)
Hexa es una aplicación que te permite tomar encuestas, reportes, evaluaciones, inspecciones en diferentes escenarios, tanto de manera offline como online.

### Estructura de datos

La aplicación almacena todos los datos en tres tablas en base de dato sqlite. Las tablas creadas son: **Surveys**, **Questions**, **Answers**. 
Cada una de estas tablas son creadas cuando el usuario inicia sesión. Cuando el usuario sincronza la información automaticamente 
la tabla de **Answers** es vaciada.

1. Estructura de las encuestas: ```[{id:1, title:"survey" }]```
2. Estructura de las preguntas: 
   - ```[{questionType: 'NumericInput',questionText: 'Botellones',questionId: '3', placeholderText: 'Botellones'}]```
   - ```[{questionType: 'TextInput',questionText: 'Apellido',questionId: '3', placeholderText: 'Apellidos'}]```
   - ```[{questionType: 'SelectGroup', questionText: 'Color favorito', questionId: '3', options:[{ value:'12', optionText: "Azul" }, { value:'10', optionText: "Rojo" }] }]```
   - ```[{questionType: 'MultiSelectGroup', questionText: 'Color favorito', questionId: '3', options:[{ value:'12', optionText: "Azul" }, { value:'10', optionText: "Rojo" }] }]```
3. Respuesta de Hexa: 
    - Answer: ```[{answer:'answer', survey_id:1, user_id:1, question_id:2, lat:'11.012', syncronized:0, uri:'path-img' ,long:'-74.21',created_at:'2022-11-15 11:03' }]```.

### Funcionamiento

  Para cada una de las encuestas está la opción de seleccionar máximo 4 foto del archivo del teléfono, en cualquier momento de la realización de la misma. Además, de tomar la ubicación por defecto.

  1. Una vez el usuario inicia sesión, automaticamente la aplicación guarda de manera local todas las encuestas y sus preguntas.
  2. Cuando el usuario elige una de las encuestas es enviado a las preguntas.
  3. Una vez que la finalice, es notificado del estado de la petición, si es satisfactorio le informará que "Encuesta realizada!", sino
    "Vuelva a intentar, aún no obtenemos tú ubicación!". Si el mensaje que se vizualiza es el último debe volver a intentar finalizar la encuesta.


### Configuraciones

    Para las configuraciones se puede usar el comando npm o yarn. La siguiente es con npm, en el caso de utiliar yarn solo sería cambiarlo por "npm".

```npm i```
    ```npx react-native run-android```
    ``` npx react-native run-ios```
    
### Tecnologías

    La aplicación esta desarrollada con React Native en la versión 0.68.2, React 17.0.2. En un ambiente con la versión 18.9.0 de Node, Java 17.0.4.1 y la 8.19.1 de npm.

 1. [React Native](https://reactnative.dev/)  
 2. [Sqlite Storage](https://www.npmjs.com/package/react-native-sqlite-storage) Para almacenar los datos en el teléfono.
 3. [Formik](https://www.npmjs.com/package/formik) Hook para manejar los formualrios.
 4. [Geolocation service](https://www.npmjs.com/package/react-native-geolocation-service) Para obtener la ubicación actual.
 5. [Simple Survey](https://www.npmjs.com/package/react-native-simple-survey) Para crear la encuesta de manera dinamica.
6.  [Image Crop Picker](https://github.com/ivpusic/react-native-image-crop-picker) Para obtener las imagenes desde el teléfono.
7.  [NetInfo](https://www.npmjs.com/package/@react-native-community/netinfo) Para obtener el estado de conexión del teléfono.
8.  [MaterialIcon](https://github.com/oblador/react-native-vector-icons/blob/master/glyphmaps/MaterialCommunityIcons.json) Obtener los iconos
9.  [FlashList](https://www.npmjs.com/package/@shopify/flash-list) FlatList high performance 


### Generate APK

1. ```react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res```
2. ```cd android```
3. ```./gradlew assembleDebug```
4. ```yourProject/android/app/build/outputs/apk/debug/app-debug.apk```

### Hexa v.0.6

    Hexa Online

   ![ScreenShot](/imgs/4.jpeg)
   ![ScreenShot](/imgs/1.jpeg)
   ![ScreenShot](/imgs/2.jpeg)
   ![ScreenShot](/imgs/3.jpeg)
   ![ScreenShot](/imgs/6.jpeg)
   ![ScreenShot](/imgs/10.jpeg)
   ![ScreenShot](/imgs/5.jpeg)

    Hexa Offline

   ![ScreenShot](/imgs/9.jpeg)
   ![ScreenShot](/imgs/7.jpeg)
   ![ScreenShot](/imgs/8.jpeg)
