import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import 'react-native-gesture-handler'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import AddChatScreen from './screens/AddChatScreen'
import ChatMessageScreen from './screens/ChatMessageScreen'
import Rough from './screens/Rough'
const Stack = createStackNavigator()

const globalScreenOptions = {
    headerStyle: { backgroundColor: '#958dc4' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white',
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={globalScreenOptions}>
                <Stack.Screen name='Login' component={LoginScreen} />
                <Stack.Screen name='Register' component={RegisterScreen} />
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='AddChat' component={AddChatScreen} />
                <Stack.Screen name='Chat' component={ChatMessageScreen} />
                <Stack.Screen name='Rough' component={Rough} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
