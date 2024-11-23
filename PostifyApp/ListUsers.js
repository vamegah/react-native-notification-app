//Add all the relevant imports 

export const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const db = getFirestore();
  const auth = getAuth();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUsers = async () => {
        try {
          // Create a query to get all avatars except the current user
          const q = query(
           collection(db, "avatars"),
           );
         
           // Execute the query
           const querySnapshot = await getDocs(q);
             const fetchedUsers = querySnapshot.docs.map(doc => ({
               id: doc.id,
               ...doc.data(),
             }));
             const currentUser = fetchedUsers.find((user) => user.email === auth.currentUser.email);
             const otherUsers = fetchedUsers.filter((user) => user.email !== auth.currentUser.email);
         
             // Set the sorted array with the current user first
             setUsers([currentUser, ...otherUsers]);        
           } catch (error) {
             console.error('Error fetching users:', error);
           }     
      };
      fetchUsers();
    }, [])
  );

  return (
	//Add a ScrollView to render the users along with their avatars
  );
};

const styles = StyleSheet.create({
	userContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
	},
	title: {
	  fontSize: 24,
	  marginBottom: 20,
	  fontWeight: 'bold',
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 20,
		marginRight: 10,
	  },
	  username: {
		fontSize: 20,
		color: 'blue',
	  },
    currentUserAvatarBorder: {
      borderColor: 'purple',
      borderWidth: 3
    }
	});
