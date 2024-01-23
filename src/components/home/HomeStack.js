import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
    View,
    StyleSheet,
    ActivityIndicator
} from "react-native";

import { COLORS } from "../../res/generalStyles";

import HomeScreen from './HomeScreen';
import SurveyScreen from './SurveyScreen';
import LoginScreen from '../Auth/LoginScreen';


import { getToken  } from "../../libs/asyncStorage"; 

const Stack = createStackNavigator();

class HomeStack extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          initRouteName: false,
          loading: true
        };
    }

    UNSAFE_componentWillMount(){

        getToken()
        .then((value) => {
            if(value.username!=-1) {
                this.setState({ initRouteName: true });
            }
        });
        
        setTimeout(()=>{
            this.setState({ loading: false });
        }, 500);

    }

    render(){
        
        return (
            
            this.state.loading ? (
                <View  style = { styles.container }>
                    <ActivityIndicator 
                        size = "large"
                        style = { styles.spinner }  
                        color = { COLORS.secondary }
                    />
                </View>
            
            ) : (      

                <Stack.Navigator
                    initialRouteName= { this.state.initRouteName ? 'Hexa' : 'Login' }
                    screenOptions = {{
                        headerShown: false
                    }}
                >

                    <Stack.Screen 
                        name = "Login" 
                        component  = { LoginScreen }
                    />
                    <Stack.Screen 
                        name = "Hexa" 
                        component  = { HomeScreen }
                    />
                    <Stack.Screen 
                        name = "Survey" 
                        component  = { SurveyScreen }
                    />
                </Stack.Navigator>
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
    spinner: {
        marginTop: 20,
        marginBottom: Platform.OS === "android" ? 90 : 60
    }
});
  
export default HomeStack;