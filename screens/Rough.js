import React, { useState } from 'react'
import { Button, Image, StyleSheet, Text, View } from 'react-native'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { initializeApp } from 'firebase/app'
import * as ImagePicker from 'expo-image-picker'
import {
    getBytesTransferred,
    getMetadata,
    uploadBytesResumable,
} from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyBKKYaWpoavb-uJNP0XGa3Vpzy6Lmh5X3w',
    authDomain: 'schmooze1.firebaseapp.com',
    projectId: 'schmooze1',
    storageBucket: 'schmooze1.appspot.com',
    messagingSenderId: '252108027894',
    appId: '1:252108027894:web:497b224054620984e7b9d7',
}

// Initialize Firebase

const app = initializeApp(firebaseConfig)

export default function App() {
    const [image, setImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [transferred, setTransferred] = useState(0)

    const selectImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            })

            if (!result.canceled) {
                setImage(result.assets[0].uri)
                console.log('result', result)
            }
        } catch (error) {
            console.log('Error picking image', error)
            throw error
        }
    }

    const uploadImage = async () => {
        const storage = getStorage(app)
        const filename = image.substring(image.lastIndexOf('/') + 1)
        console.log('image', image)
        const uploadUri = image
        const storageRef = ref(storage, `images/${filename}`)
        console.log('uploadUri', uploadUri)
        const task = uploadBytesResumable(storageRef, uploadUri).then(
            (snapshot) => {
                console.log('Uploaded a blob or file!', snapshot)
            }
        )
        console.log('task', task)

        // try {
        //     task.on('state_changed', (snapshot) => {
        //         const progress =
        //             (getBytesTransferred(snapshot) /
        //                 getMetadata(snapshot).size) *
        //             100
        //         console.log(`Upload is ${progress}% done`)
        //         setTransferred(progress)
        //     })

        //     await task
        //     console.log('Image uploaded to Firebase Storage successfully')
        //     const url = await getDownloadURL(storageRef)
        //     console.log('File available at', url)
        // } catch (error) {
        //     console.error('Error uploading image to Firebase Storage', error)
        // }
    }

    return (
        <View style={styles.container}>
            <Button title='Choose image' onPress={selectImage} />
            {image && (
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                    resizeMode='contain'
                />
            )}
            {uploading && (
                <View style={styles.progressBarContainer}>
                    {/* <Progress.Bar progress={transferred} width={300} /> */}
                </View>
            )}
            <Button
                title='Upload image'
                onPress={uploadImage}
                disabled={!image}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 30,
    },
    progressBarContainer: {
        marginTop: 20,
    },
})
