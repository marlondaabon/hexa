import React from "react";
import {
    View,
    Text,
    Dimensions,
    StyleSheet
} from "react-native";
import MaterialIcon from "../../libs/MaterialIcon";

import NetInfo from '@react-native-community/netinfo';

import  { COLORS }  from '../../res/generalStyles'

const { width } = Dimensions.get('window');

/**
 *
 * @returns Component with strip information about Offline 
 */
class Offline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isOnline: true
        };
    }

    UNSAFE_componentWillMount(){
        NetInfo.fetch().then(state => {
            this.setState({ isOnline: state.isInternetReachable});
        });
    }

    render() {
        return (
            this.state.isOnline ? 
            (
                <>
                </>
            ):(
                <View style = { styles.containter }>
                    <Text style = { styles.text }> 
                        Estamos Offline <MaterialIcon size = "medium" name = "access-point-network-off" color = { COLORS.text } />
                    </Text>
                </View>
            )
        )
    }
}

const styles = StyleSheet.create({
    containter:{
        width,
        height: 30,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
    },
    text:{
        fontSize: 17,
        color:'white',
        fontWeight:'bold',
        fontFamily:'italic'
    }
});


export default Offline;