import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, Alert } from 'react-native';
import { db, auth } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function PostifyAddPostScreen() {
    const [title, setTitle] = useState('');
    const [textNote, setTextNote] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const navigation = useNavigation();

    const handleSubmit = async (privatePost) => {
        if (title && (imageUri || textNote)) {
            const randomId = Math.floor(Math.random() * 1000000).toString();
            // Construct the data object conditionally
            const postData = {};
            postData: id = randomId;
            // postData:_id = randomId;
            postData.title = title;
            postData.createdAt = Timestamp.now();
            if (textNote) postData.text = textNote;
            if (imageUri) postData.imageUrl = imageUri;
            postData.user = { _id: randomId, userid: auth.currentUser.email };
            postData.private = privatePost;

            navigation.navigate('PostifyPostsList', { poster: auth.currentUser.email })
            addDoc(collection(db, "postify_posts"), postData).then(() => {
                alert('Uplaoded Successfully!')// In real apps, replace this with expo-notifications 
            })
        } else {
            alert("Please fill all required fields");
        }
    };

    return (
        //Add a View to accept title, multi-line text
        //Audio file and image as input
        <View style={styles.container}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter title"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Text Note:</Text>
            <TextInput
                style={styles.textArea}
                placeholder="Enter description"
                value={textNote}
                onChangeText={setTextNote}
                multiline
            />

            <Text style={styles.label}>Image:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter image URL"
                value={imageUri}
                onChangeText={setImageUri}
            />

            {imageUri?.trim() !== '' && (
                <Image source={{ uri: imageUri }} style={styles.image} />
            )}

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => handleSubmit(false)}>
                    <Text style={styles.buttonText}>Post</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => handleSubmit(true)}>
                    <Text style={styles.buttonText}>Post Privately</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffe6ff'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginRight: 15,
        marginLeft: 10
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        marginTop: 5,
        borderRadius: 5,
    },
    textArea: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        marginTop: 5,
        borderRadius: 5,
        height: 100,
        textAlignVertical: 'top',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 10,
    },
    postOptions: {
        flexDirection: 'row',
        alignItems: 'stretch',
        margin: 10
    },
    buttonContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    button: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#b830b3',
        margin: 15,
    }
});
