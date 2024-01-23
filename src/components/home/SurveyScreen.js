import React from "react";
import { 
    StyleSheet, 
    TextInput,
    Text, 
    Button,
    Pressable,
    View, 
    TouchableOpacity,
    ActivityIndicator, 
    ScrollView,
    Image,
    ToastAndroid,
    PermissionsAndroid
} from "react-native";
import { SimpleSurvey } from "react-native-simple-survey";
import { openPicker } from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';

import { COLORS } from '../../res/generalStyles';
import transactionDB from "../../libs/database";
import MaterialIcon from "../../libs/MaterialIcon";

import { openDatabase } from 'react-native-sqlite-storage';
import { getToken, storeToken  } from "../../libs/asyncStorage"; 
import Offline from "../Offline/Offline";

const db = openDatabase({name: 'surveys'});

const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permisos de Geolocalización',
          message: '¿Podemos acceder a tú ubicación',
          buttonNeutral: 'Preguntar después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Si',
        },
      );
      if (granted === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
};



export default  class SurveyScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            answersSoFar: '',
            timePassed: false, 
            answers: [],
            images: [],
            surveys: [],
            quantity_questios: 0,
            latitude:'', 
            longitude:'',
            username: '' 
        }
    };

    requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'Acesso a la galería',
                message: 'Nuestra app requiere este permiso para poder cargar las imágenes',
                buttonNegative: 'Negar',
                buttonPositive: 'Permitir',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              return granted;
            } 
          } catch (err) {
            console.log(err);
          }
        } else {
          return true;
        }
    };


    openImageLibrary = async () => {
        let isStoragePermitted = await this.requestExternalWritePermission();

        if (isStoragePermitted) {
            openPicker({
                maxFiles: '4',
                multiple: true,
                mediaType: 'photo',
                showsSelectedCount: true,
                compressImageQuality: 0.5
            }).then(imgs => {
                if (imgs.length <= 4) {
                    this.setState({ images: [...this.state.images, ...imgs]});
                } else {
                    this.setState({ images: [...this.state.images]});
                    ToastAndroid.show("Solo están permitido máximo 4 imágenes", ToastAndroid.LONG);
                }
            }).catch(error => {
                ToastAndroid.show("No has seleccionado imágenes!", ToastAndroid.LONG);
            });
        }
    };

    getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        this.setState({latitude:position.coords.latitude, longitude:position.coords.longitude});
                    },
                    error => {
                        ToastAndroid.show("No ha sido posible obtener tú ubicación!", ToastAndroid.LONG);
                    },
                    {
                        enableHighAccuracy: true, timeout: 2000
                    },
                );
            }
        });
    };

    static navigationOptions = () => {
        return {
            headerStyle: {
                backgroundColor: COLORS.secondary,
                height: 40,
                elevation: 5,
            },
            headerTintColor: '#fff',
            headerTitle: 'Sample Survey',
            headerTitleStyle: {
                flex: 1,
            }
        };
    }

    renderPreviousButton(onPress, enabled) {
        return (
            <View style = { styles.containerBtn } >
                <Pressable 
                    onPress = { onPress }
                    disabled = { !enabled }
                    style = { styles.backBtn }   
                >
                    <Text style = { styles.textBack}>
                        Anterior
                    </Text>
                </Pressable>
            </View>
        );
    }


    renderNextButton = (onPress, enabled) => {
        return(
            <View 
                style = { styles.containerBtn } 
            >
                <Pressable 
                    onPress = { onPress }
                    disabled = { !enabled }
                    style = { styles.nextBtn }   
                >
                    <Text
                        style = { styles.text}
                    >
                        Siguiente
                    </Text>
                </Pressable>
            </View>
        );
    }

    renderSelector = (data, index, isSelected, onPress) => {
        return (
            <View 
                style = { styles.containerBtn } 
            >
                <Button
                    onPress = { onPress }
                    style = { styles.containerBtn }
                    title = { data.optionText }
                    key = { `button_${index}` }
                    color = { isSelected ? 'gray' : GREEN }
                />
            </View>
        );
    }

    renderQuestionText = (questionText) => {
        return (
            <Text 
                style = { styles.textQuestion }
            >
                { questionText}
            </Text>
        ); 
    }

    renderTextInput = (onChange, value, placeholder, onBlur) => {
        return (
            <TextInput
                value = { value }
                onBlur = { onBlur }
                style = { styles.inputStyle }
                placeholder = { placeholder }
                onChangeText = { text => onChange(text) }
            />
        );
    }

    renderNumericInput = (onChange, value, placeHolder, onBlur) => {
        return (
            <TextInput 
                maxLength = { 10 }
                onBlur = { onBlur }
                value = { String(value) }
                keyboardType = { 'numeric' }
                placeholder = { placeHolder }
                style = { styles.inputStyle }
                onChangeText = { text => onChange(text) }
                placeholderTextColor = { 'black' }
            />
        );
    }

    renderInfoText = (infoText) => {
        return (
            <Text 
                style = { styles.infoText }
            >
                { infoText }
            </Text>
        );
    }

    renderButton(data, index, isSelected, onPress) {
        return (
            <View
                key = {`selection_button_view_${index}`}
                style = { styles.rendeButton }
            >
                <Button
                    onPress = { onPress }
                    key = { `button_${index}` }
                    title = { data.optionText }
                    color = { isSelected ? COLORS.secondary : COLORS.subtitle }
                    style = { styles.nextBtn }  
                />
            </View>
        );
    }

    renderFinishedButton(onPress, enabled) {
        return (
            <View 
                style = { styles.containerBtn }
            >
                 <Pressable 
                    onPress = { onPress }
                    disabled = {!enabled}
                    style = { styles.nextBtn } 
                >
                    <Text 
                        style = {styles.text}
                    >
                        Finalizar
                    </Text>
                </Pressable>
            </View>
        );
    }

    onSurveyFinished(answers) {

        const infoQuestionsRemoved = [...answers];

        // Convert from an array to a proper object. This won't work if you have duplicate questionIds
        
        let answersQuestionsId = [];

        let answersQ = {};
        
        for (const elem of infoQuestionsRemoved) { 
            if(elem.value.hasOwnProperty('optionText')) { 
                answersQ = {
                    "answer": elem.value.value,
                    "question_id": elem.questionId
                };
            }else{
                if(typeof elem.value === 'string'){
                    answersQ = {
                        "answer": elem.value.trim(),
                        "question_id": elem.questionId,
                    };
                }else{
                    answersQ = {
                        "answer": elem.value,
                        "question_id": elem.questionId
                    };
                }
            }

            answersQuestionsId.push(answersQ);
        }

        this.getLocation();

        if(this.state.latitude.toString() !== '' || this.state.longitude.toString() !== ''){

            let images = '';

            this.state.images.forEach(image => {
                images += image.path+",";
            });

            images = images.slice(0,-1);

            answersQuestionsId.forEach((element, i) => {
                transactionDB(
                    `
                        INSERT INTO answers
                        ( answer, survey_id, question_id, user_id, lat, long, uri, created_at )
                        VALUES (?, ?, ?, ?, ?, ?, ?, (datetime('now','localtime')))
                    `,
                    [   element.answer, 
                        this.props.route.params.survey_id, 
                        element.question_id, 
                        this.state.username, 
                        this.state.latitude.toString(), 
                        this.state.longitude.toString(),
                        images
                    ], 
                );
            });

            ToastAndroid.show("Respuestas almacenadas!", ToastAndroid.LONG);
            this.props.navigation.navigate('Hexa');
        }else{
            ToastAndroid.show("Vuelva a intentar, aún no obtenemos tú ubicación!", ToastAndroid.LONG);
        }
    }

    onAnswerSubmitted(answer) {
        this.setState({ answersSoFar: JSON.stringify(this.surveyRef.getAnswers(), 2) });
    }

    UNSAFE_componentWillMount(){
        
        getToken().then((value) => this.setState({ 'username': value.username }));

        db.transaction((tx) => {
            tx.executeSql(
              `
              SELECT 
                q.placeholderText placeholderText,
                q.questionId questionId,
                q.questionText questionText,
                q.questionType questionType,
                q.options options
              FROM questions q
              WHERE q.survey_id = ?
              `,
              [ this.props.route.params.survey_id ],
              (tx, results) => {
                let temp = [];
                const size = results.rows.length;
                this.setState({quantity_questios: size-1});

                for (let i = 0; i < size; ++i){ 

                    let data = results.rows.item(i).options != null ?  {
                        questionType: results.rows.item(i).questionType,
                        questionText:  results.rows.item(i).questionText,
                        questionId: results.rows.item(i).questionId,
                        placeholderText:  results.rows.item(i).placeholderText,
                        options: this.convertObjectToArray(eval(results.rows.item(i).options))
                      } : {
                        questionType: results.rows.item(i).questionType,
                        questionText:  results.rows.item(i).questionText,
                        questionId: results.rows.item(i).questionId,
                        placeholderText:  results.rows.item(i).placeholderText,
                      }
                    temp.push(data);
                }

                this.setState({surveys: temp});
                this.setState({timePassed: true});
              },
              error => {
                ToastAndroid.show(`Fallo el registro de la encuesta ${error.message}`, ToastAndroid.LONG);
              }
            );
        });
    }

    convertObjectToArray = (object) => {
        
        let options = [];
        let claves = Object.keys(object);
        const size = claves.length;

        for(let i=0; i < size; i++){
          options.push(object[claves[i]]);
        }
    
        return options;
    }
 
    render() {
        return (
        
            !this.state.timePassed ?  (
                <View style = { styles.container } >
                    <ActivityIndicator 
                        size = "large"
                        style = { styles.spinner }  
                        color = { COLORS.secondary }
                    />
                </View>
            ):(
                <ScrollView>
                    <Offline />
                    <SimpleSurvey
                        survey = { this.state.surveys }
                        ref = {(s) => { this.surveyRef = s; }}
                        containerStyle = { styles.surveyContainer }
                        renderInfo = { this.renderInfoText }
                        renderTextInput = { this.renderTextInput }
                        renderQuestionText = { this.renderQuestionText }
                        renderNumericInput = { this.renderNumericInput }
                        renderNext = { this.renderNextButton.bind(this) }
                        renderSelector = { this.renderButton.bind(this) }
                        renderPrevious = { this.renderPreviousButton.bind(this) }
                        renderFinished = { this.renderFinishedButton.bind(this) }
                        selectionGroupContainerStyle = { styles.selectionGroupContainer}
                        onAnswerSubmitted = {(answer) => this.onAnswerSubmitted(answer) }
                        onSurveyFinished = {(answers) => this.onSurveyFinished(answers) }
                        navButtonContainerStyle = {{ flexDirection: 'row', justifyContent: 'space-around' }}
                    />
                   <TouchableOpacity
                        onPress = { this.openImageLibrary }
                        style = { styles.buttonFloat }
                    >
                        <MaterialIcon size="extraLarge" name="camera" color= { COLORS.secondary }  />
                    </TouchableOpacity>
                    <ScrollView
                        style = { styles.imagesScroll }
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={200}
                        pagingEnabled
                        decelerationRate="fast"
                    >
                        {this.state.images.length > 0 &&
                            this.state.images.map(image => (
                            <View  style = { styles.images }  key={image.path}>
                                <Image 
                                    style={{
                                        height: 80,
                                        width: 80
                                    }}
                                    source={{uri: image.path}}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </ScrollView>
            )
        );
    }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.background,
    },
    imagesScroll:{
        margin:20,
        textAlign:'center',
        alignContent: 'center',
    },
    scrollView:{
        marginHorizontal: 1,
    },
    images:{
        margin:2,
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    surveyContainer: {
        padding:10,
        paddingTop: 100,
    },
    rendeButton: {
        elevation: 3,
        marginTop: 10, 
        marginBottom: 5,
        borderWidth: 2,
        borderRadius: 30,  
        justifyContent: 'flex-start'
    },
    selectionGroupContainer: {
        flexDirection: 'column',
        alignContent: 'flex-end',
        backgroundColor: COLORS.background,
    },
    background: {
        flex: 1,
        minHeight: 800,
        maxHeight: 800,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textQuestion:{
        fontSize: 20,
        color: 'black',
        paddingTop: 30,
        paddingBottom:40,
        fontWeight:'bold',
        textAlign: 'center',
        fontFamily:'italic',
    },
    inputStyle: {
        padding: 5,
        borderWidth: 1,
        borderRadius: 10,
        textAlign:'center',
        borderColor: COLORS.primary,
        backgroundColor: COLORS.background,
        textAlignVertical: 'center',
    },
    backBtn:{
        elevation: 3,
        borderWidth:1,
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor:'white',
        justifyContent: 'center',
        borderColor: COLORS.primary,
    },
    nextBtn:{
        elevation: 3,
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        paddingHorizontal: 32,
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
    },
    textBack: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: COLORS.primary,
    },
    text: {
        fontSize: 16,
        color: 'white',
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
    containerBtn:{
        paddingTop:40,
    },
    infoText: {
        fontSize: 20,
        marginBottom: 20,
    },
    buttonFloat: {
      top: 35,
      right: 20,
      width: 40,
      height: 50, 
      paddingTop:5,
      borderRadius: 100,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    }
});