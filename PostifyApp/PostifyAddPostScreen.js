import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './firebase';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function PostifyAddPostScreen() {
  const [title, setTitle] = useState('');
  const [textNote, setTextNote] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const navigation = useNavigation();


  const selectAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', // This filters to show only audio files
      });
  
      if (result.canceled == false) {
        const audioUri = result.assets[0].uri;
        console.log('Audio file URI:', audioUri);
        // Convert the file URI to a blob for Firebase Storage upload
        const response = await fetch(audioUri);
        const blob = await response.blob();
  
        const storageRef = ref(storage, `audioFiles/${result.output[0].name}`);
  
        // Upload the image
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL
        setAudioFile(downloadURL);
        // return downloadURL; // Return the download URL  
      } else {
        console.log('File selection canceled');
      }
    } catch (error) {
      console.error('Error picking audio file:', error);
    }
  };

  // Select an image
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('Image selection canceled');
      } else if (response.error) {
        Alert.alert('Error', 'Image selection error');
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  const handleSubmit = async (privatePost) => {
    if (title && (imageUri || textNote || audioFile)) {
      const randomId = Math.floor(Math.random() * 1000000).toString();
      // Construct the data object conditionally
      const postData = {};
      postData:id = randomId;
      // postData:_id = randomId;
      postData.title = title;
      postData.createdAt = Timestamp.now();
      if (audioFile) postData.audio_note = audioFile;
      if (textNote) postData.text = textNote;
      if (imageUri) postData.imageUrl = imageUri;
      postData.user = {_id:randomId,userid: auth.currentUser.email};
      postData.private = privatePost;

      navigation.navigate('PostifyPostsList', { poster: auth.currentUser.email})
      addDoc(collection(db, "postify_posts"), postData).then(()=>{
        alert('Uplaoded Successfully!')// In real apps, replace this with expo-notifications 
      })
    } else {
      alert("Please fill all required fields");
    }
  };

  return (
    //Add a View to accept title, multi-line text
    //Audio file and image as input
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
    marginLeft:10
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
  audioText: {
    fontSize: 14,
    color: 'green',
    marginTop: 10,
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
    margin:10
  },
  buttonContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  button: {
    padding:10,
    borderRadius: 6,
    backgroundColor: '#b830b3',
    margin: 15,
  }
});
