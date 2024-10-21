import { Button, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { db } from '../firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';





export default function Chat({navigation}) {
	const currentUserUid = getAuth().currentUser.uid;
	const [allUsers, setAllUsers] = useState([]);
	const ScrollRef = useRef();
	const MessageInputRef = useRef();
	const [replyMessageC, setReplyMessageC] = useState("");
	const [replyMessageIdC, setReplyMessageIdC] = useState("");


	//const [floatingMenuActive, setFloatingMenuActive] = useState(false);





	useEffect(() => {
		GetAllUsers()
		.then((data) =>{
			setAllUsers(data);
		})
		.catch((e) =>{
			console.log(e);
		})
	}, []);
	//console.log(allUsers)

	async function GetAllUsers(){
		var a = [];
		console.log("en")
		const querySnapshot = await getDocs(collection(db, "usersData"));
		querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots

			var b = doc.data();
			b["docId"] = doc.id ;
			a.push(b);
		});
		return a;
	}
	console.log(replyMessageC);
	
	const [modalVisible, setModalVisible] = useState(true);

	return (
		<View style={{
			display:"flex",
			flex:1,
			backgroundColor:"white",
			flexDirection:'column'
		}}>
			{/* <Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
				Alert.alert('Modal has been closed.');
				setModalVisible(!modalVisible);
				}}>
				<View > 
				<View 
					style={{
						margin: 0,
						backgroundColor: 'white',
						borderRadius: 20,
						padding: 35,
						alignItems: 'center',
						shadowColor: '#000',
						shadowOffset: {
						width: 0,
						height: 2,
						},
						shadowOpacity: 0.25,
						shadowRadius: 4,
						elevation: 5,
					}}>
					<Text>Hello World!</Text>
					<Pressable
					style={{
						borderRadius: 20,
						padding: 10,
						elevation: 2,
						backgroundColor: '#2196F3',
					}}
					onPress={() => setModalVisible(!modalVisible)}>
					<Text>Hide Modal</Text>
					</Pressable>
				</View>
				</View>
			</Modal>
			<Button
				title='Click'
				onPress={() => setModalVisible(true)}
				/> */}

			<View style={{
				borderWidth:0,
				marginBottom:10,
				flex:1
			}}>
				{allUsers.length !== 0 &&
				<Messages 
					navigation={navigation} 
					currentUserUid={currentUserUid} 
					allUsers={allUsers}
					ScrollRef={ScrollRef}
					setReplyMessageC={setReplyMessageC}
					setReplyMessageIdC={setReplyMessageIdC}
					MessageInputRef={MessageInputRef} />
				}
			</View>
			
			

			<View style={{
				marginBottom:10,
				marginTop:0,
				paddingLeft:3,
				paddingRight:3,
				width:"100%",
				bottom:0,
				borderWidth:0,
				alignSelf:'flex-end'
			}} >
				<BottomBar 
					currentUserUid={currentUserUid}
					ScrollRef={ScrollRef}
					replyMessageC={replyMessageC}
					replyMessageIdC={replyMessageIdC}
					setReplyMessageC={setReplyMessageC}
					setReplyMessageIdC={setReplyMessageIdC}
					MessageInputRef={MessageInputRef} />
			</View>
		</View>
	)
}


function Messages({
		navigation,
		currentUserUid,
		allUsers, 
		ScrollRef,
		setReplyMessageC,
		setReplyMessageIdC,
		MessageInputRef,
	}){
	const [replyMessageHighlightId, setReplyMessageHighlightId] = useState("");
	useEffect(() => {
		setTimeout(() => {
			setReplyMessageHighlightId("")
		}, 5000);
	}, [replyMessageHighlightId])
	



	const [messages, setMessages] = useState([]);
	const [floatingMenuActiveId, setFloatingMenuActiveId] = useState("");


	useEffect(() => {
		const q = query(collection(db, "chatMessages"),orderBy("time", 'asc'));
		onSnapshot(q , {includeMetadataChanges:true} , (querySnapshot) => {
		const m = [];
		querySnapshot.forEach((doc) => {
			var a = doc.data();
			a["docId"] = doc.id;
			a["hasPendingWrites"] = doc.metadata.hasPendingWrites;
			m.push(a);
		});
		setMessages(m);
		});
	}, [])
	//console.log(messages);
	
	

	useEffect(() => {
		setTimeout(() => {
			ScrollRef.current.scrollToEnd({animated:false});
		}, 50);
	}, []);



	

	return(
		<View>
			<ScrollView 
				ref={ScrollRef}
				onScroll={() => {setFloatingMenuActiveId("")}}>
				<View style={{
					borderWidth:0,
					paddingBottom:5,
					paddingTop:10,
				}}>
					{/* <Message 
						isReplyMessage={true}
						outgoingMessage={true}
						message={"Hello how are"}
						time={"8:30 PM"} />
					<Message
						isReplyMessage={false}
						outgoingMessage={false}
						message={"abs"}
						time={"8:30 PM"} /> */}

					{messages.map((message) => 
						<Message 
							messageId={message.docId}
							allMessages={messages}
							message={message.message}
							time={ConvertTime(message.time)}
							isReplyMessage={message.isReplyMessage}
							replyMessageId={message.replyMessageId}
							outgoingMessage={message.senderUid === currentUserUid}
							photoUrl={allUsers.filter(user => user.userUid !== currentUserUid)[0].photoUrl}
							hasPendingWrites={message.hasPendingWrites}
							replyButtonCliced={
								() => {
									setReplyMessageC(message.message);
									setReplyMessageIdC(message.docId);
									MessageInputRef.current.focus();
								}
							}
							replyMessageHighlightId={replyMessageHighlightId}
							setReplyMessageHighlightId={setReplyMessageHighlightId}
							setFloatingMenuActiveId={setFloatingMenuActiveId}
							floatingMenuActiveId={floatingMenuActiveId}
						/>
					)}
					{/* <Text>Messages</Text> */}
				</View>
			</ScrollView>
		</View>
	)
}



function BottomBar({
		currentUserUid, 
		ScrollRef, 
		replyMessageIdC,
		replyMessageC,
		setReplyMessageC,
		setReplyMessageIdC,
		MessageInputRef,
	}){
	const [message, setMessage] = useState("");
	const [sendButtonDisabled, setSendButtonDisabled] = useState(false);


	function SendMessage(){
		setSendButtonDisabled(true);
		addMessage()
		.then(() =>{
			setMessage("");
			setSendButtonDisabled(false);
			ScrollRef.current.scrollToEnd({animated:true});
		})
		.catch(() => {

		})
	}
	async function addMessage(){
		await addDoc(collection(db, "chatMessages"), {
			message : message,
			senderUid : currentUserUid,
			time : new Date().getTime(),
			isReplyMessage : replyMessageC ? true : false ,
			replyMessageId : replyMessageIdC,
		});
	}

	return(
		<View style={{
			display:'flex',
			flexDirection:'row',
		}} >
			<View style={{
				display:'flex',
				flex:1,

			}}>
				{replyMessageC &&
					<View style={{
						borderWidth:0.7,
						borderBottomWidth:0.1,
						margin:2,
						marginBottom:2,
						borderTopRightRadius:5,
						borderTopLeftRadius:10,
						display:'flex',
					}}>
						<TouchableOpacity
							onPress={()=>{
								setReplyMessageC("");
								setReplyMessageIdC("");
							}} 
							style={{
								alignSelf:'flex-end',
								marginRight:5,
								marginTop:5
							}}>
							<MaterialIcons name="close" size={20}/>
						</TouchableOpacity>
						<Text 
							style={{
								paddingLeft:5,
								paddingRight:5,
								paddingBottom:5,
								marginTop:-5,
							}}>
							{replyMessageC}
						</Text>
					</View>
				}
				<TextInput
					ref={MessageInputRef}
					value={message}
					// onFocus={() => {
					// 	setTimeout(() => {
					// 		ScrollRef.current.scrollToEnd({animated:true})
					// 	}, 50);
					// }}
					onChangeText={(text) => setMessage(text)}
					placeholder='Message'
					multiline={true}
					style={{
						borderWidth:0,
						borderRadius:20,
						backgroundColor:'#e1e3e1',
						fontSize:16,
						paddingTop:5,
						paddingBottom:5,
						paddingLeft:10,
						paddingRight:10,
					}}
				/>
			</View>


			<Pressable
				onPress={() => SendMessage()}
				disabled={sendButtonDisabled}
				style={{
					borderWidth:0.5,
					width:50,
					justifyContent:'center',
					borderRadius:12,
					marginLeft:2,
					height:40,
					alignSelf:'flex-end'
				}}>
				<Text 
					style={{
						fontSize:17,
						textAlign:"center"
					}}
				>Send</Text>
			</Pressable>

		</View>
	)
}

function DeleteMessageClicked(msgId){
	DeleteMessage(msgId).then(() => {}).catch(() => {})
}
async function DeleteMessage(msgId){
	await deleteDoc(doc(db, "chatMessages", msgId));
}




function Message({
			messageId,
			allMessages,
			message,
			time,
			isReplyMessage,
			replyMessageId,
			outgoingMessage,
			photoUrl,
			hasPendingWrites,
			replyButtonCliced,
			setReplyMessageHighlightId,
			replyMessageHighlightId,
			setFloatingMenuActiveId,
			floatingMenuActiveId,
}){
	const borderRadius = 20;
	//console.log(photoUrl);

	return(
		<View style={{
			borderWidth:0,
			justifyContent:'flex-start',
			flexDirection:outgoingMessage ? 'column' : 'row',
			backgroundColor:replyMessageHighlightId === messageId ? "#dcfaf6" : 'white'
		}}>
			<View style={{
					display:floatingMenuActiveId === messageId ? "flex" : "none",
					position:'absolute',
					zIndex:1,
					height:"100%",
					width:"100%",
			}}>
				<View style={{
					justifyContent:'center',
					alignItems:'center',
					backgroundColor:'white',
					height:40,
					width:outgoingMessage ? 210 : 140,
					borderWidth:0,
					borderRadius:10,
					alignSelf:'center',
					flexDirection:'row',
					justifyContent:'space-evenly',
					marginTop:10,
					shadowOpacity: 0.25,
					shadowRadius: 4,
					elevation: 5,
				}}>
					{outgoingMessage &&
						<TouchableOpacity 
							style={{
								flexDirection:"row",
								justifyContent:'center',
								alignItems:'center'
							}}
							onPress={() => {DeleteMessageClicked(messageId)}}>
							<Text style={{color:'red',fontSize:16}}>Unsend</Text>
							<MaterialIcons name="delete" size={25} color={"red"}/>
						</TouchableOpacity>
					}
					<TouchableOpacity 
						style={{
							flexDirection:"row",
							justifyContent:'center',
							alignItems:'center'
						}}
						onPress={() => {
							Clipboard.setStringAsync(message);
							setFloatingMenuActiveId("");
						}}>
						<Text style={{fontSize:16}}>Copy</Text>
						<MaterialIcons name="content-copy" size={25} color={"black"}/>
					</TouchableOpacity>
					<TouchableOpacity 
						onPress={() => setFloatingMenuActiveId("")}
						style={{
							flexDirection:"row",
							justifyContent:'center',
							alignItems:"center",
							marginLeft:10
						}}>
						<MaterialIcons name="cancel" size={20} color={"black"}/>
					</TouchableOpacity>
				</View>
			</View>
			
			{!outgoingMessage &&
				<Image
					style={{
						height:30,
						width:30,
						borderWidth:0.1,
						borderColor:"black",
						borderRadius:50,
						alignSelf:'center',
						marginLeft:3
					}}
					source={{
						uri: photoUrl,
						//uri: "https://wallpapers.com/images/featured-full/nobita-7cj55xygrt5by3ld.jpg",
						}}
				/>
			}
			
			<View style={{
				borderWidth:0,
				alignSelf:outgoingMessage ? 'flex-end' : 'flex-start' ,
				marginTop:3,
				marginBottom:10,
				marginLeft:outgoingMessage ? 40 : 5,
				marginRight:outgoingMessage ? 5 : 60,
				borderTopLeftRadius:borderRadius,
				borderTopRightRadius:borderRadius,
				borderBottomRightRadius:outgoingMessage ? 5 : borderRadius,
				borderBottomLeftRadius:outgoingMessage ? borderRadius : 5,
				minWidth:100,
				backgroundColor:"white",
				shadowOpacity: 0.25,
				shadowRadius: 4,
				elevation: 5,
			}}>
				{isReplyMessage &&
					<View style={{
						borderBottomWidth:1,
						borderColor:"gray"
					}}>
					<TouchableOpacity 
							onPress={() =>{
								setReplyMessageHighlightId(replyMessageId);
							}}
						>
						<Text 
							style={{
								margin:0,
								padding:6,
								// paddingLeft:4,
								// paddingRight:4,
								color:"gray",
							}}>
							{allMessages.filter(m => m.docId == replyMessageId)[0].message}
							{/* Hello, how are you idjksjisjdiijidssjkicsjichduicndjcnsiuncusnbijnuwhjudnbshjbvcnskjoicajsc sj
						 */}
						</Text>
					</TouchableOpacity>
					</View>
				}
				<Text 
					onLongPress={() => setFloatingMenuActiveId(messageId)}
					onPress={replyButtonCliced}
					style={{
						borderWidth:0,
						fontSize:isEmoji(message) ? 35 : 16.5,
						fontWeight:400,
						marginTop:3,
						marginBottom:3,
						marginLeft:9,
						marginRight:9,
					}}>
					{message}
				</Text>
				<View style={{
					alignSelf:'flex-end',
					marginRight:outgoingMessage ? 3 : 9,
					marginBottom:3
				}}>
					{hasPendingWrites ?
						<MaterialIcons name={"access-time"} color={"gray"}/>
					:
						<Text 
							style={{
								fontSize:10,
								textAlign:'right',
								color:"gray",
							}}>
							{time}
						</Text>
					}
				</View>
			</View>
		</View>
	)
}



function ConvertTime(time){
	var d = new Date(time);
	var a = d.toLocaleDateString().split("/");
	var t = a[1] + "/" + a[0] + "/" + a[2];
	var b = d.toLocaleTimeString().replace(" ",":").split(":");
	var b = b[0] + ":" + b[1] + " " + b[3]; 
	return t + "\n" + b;
}
function isEmoji(str) {
    var ranges = [
        '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
    ];
    if (str.match(ranges.join('|'))) {
        return true;
    } else {
        return false;
    }
}


const styles = StyleSheet.create({
	  


});