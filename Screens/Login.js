import { Alert, Image, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { db } from "../firebase";
import { Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";





export default function Login() {


	///////////////////////////////
	//////////////////////////////
	//All Users Data
	//////////////////////////////
	const [allUsers, setAllUsers] = useState([]);
	async function GetUsersC(){
		const q = query(collection(db, "usersData"));
	
		const querySnapshot = await getDocs(q);
		var a = [];
		querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
			var b = doc.data();
			b['id'] = doc.id;
			a.push(b)
		});
		return a;
	}
	useEffect(() => {
		GetUsersC()
		.then((data)=>{
			setAllUsers(data);
		})
		.catch((e) =>{
			ToastAndroid.show("Some Error Occured", ToastAndroid.SHORT);
		})
	}, [])
	////////////////////////////////
	///////////////////////////////
	const [modalVisible, setModalVisible] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [photoUrl, setPhotoUrl] = useState("");
	const [name, setName] = useState("");

	console.log(password);



	const auth = getAuth();
	function LoginClicked(){
		signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			ToastAndroid.show("Logged in Successfully",ToastAndroid.SHORT) 
			const user = userCredential.user;
			// ...
		})
		.catch((error) => {
			ToastAndroid.show(error.message,ToastAndroid.SHORT)
			const errorCode = error.code;
			const errorMessage = error.message;
		});
	}
	


	return (
			<View style={{backgroundColor:'white',flex:1,flexDirection:"column-reverse",justifyContent:"center"}}>
				 <Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						//Alert.alert('Modal has been closed.');
						setModalVisible(!modalVisible);
						setEmail("");
						setName("");
						setPhotoUrl("");
						setPassword("");
					}}>
					<View style={styles.centeredView}>
						
						<View style={styles.modalView}>
							<Pressable
								style={{
									backgroundColor:"white",
									alignSelf:'flex-end',
									marginLeft:15,
									marginTop:5
								}}
								onPress={() => {
									setModalVisible(!modalVisible);
									setEmail("");
									setName("");
									setPhotoUrl("");
									setPassword("");
								}}>
									<FontAwesome name="close" size={25} color="black"/>
							</Pressable>

							<Text style={styles.modalText}>Hello, {name}</Text>
							<Image
							style={{...styles.userIconDisplayImage,height:60,width:60}}
							source={{
								uri: photoUrl ,
								}}
							/>
							<TextInput
								style={{
									fontSize:17,
									width:170,
									height:40,
									borderBottomColor:'black',
									borderBottomWidth:0.5,
									marginBottom:10,
									marginTop:10
								}}
								placeholder='Password'
								value={password}
								onChangeText={(text) => setPassword(text)}
							/>
							<Pressable
								style={{
									...styles.button,
									...styles.buttonClose,
									paddingLeft:20,
									paddingRight:20
								}}
								onPress={() => LoginClicked()}
								>
									<Text style={{fontSize:15}}>Login</Text>
							</Pressable>
						</View>
					</View>
				</Modal>

				

				{allUsers.map((user) =>
					<TouchableOpacity 
						key={user.id}
						style={{
							...styles.userIconDiv,
							display:modalVisible ? "none" : "flex",
						}}
						onPress={() => {
							setModalVisible(true);
							setEmail(user.email);
							setPhotoUrl(user.photoUrl);
							setName(user.name);
							}}>
						<Image
							style={styles.userIconDisplayImage}
							source={{
								uri: user.photoUrl ,
								}}
						/>
						<Text style={styles.userNameText}>{user.name}</Text>
					</TouchableOpacity>
				)}
				<Text style={{
					fontSize:25,
					alignSelf:'center',
					fontWeight:"bold",
					display:modalVisible ? "none" : "flex",
				}}>Hello, Please Login</Text>
			</View>
	)
}

const styles = StyleSheet.create({
	userIconDiv:{
		// width:110,
		// height:110,
		alignSelf:'center',
		marginTop:20,
		padding:20,
		marginBottom:20,
		borderWidth:0.5,
		borderColor:'gray',
		borderRadius:10,
	},
	userIconDisplayImage:{
		height:100,
		width:100,
		borderRadius:50,
		borderColor:"black",
		borderWidth:0.5,
	},
	userNameText:{
		fontSize:18,
		alignSelf:'center',
		marginTop:10,
		fontWeight:500
	},


	modalView: {
		margin: 100,
		backgroundColor: 'white',
		borderRadius: 20,
		padding:5,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
		  width: 0,
		  height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		position:"absolute",
		width:200,
		alignSelf:"center"

	  },
	  button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	  },
	  buttonOpen: {
		backgroundColor: '#F194FF',
	  },
	  buttonClose: {
		backgroundColor: '#2196F3',
	  },
	  textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	  },
	  modalText: {
		marginBottom: 15,
		textAlign: 'center',
		fontSize:17
	  },
})