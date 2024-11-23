//include all the relevant imports

const SettingsScreen = () => {
  const [avatar, setAvatar] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [docRef, setDocRef] = useState(null);

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
        querySnapshot.forEach((docItem) => {
          const docRef = doc(db, "avatars", docItem.id);
          console.log(docRef);
          setDocRef(docRef);

          if(docItem.data().avatar) {
            setAvatar(docItem.data().avatar);
          }
          if(docItem.data().displayName) {
            setDisplayName(docItem.data().displayName);
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
  }, []);

  const saveChanges = async () => {
    if (!docRef) {
      await addDoc(collection(db, "avatars"), {
        email:userEmail,
        avatar:url,
        displayName: displayName
      });
    } else {
      await setDoc(docRef, 
                    { email: userEmail, 
                      avatar: avatar, 
                      displayName: displayName 
                    });
    }
    Toast.show({
      type: "success",
      text1: "Changes Saved",
      text2: "Your changes have been saved 👋", // Subtitle
      position: "top"
    });
    navigation.navigate('ListUsers')
  }

  return (
    {/*Add the component that is returned here */}
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
