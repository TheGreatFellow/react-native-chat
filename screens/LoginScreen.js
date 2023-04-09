import {
    Button,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { auth } from '../firebase'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            console.log(auth, authUser)
            if (authUser) {
                navigation.replace('Home')
            }
        })
        return () => {
            unsubscribe()
        }
    }, [])
    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password).catch((error) =>
            alert(error.message)
        )
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style='light' />
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    autoComplete='email'
                    autoFocus
                    keyboardType='email-address'
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Password'
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                />
                <View style={{ height: 30 }} />

                <TouchableOpacity style={styles.button} onPress={signIn}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: '#fff',
                            fontSize: 18,
                        }}
                    >
                        Log In
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
                        style={{
                            color: 'gray',
                            fontWeight: '600',
                            fontSize: 14,
                        }}
                    >
                        Don't have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text
                            style={{
                                color: '#FF9EA0',
                                fontWeight: '600',
                                fontSize: 14,
                            }}
                        >
                            {' '}
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
    },

    inputContainer: {
        width: 300,
    },

    input: {
        backgroundColor: '#F6F7FB',
        height: 58,
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
        width: '100%',
    },
    button: {
        backgroundColor: '#FF9EA0',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
})
