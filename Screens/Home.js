import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { getAuth, signOut } from "firebase/auth";



export default function Home({navigation}) {
	const auth = getAuth();


	function SignOutClicked(){
		signOut(auth).then(() => {
			// Sign-out successful.
			}).catch((error) => {
			// An error happened.
			});
	}
	



    return (
		<View 
			style={{
				justifyContent:'center',
				display:'flex',
				flex:1,
				backgroundColor:"white"
			}}>
			<TouchableOpacity
				style={styles.buttonsMain}
				onPress={() => {navigation.navigate("Chat")}}>
				<MaterialIcons name={"chat"} size={50} color="black"/>
				<Text style={styles.buttonText}>Chat</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.buttonsMain}
				onPress={() => {}}>
				<MaterialIcons name={"send"} size={50} color="black"/>
				<Text style={styles.buttonText}>Send a Notification</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.buttonsMain}
				onPress={() => {navigation.navigate("Settings")}}>
				<MaterialIcons name={"settings"} size={50} color="black"/>
				<Text style={styles.buttonText}>Settings</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.buttonsMain}
				onPress={() => ToastAndroid.show("Long Press to Logout",ToastAndroid.SHORT)}
				onLongPress={() => SignOutClicked()}>
				<MaterialIcons name={"logout"} size={50} color="black"/>
				<Text style={styles.buttonText}>Logout</Text>
			</TouchableOpacity>
			<DeveloperInfoDisplay/>
		</View>
    )
}

const styles = StyleSheet.create({
	buttonsMain:{
		borderWidth:0,
		borderColor:"gray",
		borderRadius:10,
		justifyContent:'center',
		alignSelf:'center',
		width:240,
		alignItems:"center",
		marginTop:10,
		marginBottom:10,
		paddingTop:20,
		paddingBottom:20,
		paddingLeft:20,
		paddingRight:20,
		backgroundColor:'white',
		shadowColor: '#000',
		shadowOffset: {
		width: 0,
		height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		flexDirection:"row",
		justifyContent:"flex-start"

	},
	buttonIcons:{

	},
	buttonText:{
		fontSize:17,
		textAlign:'center',
		marginLeft:10,
		fontWeight:500
	}

})

function DeveloperInfoDisplay(){
	const [iconSize, setIconSize] = useState(30);


	function IconClicked(){
		if (iconSize < 101){
			setIconSize(iconSize + 10)
		}
		else{
			setIconSize(30)
		}
	}


	return(
		<View style={{
			alignSelf:"center",
			marginTop:10
		}}>
			<Text 
				style={{
					textAlign:"center",
					marginBottom:0,
				}}>
				Designed and Developed {"\n"}by {"\n"}Shivam Jaiswal{"\n"}with
			</Text>
			<MaterialCommunityIcons 
				onPress={() => IconClicked()}
				style={{
					marginTop:0,
					alignSelf:'center',
				}}
				name='heart' 
				size={iconSize} 
				color={"red"}/>
		</View>
	)
}