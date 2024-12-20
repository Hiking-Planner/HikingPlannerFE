import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
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
import userInfoStore from './stores/userInfoStore';

export default function Commu() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPostModalVisible, setPostModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mountainName, setMountainName] = useState('');
  const [images, setImages] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editedComment, setEditedComment] = useState(''); // 수정할 댓글 내용

  // 로그인된 사용자 닉네임 가져오기
  const { nickname } = userInfoStore((state) => state.userInfo);

  useEffect(() => {
    if (!nickname) {
      console.log('유저 정보가 아직 로드되지 않았습니다.');
    } else {
      console.log('현재 유저 닉네임:', nickname);
    }
  }, [nickname]);

  // 게시물 불러오기
  const fetchPosts = async () => {
    try {
      const response = await basicAxios.get('/api/v1/auth/boards');
      setPosts(response.data);
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
      setComments(response.data); // 서버 응답을 그대로 상태로 설정
    } catch (error) {
      console.error('댓글 불러오기 실패:', error.message);
      Alert.alert('오류', '댓글을 불러오는 데 실패했습니다.');
    }
  };

  // 댓글 작성
  const submitComment = async () => {
    try {
      await authAxios.post('/api/v1/auth/comments', {
        content: newComment,
        boardId: selectedPost.boardId,
      });
      setNewComment('');
      fetchComments(selectedPost.boardId);
    } catch (error) {
      console.error('댓글 작성 실패:', error.message);
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 수정
  const submitEditComment = async (commentId) => {
    try {
      await authAxios.put(`/api/v1/auth/comments/${commentId}`, {
        content: editedComment,
      });
      setEditingCommentId(null);
      setEditedComment('');
      fetchComments(selectedPost.boardId); // 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 수정 실패:', error.message);
      Alert.alert('오류', '댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const deleteComment = async (commentId) => {
    try {
      await authAxios.delete(`/api/v1/auth/comments/${commentId}`);
      fetchComments(selectedPost.boardId); // 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 삭제 실패:', error.message);
      Alert.alert('오류', '댓글 삭제에 실패했습니다.');
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
      formData.append('mountainName', mountainName);

      images.forEach((image, index) => {
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
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

  // 게시물 수정
  const submitEditPost = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);

      images.forEach((image, index) => {
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: `image${index}.jpg`,
        });
      });

      await authAxios.put(
        `/api/v1/auth/boards/${selectedPost.boardId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('성공', '게시글이 수정되었습니다!');
      setEditModalVisible(false);
      fetchPosts();
      setTitle('');
      setContent('');
      setImages([]);
    } catch (error) {
      console.error('게시글 수정 실패:', error.message);
      Alert.alert('오류', '게시글 수정에 실패했습니다.');
    }
  };

  // 게시물 수정 모달 켜기
  const openEditModal = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content);
    setEditModalVisible(true);
  };

  // 게시물 삭제
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

  // 게시물 상세 모달 켜기
  const openPostModal = (post) => {
    setSelectedPost(post);
    setPostModalVisible(true);
    fetchComments(post.boardId);
    setIsMenuVisible(false);
    console.log('Selected Post User ID:', post.nickname);
  };

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.boardId.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openPostModal(item)}
            style={styles.postContainer}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postText}>{item.content}</Text>
              <Text style={styles.mountainName}>
                산 이름: {item.mountainName}
              </Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.scrollView}
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
                  placeholder='산 이름을 입력하세요'
                  value={mountainName}
                  onChangeText={setMountainName}
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
                {/* 이미지 미리보기 영역 */}
                <View style={styles.imagePreviewContainer}>
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.uri }}
                      style={styles.imagePreview}
                    />
                  ))}
                </View>
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

                {/* Set ScrollView inside modalContent to control scroll behavior */}
                <ScrollView style={styles.modalScrollContainer}>
                  <Image
                    source={{ uri: selectedPost?.imageUrl }}
                    style={styles.postImage}
                  />
                  <View style={styles.modalTextContainer}>
                    <Text style={styles.postTitle}>{selectedPost?.title}</Text>
                    <Text style={styles.postText}>{selectedPost?.content}</Text>

                    {/* Edit/Delete buttons */}
                    {isMenuVisible &&
                      selectedPost?.nickname?.trim().toLowerCase() ===
                        nickname?.trim().toLowerCase() && (
                        <View style={styles.iconContainer}>
                          <TouchableOpacity
                            onPress={() => {
                              setPostModalVisible(false);
                              openEditModal(selectedPost);
                            }}
                          >
                            <Icon name='pencil' size={24} color='#000' />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => deletePost(selectedPost.boardId)}
                          >
                            <Icon name='delete' size={24} color='red' />
                          </TouchableOpacity>
                        </View>
                      )}

                    <View style={styles.commentSection}>
                      <ScrollView
                        style={styles.commentList}
                        contentContainerStyle={{ flexGrow: 1 }}
                      >
                        {comments.map((comment) => (
                          <View
                            key={comment.commentId}
                            style={styles.commentContainer}
                          >
                            <Text style={styles.commentUserName}>
                              {comment.nickname}
                            </Text>
                            {editingCommentId === comment.commentId ? (
                              <>
                                <TextInput
                                  style={styles.commentInput}
                                  value={editedComment}
                                  onChangeText={setEditedComment}
                                />
                                <TouchableOpacity
                                  onPress={() =>
                                    submitEditComment(comment.commentId)
                                  }
                                  style={styles.commentButton}
                                >
                                  <Text style={styles.commentButtonText}>
                                    수정 완료
                                  </Text>
                                </TouchableOpacity>
                              </>
                            ) : (
                              <Text style={styles.commentText}>
                                {comment.content}
                              </Text>
                            )}
                            {comment.nickname?.trim() === nickname?.trim() && (
                              <View style={styles.commentActions}>
                                <TouchableOpacity
                                  onPress={() => {
                                    setEditingCommentId(comment.commentId);
                                    setEditedComment(comment.content);
                                  }}
                                >
                                  <Text style={styles.editDeleteText}>
                                    수정
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    deleteComment(comment.commentId)
                                  }
                                >
                                  <Text style={styles.editDeleteText}>
                                    삭제
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        ))}
                      </ScrollView>

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
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* 게시글 수정 모달 */}
      <Modal animationType='slide' transparent visible={isEditModalVisible}>
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
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
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitEditPost}
                  >
                    <Text style={styles.submitButtonText}>수정하기</Text>
                  </TouchableOpacity>
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
    paddingBottom: 60,
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
    flex: 1,
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    position: 'relative',
  },
  modalScrollContainer: {
    flexGrow: 1,
    maxHeight: '100%',
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
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
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
  scrollView: {
    flexGrow: 1,
    marginBottom: WINDOW_HEIGHT * 0.1,
    paddingBottom: WINDOW_HEIGHT * 0.15,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  commentActions: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    top: 5,
  },
  editDeleteText: {
    marginLeft: 10,
    color: '#0AE56A',
    fontWeight: 'bold',
    fontSize: 14,
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
});
