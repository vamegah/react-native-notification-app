//include all the relevant imports 

const SettingsScreen = () => {
  const [avatar, setAvatar] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Get the current authenticated user's email
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    } else {
      Alert.alert('User not logged in', 'Please log in to upload an avatar.');
    }
  }, []);

  const fetchAvatar = async () => {
    try {
      // Create a query to find documents with the specified email
      const q = query(collection(db, "avatars"), where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);

      // Check if the query returned any results
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          if(doc.data().avatar) {
            setAvatar(doc.data().avatar);
          }
          if(doc.data().displayName) {
            setDisplayName(doc.data().displayName);
          }
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document: ", error);
    }
  };

  useEffect(() => {  
    fetchAvatar();
  }, [avatar]);

  // Function to upload the image to Firebase Storage
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log(ref);
    const storageRef = ref(storage, `profile_pics/${new Date().getTime()}.jpg`);

    // Upload the image
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef); // Get the download URL
    return url; // Return the download URL
  };

  // Function to pick an image from the device's gallery
  const pickImage = async () => {
    // Request permission to access the gallery
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    console.log("result is ",result);
    if (!result.canceled) {
      const url = await uploadImage(result.assets[0].uri); // Upload the selected image
      setImageUrl(url); // Set the image URL
      setAvatar(url);
      if (!avatar) {
        await addDoc(collection(db, "avatars"), {
          email:userEmail,
          avatar:url,
          displayName: displayName
        });
      } else {
        await setDoc(newDocRef, 
                      { email: userEmail, 
                        avatarUrl: url, 
                        displayName: displayName 
                      });
      }
    }
  };

  const saveChanges = async () => {
    if (!avatar) {
      await addDoc(collection(db, "avatars"), {
        email:userEmail,
        avatar:url,
        displayName: displayName
      });
    } else {
      await setDoc(newDocRef, 
                    { email: userEmail, 
                      avatarUrl: url, 
                      displayName: displayName 
                    });
    }

  }

  return (
    //Add the required UI for settings.
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffe6ff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  avatarPlaceholder: {
    color: '#666',
    fontSize: 18,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginTop: 5,
    borderRadius: 5,
    fontSize: 16
  },
  label: {
    marginRight:10, 
    padding: 8, 
    marginTop: 5, 
    fontSize:16
  }
});

export default SettingsScreen;
