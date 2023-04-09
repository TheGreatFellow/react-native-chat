import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { signOut } from 'firebase/auth'
import ChatTile from '../components/ChatTile'
import { auth, db } from '../firebase'
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
} from 'firebase/firestore'

import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([])

    useEffect(() => {
        const q = query(collection(db, 'chats'))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            console.log('querySnapshot unsusbscribe', querySnapshot.docs)
            setChats(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        })
        return unsubscribe
    }, [])
    const signOutUser = () => {
        signOut(auth).then(() => {
            navigation.replace('Login')
        })
    }

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id,
            chatName,
        })
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chatrooms',
            headerStyle: { backgroundColor: '#958dc4' },
            headerTitleStyle: { color: 'white' },
            headerTitleColor: 'white',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <Avatar
                            rounded
                            source={{
                                uri: auth?.currentUser?.photoURL,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View
                    style={{
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddChat')}
                        activeOpacity={0.5}
                    >
                        <SimpleLineIcons
                            name='pencil'
                            size={24}
                            color='white'
                        />
                    </TouchableOpacity>
                </View>
            ),
        })
    }, [navigation])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style='light' />

            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName } }) => (
                    <ChatTile
                        key={id}
                        id={id}
                        chatName={chatName}
                        enterChat={enterChat}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
})
