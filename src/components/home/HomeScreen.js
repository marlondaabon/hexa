import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';
import { FlashList } from "@shopify/flash-list";


import {  logout  } from "../../libs/asyncStorage"; 
import { COLORS } from "../../res/generalStyles";
import { HttpPostGet } from "../../libs/https";

import MaterialIcon from "../../libs/MaterialIcon";
import transactionDB from "../../libs/database";
import { uploadImages } from "../../libs/utils";
import endpoints from "../../libs/endPoint";
import Offline from "../Offline/Offline"; 

const db = openDatabase({ name: 'surveys' });

function  HomeScreen({ navigation }) {

  const [sync, setSync] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  
  /**
   * @return All surveys from survey db 
  */
  useEffect(() => { 
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM surveys ORDER BY surveys.title',
        [],
        (tx, results) => {
          var temp = [];
          const size = results.rows.length;
          for (let i = 0; i < size; ++i)
            temp.push(results.rows.item(i));
          setFilteredDataSource(temp);
          setMasterDataSource(temp)
        }
      );
    });

  }, []);  
  
  /**
   * @return Send data to CADI and Truncate table Answers 
  */
  const sendAnswers = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM answers',
        [],
        async (txn, results) => {
          var temp = [];
          let images = [];

          const size = results.rows.length;
          if(size > 0){
            for(let i = 0; i < size; ++i){

              let imgs = results.rows.item(i).uri.split(',');
              imgs.forEach(element => {
                if(element!=""){
                  images.push({
                    "uri":element, 
                    "survey_id":results.rows.item(i).survey_id,
                    "user_id":results.rows.item(i).user_id,
                    "created_at":results.rows.item(i).created_at,
                  });
                }
              });

              temp.push(results.rows.item(i));
            }  
            
            // Delete images duplicated 
            let imagesSend = images.filter((images, index, self) => index === self.findIndex((t) => (t.uri === images.uri)))

            NetInfo.fetch().then(async state => {
              if(state.isConnected){
                const resp = await HttpPostGet(endpoints.sync, JSON.stringify(temp));
                uploadImages(imagesSend);

                if(resp === `"OK"`){
                  setSync(true);
                  ToastAndroid.show("Respuestas sincronizadas!", ToastAndroid.LONG);
                  transactionDB(`
                    DELETE FROM answers
                  `);
                }else{
                  ToastAndroid.show("No ha sido posible sincronizar las respuestas!", ToastAndroid.LONG);
                }
              }else{
                ToastAndroid.show("No tienes conexión a internet!", ToastAndroid.LONG);
              }
            });
          }else{
            ToastAndroid.show("No hay respuestas por sincronizar!", ToastAndroid.LONG);
          }
        }
      );
    });
  }

  /**
   * @return Set text and filter surveys
  */
  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const handlePress = (item) => navigation.navigate('Survey', { survey_id: item.id });

  const ItemView = ({item}) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View
          style={{
            padding: 16,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 35 / 2,
              marginRight: 16,
              backgroundColor: '#3b5a3b',
            }}
            size="giant"
          >
            <Text
              adjustsFontSizeToFit
              numberOfLines = { 1 }
              style={{
                marginTop: 0,
                fontSize: 25,
                color: 'white',
                textAlign: 'center',
              }}
            >
              {item.title.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              marginRight: 70
            }}
          >
            {  item.title  }
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ListFooterView = () => {
    return (
      <View
        style={{
          margin: 20,
        }}
      />
    );
  };

  const logoutAlert = () => {
    Alert.alert(
      'Hexa sesión',
      '¿Desea cerrar la sesión?',
      [
        {
          text: "No",
          onPress: null,
          style: "cancel"
        },
        {
          text: 'Si', 
          onPress: async () => {
            await logout(); 
            navigation.navigate('Login'); 
          } 
        },
      ],
      { 
        cancelable: true 
      }
    );
  }


  return (
    <View 
      style = {styles.container}
    >
      <Offline />
      <View style = {styles.inputView}>
        <MaterialIcon 
          size="extraLarge" 
          name="text-box-search" 
          color= { COLORS.secondary }  
        />
        <TextInput
          value = { search }
          placeholderTextColor = "black"
          style = {styles.textInputStyle}
          placeholder = "Buscar Hexa"
          underlineColorAndroid = "transparent"
          onChangeText = {text => searchFilterFunction(text)}
        />
      </View>
      
      <View  
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text 
          style = { styles.area }
          >
            Sostenibilidad
        </Text>
        <TouchableOpacity
          style={{
            paddingRight:20
          }} 
          onPress = { () => sendAnswers() } 
        >
          <MaterialIcon  
            size = "extraLarge" 
            name = { !sync ? "cloud-sync-outline" : "cloud-sync"} 
            color = { COLORS.primary } 
          />
        </TouchableOpacity>
      </View>
      
      <FlashList
        initialNumToRender = { 5 }
        estimatedItemSize = { 200 }
        maxToRenderPerBatch = { 10 }
        data = { filteredDataSource }
        onEndReachedThreshold = { 0.1 }
        renderItem = { i => ItemView(i) }
        keyExtractor = { item => item.id }
        showsVerticalScrollIndicator = {false}
        contentContainerStyle = {styles.flatListContentContainer}
        ListFooterComponent = {
          filteredDataSource.length == 0 ? (
            <ActivityIndicator 
              size = "large"
              style = { styles.spinner }  
              color = { COLORS.secondary }
            />
          ) : (
            <ListFooterView />
          )
        }
      />
      <TouchableOpacity
          onPress = { logoutAlert }
          style = { styles.buttonFloat }
      >
        <MaterialIcon size="extraLarge" name="logout" color= { COLORS.secondary }  />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  center: {
    height: 2,
    width: '90%',
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: COLORS.subtitle,
  },
  actionButtons:{
    display: 'flex',
    flexDirection: 'row', 
    paddingHorizontal: 50,
    justifyContent: 'space-around',
  },
  flatListContentContainer: {
    padding: 3,
    backgroundColor: 'transparent',
  },
  area: {
    paddingTop: 5,
    paddingLeft: 20,
    fontWeight: 'bold',
  },
  itemStyle: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
    fontWeight: 'bold',
  },
  textInputStyle: {
    margin: 15,
    height: 40,
    fontFamily: 'italic',
    borderColor: COLORS.primary,
    backgroundColor: COLORS.thirds,
  },
  buttonFloat: {
    right: 20,
    width: 40,
    bottom: 20,
    height: 50, 
    borderRadius: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginTop: 20,
    marginBottom: Platform.OS === "android" ? 90 : 60
  },
  inputView: {
    height: 45,
    margin: 15,
    width: '92%',
    borderWidth: 2,
    paddingLeft: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.primary,
    backgroundColor: COLORS.thirds,
  },
});

export default HomeScreen;
