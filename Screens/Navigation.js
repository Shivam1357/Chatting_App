import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from './Chat';
import Home from './Home';
import Settings from './Settings';


export default function Navigation() {
	const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen
				name="Home"
				component={Home}
				options={{
					title: 'Home',
					headerTitleAlign:'center',
					// headerTitleStyle: {
					// 	fontWeight: 600,
					// 	fontSize:25,
					// },
				}}
				/>
				<Stack.Screen
				name="Chat"
				component={Chat}
				options={{
					title: 'Chat',
					headerTitleAlign:'center',
					headerBlurEffect:"extraLight"
				}}
				/>
				<Stack.Screen
				name="Settings"
				component={Settings}
				options={{
					title: 'Setting',
				}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
    );
}


