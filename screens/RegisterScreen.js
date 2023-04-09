import {
    Button,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    const register = () => {
        console.log(imageUrl)
        createUserWithEmailAndPassword(auth, email, password)
            .then((authUser) => {
                console.log(authUser)
                const user = authUser.user
                updateProfile(user, {
                    displayName: name,
                    photoURL:
                        imageUrl ||
                        'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
                })
                    .then(() => {
                        navigation.replace('Home')
                    })
                    .catch((error) => alert(error.message))
            })
            .catch((error) => alert(error.message))
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={-300}
        >
            <TextInput
                style={styles.input}
                onChangeText={(text) => setName(text)}
                value={name}
                placeholder='Full Name'
                autoFocus
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => setEmail(text)}
                value={email}
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                placeholder='Email'
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder='Password'
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => setImageUrl(text)}
                value={imageUrl}
                placeholder='Profile Picture URL (optional)'
            />
            <TouchableOpacity style={styles.button} onPress={register}>
                <Text
                    style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}
                >
                    Sign Up
                </Text>
            </TouchableOpacity>
            <View
                style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}
                >
                    Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text
                        style={{
                            color: '#FF9EA0',
                            fontWeight: '600',
                            fontSize: 14,
                        }}
                    >
                        Log In
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    input: {
        backgroundColor: '#F6F7FB',
        height: 58,
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
        width: 300,
    },
    button: {
        backgroundColor: '#FF9EA0',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: 300,
    },
})
