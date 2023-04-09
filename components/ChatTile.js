import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import {
    getFirestore,
    collection,
    doc,
    query,
    orderBy,
    Timestamp,
    onSnapshot,
} from 'firebase/firestore'

import { db } from '../firebase'

const ChatTile = ({ id, chatName, enterChat }) => {
    const [chatMessages, setChatMessages] = useState([])
    const [time, setTime] = useState('')

    const calculateTime = () => {
        setTime(chatMessages[0].timestamp?.toDate().toLocaleTimeString())
    }
    useEffect(() => {
        const q = query(
            collection(db, 'chats', id, 'messages'),
            orderBy('timestamp', 'desc')
        )
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data())
            setChatMessages(data)
            if (data.length > 0) {
                setTime(data[0].timestamp)
            }
        })
        return unsubscribe
    }, [db, id])

    return (
        <ListItem bottomDivider onPress={() => enterChat(id, chatName)}>
            <Avatar
                rounded
                source={{
                    uri: 'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
                }}
            />
            <ListItem.Content>
                <ListItem.Title>
                    <Text style={{ fontWeight: '800' }}>{chatName}</Text>
                    {time && (
                        <ListItem.Title right>
                            <Text>
                                {' · ' +
                                    time
                                        ?.toDate()
                                        .toLocaleTimeString()
                                        .substring(
                                            0,
                                            time
                                                ?.toDate()
                                                .toLocaleTimeString()
                                                .lastIndexOf(':')
                                        ) +
                                    time
                                        ?.toDate()
                                        .toLocaleTimeString()
                                        .slice(-3)}
                            </Text>
                        </ListItem.Title>
                    )}
                </ListItem.Title>

                {time && (
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
                        {chatMessages?.[0]?.displayName + ': '}
                        {chatMessages?.[0]?.message}
                    </ListItem.Subtitle>
                )}
            </ListItem.Content>
        </ListItem>
    )
}

export default ChatTile

const styles = StyleSheet.create({})
