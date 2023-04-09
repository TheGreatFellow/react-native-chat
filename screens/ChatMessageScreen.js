import React, { useLayoutEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
import { ScrollView } from 'react-native'
import { TextInput } from 'react-native'
import { Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import firebase from 'firebase/app'
import { auth, db } from '../firebase'
import {
    FlingGestureHandler,
    Directions,
    State,
} from 'react-native-gesture-handler'
import Animated, {
    withSpring,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    useSharedValue,
} from 'react-native-reanimated'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'

import {
    getFirestore,
    collection,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    addDoc,
} from 'firebase/firestore'

const ChatMessageScreen = ({ navigation, route }) => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [inputHeight, setInputHeight] = useState(40)
    const [repliedTo, setRepliedTo] = useState('')
    const startingPosition = 0
    const scrollViewRef = useRef()
    const x = useSharedValue(startingPosition)
    const eventHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {},
        onActive: (event, ctx) => {
            x.value = -50
        },
        onEnd: (event, ctx) => {
            x.value = withSpring(startingPosition)
        },
    })

    const uas = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: x.value }],
        }
    })

    useLayoutEffect(() => {
        const messagesQuery = query(
            collection(db, 'chats', route.params.id, 'messages'),
            orderBy('timestamp', 'asc')
        )

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) =>
            setMessages(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        )

        return () => unsubscribe()
    }, [route.params.id])
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        rounded
                        source={{
                            uri:
                                messages[0]?.data.photoURL ||
                                'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
                        }}
                    />
                    <Text
                        style={{
                            color: 'white',
                            marginLeft: 10,
                            fontWeight: '700',
                        }}
                    >
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={navigation.goBack}
                >
                    <AntDesign name='arrowleft' size={24} color='white' />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 80,
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity>
                        <FontAwesome
                            name='video-camera'
                            size={24}
                            color='white'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name='call' size={24} color='white' />
                    </TouchableOpacity>
                </View>
            ),
        })
    }, [navigation, messages])

    const sendMessage = async () => {
        try {
            Keyboard.dismiss()
            const messageRef = collection(
                db,
                'chats',
                route.params.id,
                'messages'
            )

            await addDoc(messageRef, {
                timestamp: serverTimestamp(),
                message: input,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL,
                repliedTo: repliedTo,
            })

            setInput('')
            console.log('Message sent successfully!')
        } catch (error) {
            console.error('Error sending message: ', error)
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style='light' />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiis}>
                    <>
                        <ScrollView
                            contentContainerStyle={{ paddingTop: 15 }}
                            ref={scrollViewRef}
                            onContentSizeChange={() =>
                                scrollViewRef.current.scrollToEnd({
                                    animated: true,
                                })
                            }
                        >
                            {messages.map(({ id, data }) =>
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.reciever}>
                                        <Avatar
                                            position='absolute'
                                            bottom={-15}
                                            right={-15}
                                            rounded
                                            containerStyle={{
                                                position: 'absolute',
                                                bottom: -15,
                                                right: -5,
                                            }}
                                            size={30}
                                            source={{
                                                uri: data.photoURL,
                                            }}
                                        />
                                        <Text style={styles.recieverText}>
                                            {data.message}
                                        </Text>
                                    </View>
                                ) : (
                                    <FlingGestureHandler
                                        key={id}
                                        direction={Directions.LEFT}
                                        onGestureEvent={eventHandler}
                                        onHandlerStateChange={({
                                            nativeEvent,
                                        }) => {
                                            if (
                                                nativeEvent.state ===
                                                State.ACTIVE
                                            ) {
                                                setRepliedTo(data.message)
                                            }
                                        }}
                                    >
                                        <Animated.View
                                            style={[styles.aContainer, uas]}
                                        >
                                            <View
                                                key={id}
                                                style={styles.sender}
                                            >
                                                <Avatar
                                                    position='absolute'
                                                    bottom={-15}
                                                    left={-15}
                                                    rounded
                                                    containerStyle={{
                                                        position: 'absolute',
                                                        bottom: -15,
                                                        left: -5,
                                                    }}
                                                    size={30}
                                                    source={{
                                                        uri: data.photoURL,
                                                    }}
                                                />
                                                <Text style={styles.senderText}>
                                                    {data.message}
                                                </Text>
                                                <Text style={styles.senderName}>
                                                    {data.displayName}
                                                </Text>
                                            </View>
                                        </Animated.View>
                                    </FlingGestureHandler>
                                )
                            )}
                        </ScrollView>
                        <View>
                            {repliedTo && (
                                <View style={styles.replyContainer}>
                                    <TouchableOpacity
                                        onPress={() => setRepliedTo('')}
                                        style={styles.closeReply}
                                    >
                                        <Icon
                                            name='close'
                                            color='#000'
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.title}>
                                        Response to 'Me'
                                    </Text>
                                    <Text style={styles.reply}>
                                        {repliedTo}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.footer}>
                                <TextInput
                                    value={input}
                                    onChangeText={(text) => setInput(text)}
                                    onSubmitEditing={sendMessage}
                                    style={[
                                        styles.textInput,
                                        { height: inputHeight },
                                    ]}
                                    placeholder='Signal Message'
                                    multiline
                                    onContentSizeChange={(e) => {
                                        let inputH = Math.max(
                                            e.nativeEvent.contentSize.height,
                                            35
                                        )
                                        if (inputH > 120) inputH = 100
                                        setInputHeight(inputH)
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={sendMessage}
                                    activeOpacity={0.5}
                                >
                                    <Ionicons
                                        name='send'
                                        size={24}
                                        color='#2B68E6'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatMessageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    aContainer: {
        paddingVertical: 10,
        marginVertical: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    textInput: {
        bottom: 0,
        flex: 1,
        marginRight: 15,
        backgroundColor: '#ECECEC',
        padding: 10,
        color: 'grey',
        fontSize: 18,
        borderRadius: 30,
    },
    reciever: {
        padding: 10,
        paddingBottom: 15,
        backgroundColor: '#FF9EA0',
        alignSelf: 'flex-end',
        borderRadius: 15,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        minWidth: '20%',

        position: 'relative',
    },
    sender: {
        padding: 10,
        paddingBottom: 15,
        backgroundColor: '#EFEEF6',
        alignSelf: 'flex-start',
        borderRadius: 15,
        margin: 15,
        maxWidth: '80%',
        minWidth: '20%',
        position: 'relative',
    },
    senderText: {
        color: 'black',
        fontWeight: '500',
        marginLeft: 5,
        marginBottom: 0,
    },
    recieverText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 5,
    },
    senderName: {
        left: 5,
        paddingRight: 10,
        fontSize: 10,
        color: 'black',
    },
    replyContainer: {
        paddingHorizontal: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        marginTop: 5,
        fontWeight: 'bold',
    },
    closeReply: {
        position: 'absolute',
        right: 10,
        top: 5,
    },
    reply: {
        marginTop: 5,
    },
})
