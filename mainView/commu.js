import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './footer';
import Header from './Header/commu_header';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './sub/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { basicAxios, authAxios } from './api/axios';

export default function Commu() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPostModalVisible, setPostModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]); // 댓글 상태 추가
  const [newComment, setNewComment] = useState(''); // 새 댓글 입력 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [slideAnim] = useState(new Animated.Value(0));
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // 게시물 불러오기
  const fetchPosts = async () => {
    try {
      const response = await basicAxios.get('/api/v1/auth/boards');
      setPosts(response.data || []);
    } catch (error) {
      console.error('게시물 불러오기 실패:', error.message);
      Alert.alert('오류', '게시물을 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 댓글 불러오기
  const fetchComments = async (boardId) => {
    try {
      const response = await basicAxios.get(
        `/api/v1/auth/comments?boardId=${boardId}`
      );
      setComments(response.data || []);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error.message);
    }
  };

  // 댓글 작성
  const submitComment = async () => {
    try {
      await authAxios.post('/api/v1/auth/comments', {
        boardId: selectedPost.boardId,
        content: newComment,
      });
      Alert.alert('성공', '댓글이 작성되었습니다!');
      setNewComment('');
      fetchComments(selectedPost.boardId); // 댓글 새로고침
    } catch (error) {
      console.error('댓글 작성 실패:', error.message);
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    }
  };

  const selectImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, ...result.assets]);
    }
  };

  // 게시물 작성
  const submitPost = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('mountainName', 'none');

      // 이미지 파일을 FormData에 추가
      images.forEach((image, index) => {
        formData.append(`images`, {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: `image${index}.jpg`,
        });
      });

      await authAxios.post('/api/v1/auth/boards', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('성공', '게시글이 작성되었습니다!');
      setModalVisible(false);
      fetchPosts();
      setTitle('');
      setContent('');
      setImages([]);
    } catch (error) {
      console.error('게시글 작성 실패:', error.message);
      Alert.alert('오류', '게시글 작성에 실패했습니다.');
    }
  };

  const deletePost = async (postId) => {
    try {
      await authAxios.delete(`/api/v1/auth/boards/${postId}`);
      Alert.alert('성공', '게시물이 삭제되었습니다.');
      setPostModalVisible(false);
      fetchPosts();
    } catch (error) {
      console.error('게시물 삭제 실패:', error.message);
      Alert.alert('오류', '게시물 삭제에 실패했습니다.');
    }
  };

  const openPostModal = (post) => {
    setSelectedPost(post);
    setPostModalVisible(true);
    fetchComments(post.boardId);
    setIsMenuVisible(false);
  };

  const toggleSlide = () => {
    const toValue = slideAnim._value === 0 ? 1 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity
      onPress={() => openPostModal(item)}
      style={styles.postContainer}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postText}>{item.content}</Text>
        <Text style={styles.mountainName}>산 이름: {item.mountainName}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.boardId.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.flatListContent}
        style={{ flex: 1 }}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name='pencil' size={20} color='#fff' />
        <Text style={styles.createButtonText}>작성하기</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Footer />
      </View>

      {/* 게시글 작성 모달 */}
      <Modal animationType='slide' transparent visible={isModalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Icon name='close' size={24} color='#000' />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder='제목을 입력하세요'
                  value={title}
                  onChangeText={setTitle}
                />
                <TextInput
                  style={[styles.input, styles.contentInput]}
                  placeholder='내용을 입력하세요'
                  value={content}
                  onChangeText={setContent}
                  multiline
                />
                <TouchableOpacity
                  style={styles.selectImageButton}
                  onPress={selectImages}
                >
                  <Text style={styles.selectImageButtonText}>이미지 선택</Text>
                </TouchableOpacity>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitPost}
                  >
                    <Text style={styles.submitButtonText}>작성하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 게시글 상세 모달 */}
      <Modal animationType='slide' transparent visible={isPostModalVisible}>
        <TouchableWithoutFeedback onPress={() => setPostModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <View style={styles.menuIconContainer}>
                  <TouchableOpacity
                    onPress={toggleMenu}
                    style={styles.menuIcon}
                  >
                    <Icon name='dots-vertical' size={24} color='#000' />
                  </TouchableOpacity>
                </View>
                <Image
                  source={{ uri: selectedPost?.imageUrl }}
                  style={styles.postImage}
                />
                <View style={styles.modalTextContainer}>
                  <Text style={styles.postTitle}>{selectedPost?.title}</Text>
                  <Text style={styles.postText}>{selectedPost?.content}</Text>
                  {isMenuVisible && (
                    <Animated.View
                      style={[
                        styles.iconContainer,
                        {
                          transform: [
                            {
                              translateY: slideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 5],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => setPostModalVisible(false)}
                      >
                        <Icon name='pencil' size={24} color='#000' />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deletePost(selectedPost.boardId)}
                      >
                        <Icon name='delete' size={24} color='red' />
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                  {/* 댓글 목록 */}
                  <FlatList
                    data={comments}
                    keyExtractor={(item) => item.commentId.toString()}
                    renderItem={renderComment}
                    style={styles.commentList}
                  />

                  {/* 댓글 입력 */}
                  <View style={styles.commentInputContainer}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder='댓글을 입력하세요'
                      value={newComment}
                      onChangeText={setNewComment}
                    />
                    <TouchableOpacity
                      onPress={submitComment}
                      style={styles.commentButton}
                    >
                      <Text style={styles.commentButtonText}>작성</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContent: {
    paddingBottom: 60, // Footer 공간을 확보
  },
  postContainer: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  createButton: {
    position: 'absolute',
    bottom: WINDOW_HEIGHT * 0.12,
    right: WINDOW_WIDTH * 0.05,
    backgroundColor: '#0AE56A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  postDetailContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 5,
  },
  selectImageButton: {
    backgroundColor: '#0AE56A',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  selectImageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  submitButton: {
    backgroundColor: '#0AE56A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  menuIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  menuIcon: {
    padding: 5,
  },
  iconContainer: {
    position: 'absolute',
    top: 30,
    right: 10,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    elevation: 5,
    flexDirection: 'row',
  },
  commentList: {
    marginTop: 10,
  },
  commentContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
  },
  commentButton: {
    marginLeft: 10,
    backgroundColor: '#0AE56A',
    padding: 10,
    borderRadius: 5,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
