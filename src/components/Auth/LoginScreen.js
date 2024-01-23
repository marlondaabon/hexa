import React, { useState } from "react";
import { 
    View,
    Text, 
    TextInput, 
    Pressable, 
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { useFormik } from "formik";
import * as Yup from "yup";

import MaterialIcon from "../../libs/MaterialIcon";

import { HttpPost } from "../../libs/https";
import { COLORS } from "../../res/generalStyles";
import { storeToken  } from "../../libs/asyncStorage"; 
import { useTogglePasswordVisibility } from "../../hooks/useTextVisible";
import { repeatString, insertDataSurveys, insertDataQuestions } from "../../libs/utils";
import  transactionLogin  from "../../libs/queryEntry"; 
import transactionDB from "../../libs/database"; 
import endpoints from "../../libs/endPoint"; 
import Offline from "../Offline/Offline";

const TEXT_COLOR = "#d58b1f";

function LoginScreen({ navigation }){

    const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
    const [ error, setError ] = useState("");

    let formData = new FormData();
    
    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object(validationSchema()),
        validateOnChange:false, 
        onSubmit: async (formValue) => {
            setError("");
            const { username, password} = formValue;

            if(username == "" || password == ""){
                setError("Usuario o contraseña incorrecta");
            }else{
                formData.append('username', username);
                formData.append('password', password);

                const response = await HttpPost(
                    endpoints.login, 
                    formData
                );

                if(response.employee_id == "Usuario invalido"){
                    setError("Las creedenciales ingresadas son incorrectas");
                }else{
                    
                    transactionLogin();

                    response.surveys.map((md)=>{
                        transactionDB(
                            `
                                INSERT INTO surveys
                                ( id, title )
                                VALUES ( ?, ? )
                            `,
                            [ md.id, md.title ], 
                        );
                    });

                
                    response.questions.map((q)=>{
                        transactionDB(
                            `
                                INSERT INTO questions
                                ( questionId, questionText, survey_id, placeholderText, questionType, options )
                                VALUES ( ?, ?, ?, ?, ?, ? )
                            `,
                            [ q.questionId, q.questionText, q.survey_id, q.placeholderText, q.questionType, JSON.stringify(q.options)], 
                        );

                    });
                    
                    storeToken({ username: response.employee_id});
                    navigation.navigate('Hexa');
                }
            }
        }
    });
    
    return (
        <>
            <Offline />
            <View style = { styles.container }>
                <Text style = { styles.title } > 
                    Hexa<MaterialIcon size = "extraLarge" name = "hexagon-slice-6" color = { COLORS.secondary } /> 
                </Text>
                
                <Text style = { styles.subtitle } > 
                    Ingresa con tus creedenciales de <Text style={{fontWeight: "bold"}}> CADI</Text>!
                </Text>

                <View style = {styles.inputView}>
                    <TextInput
                        style = {styles.TextInput}
                        keyboardType='numeric'
                        placeholder = "Usuario"
                        autoCapitalize="none"
                        value = {formik.values.username}
                        placeholderTextColor = { TEXT_COLOR }
                        onChangeText = { (text) => { 
                            formik.setFieldValue("username", text)
                        }}
                    />
                </View>
            
                <View style = {styles.inputView}>
                    <TextInput
                        style = {styles.TextInput}
                        placeholder = "Contraseña"
                        value = {formik.values.password}
                        placeholderTextColor = { TEXT_COLOR }
                        secureTextEntry = { passwordVisibility }
                        onChangeText = { (text) => { 
                            formik.setFieldValue("password", text)
                        }}
                    />
                    <Pressable onPress = { handlePasswordVisibility } >
                        <MaterialIcon size = "large" name = { rightIcon } color = { COLORS.secondary }  />
                    </Pressable>
                </View>
        
                <TouchableOpacity
                    style = {styles.loginBtn}
                    onPress = { formik.handleSubmit }
                >
                    <Text 
                        style = { styles.loginText }
                    >
                    Iniciar Sesión
                    </Text>
                </TouchableOpacity>

                <Text style={ styles.errors }>{ formik.errors.username }</Text>
                <Text style={ styles.errors }>{ formik.errors.password }</Text>
                <Text style={ styles.errors }>{ error }</Text>
            </View>
        </>
    )
}

function initialValues(){
    return {
        username:"",
        password:"",
    }
}

function validationSchema(){
    return {
        username: Yup.string().required("* Ingrese el usuario"),
        password: Yup.string().required("* Ingrese la contraseña"),
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.background,
    },
    title:{
        fontSize: 32,
        marginTop: 10,
        marginBottom: 30,
        fontWeight: 'bold',
        textAlign: "center",
        color: COLORS.secondary,
    },
    button:{
        elevation: 3,
        borderRadius: 4,
        paddingVertical: 5,
        alignItems: 'center',
        paddingHorizontal: 32,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    subtitle:{
        fontSize:16,
        paddingBottom: 40,
        fontStyle: 'italic',
        color: COLORS.subtitle,
    }, 
    inputView: {
        height: 45,
        width: '85%',
        borderWidth: 1, 
        marginBottom: 15,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        bordeColor: COLORS.primary,
        backgroundColor: COLORS.thirds,
    },
    TextInput: {
        padding: 10,
        fontSize: 16,
        width: '90%',
        fontWeight:'bold'
    },
    loginText:{
        fontSize:16,
        color: COLORS.thirds,
        fontWeight:'bold',
    },
    loginBtn:{
        height: 50,
        width: '85%',
        marginTop: 40,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
    }, 
    input:{
        margin: 5,
        padding: 5,  
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
    },
    errors:{
        marginTop: 20,
        fontStyle: 'italic',
        textAlign: 'center',
        color: COLORS.danger,
    },
    spinner: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      opacity: 0.5,
      justifyContent: 'center',
      alignItems: 'center'
    } 
});


export default LoginScreen;