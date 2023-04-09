import { StyleSheet, Text, View, Button } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = React.useState('')

    const createChat = async () => {
        await addDoc(collection(db, 'chats'), {
            chatName: input,
        })
            .then(() => {
                navigation.goBack()
            })
            .catch((error) => alert(error.message))
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add a new Chat',
            headerBackTitle: 'Chats',
        })
    }, [navigation])
    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter a chat name'
                value={input}
                autoFocus
                onSubmitEditing={createChat}
                onChangeText={(text) => setInput(text)}
            />
            <Button
                disabled={!input}
                title='Create new Chat'
                onPress={createChat}
                color='#FF9EA0'
            />
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({})
