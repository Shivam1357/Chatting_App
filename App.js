import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import Login from './Screens/Login';
import Navigation from './Screens/Navigation';

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const auth = getAuth();
	onAuthStateChanged(auth, (user) => {
	if (user) {
		setIsLoggedIn(true);
		// ...
	} else {
		setIsLoggedIn(false);
		// User is signed out
		// ...
	}
	});

	if (isLoggedIn){
		return (

			<Navigation/>
			
			
		);
	}
	else{
		return(
			<Login/>
		)
	}
    
}


