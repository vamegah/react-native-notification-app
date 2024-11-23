//include all the relevant imports here.

const PostifyPostsList = ({route}) => {
  let poster  = auth.currentUser.email;
  const navigation = useNavigation();
  const [postList, setPostList] = useState([])
  const [postStatus, setPostStatus] = useState("Loading....")

  if(route.params){
    poster = route.params.poster;
    console.log(poster);
  }
  
    let formatTimestampToDate = (timestamp) => {
        const date = timestamp.toDate();
        const month = String(date.getMonth()).padStart(2, '0');
        const day = String(date.getDay()).padStart(2, '0');
        const year = String(date.getFullYear()).padStart(2, '0');
        return `${month}/${day}/${year}`;
      }
  
    let formatTimestampToTime = (timestamp) => {
      const date = timestamp.toDate();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');      
      return `${hours}:${minutes}:${seconds}`;
    }
  
    let loadPostScreen = ()=>{
      navigation.navigate('PostifyAddPostScreen', { poster: auth.currentUser.email})
    }
  
    const fetchPosts = async () => {
      try {
        const postsCollection = query(
          collection(db, 'postify_posts'),
          where('user.userid', '==', poster),
          where('private','==',false),
          orderBy('createdAt', 'desc')
        );  
    
        const postSnapshot = await getDocs(postsCollection);
        const postsList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if(postsList.length == 0) {
          setPostStatus("No posts yet!")
        }
        setPostList(postsList);
      } catch(error){
        console.error(error);
        console.log("Unable to fetch posts")
      }
    };
  
    useFocusEffect(
      useCallback(() => {
        fetchPosts();
      }, [])
    );
    const listItem = (post)=>{
      return (
      <View style={{flexDirection:'column'}}>
        <View style={styles.createdAt}>
          <Text style={styles.postTime}>{formatTimestampToDate(post.createdAt)}</Text>
          <Text style={styles.postTime}>{formatTimestampToTime(post.createdAt)}</Text>
        </View>
        <View style={{
    flexDirection: 'row', 
    justifyContent: 'center',
  }}>
        {post.imageUrl ? (
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          ) : null}          
        </View>
        {post.text ? (
          <Text style={styles.postText}>
          {post.text}
          </Text>
          ) : null}          
    
        <View style={styles.divider} />
      </View>)
    }

  return (
    //Add a scrollView with all the posts
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pressableContainer: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: '1cm',
  },
  postsList: {
    flexDirection: 'column',
    width: '80%',
    alignItems: 'flex-start'
  },
  button: {
    backgroundColor: 'cyan',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generalText: {
    color: 'black',
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: '1cm'
  },
  buttonContainer: {
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    padding:10,
    borderRadius: 6,
    backgroundColor: '#b830b3',
    marginTop: 15
  },
  postTime: {
    color: 'grey',
    margin:5
  },
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginTop: 8,
  },
  postImage: {
    margin: 5,
    width: '60%',
    aspectRatio: 1,
    height: undefined, 
  },
  createdAt: {
    marginTop:15,
    marginBottom:10, 
    flexDirection:'row', 
    justifyContent: 'flex-start', 
  },
  audio: {
    flexDirection:'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  postText: {
    fontSize: 16,
    marginBottom: 10
  },  
});

export default PostifyPostsList;
