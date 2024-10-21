import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './footer';
import Header from './Header/commu_header';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './sub/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function Commu() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPostVisible, setPostVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const examplePost = {
    id: 1,
    title: '첫 번째 게시글',
    content: '오늘도 즐거운 산행! 다음엔 또 가야지!',
    images: [
      { uri: 'https://via.placeholder.com/150' },
      { uri: 'https://via.placeholder.com/150' },
    ],
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

  const submitPost = async () => {
    try {
      await axios.post('http://3.34.159.30:8080/api/v1/auth/boards', {
        title: title,
        content: content,
        mountainName: 'none',
      });

      Alert.alert('성공', '게시글이 작성되었습니다!');
      setModalVisible(false);
      setTitle('');
      setContent('');
      setImages([]);
    } catch (error) {
      console.error('게시글 작성 실패:', error.response || error.message);
      Alert.alert('오류', '게시글 작성에 실패했습니다.');
    }
  };

  const submitComment = async () => {
    try {
      const response = await axios.post('http://3.34.159.30:8080/api/v1/auth/comments', {
        postId: examplePost.id,
        content: comment,
      });

      setComments([...comments, { content: comment }]);
      setComment('');
      Alert.alert('성공', '댓글이 작성되었습니다!');
    } catch (error) {
      console.error('댓글 작성 실패:', error.response || error.message);
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => setPostVisible(true)} style={styles.postContainer}>
          <Text style={styles.postTitle}>{examplePost.title}</Text>
          <Text style={styles.postContent}>{examplePost.content}</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
        <Icon name="pencil" size={20} color="#fff" />
        <Text style={styles.createButtonText}>작성하기</Text>
      </TouchableOpacity>

      <Footer />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>게시글 작성</Text>
                <TextInput
                  style={styles.input}
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChangeText={setTitle}
                />
                <TextInput
                  style={[styles.input, styles.contentInput]}
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChangeText={setContent}
                  multiline={true}
                />
                <View style={styles.imagePreviewContainer}>
                  {images.map((image, index) => (
                    <Image key={index} source={{ uri: image.uri }} style={styles.imagePreview} />
                  ))}
                </View>
                <TouchableOpacity style={styles.selectImageButton} onPress={selectImages}>
                  <Text style={styles.selectImageButtonText}>이미지 선택</Text>
                </TouchableOpacity>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.submitButton} onPress={submitPost}>
                    <Text style={styles.submitButtonText}>작성하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPostVisible}
        onRequestClose={() => setPostVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPostVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{examplePost.title}</Text>
                <Text style={styles.postDetailContent}>{examplePost.content}</Text>
                <View style={styles.imagePreviewContainer}>
                  {examplePost.images.map((image, index) => (
                    <Image key={index} source={image} style={styles.imagePreview} />
                  ))}
                </View>

                <ScrollView style={styles.commentSection}>
                  {comments.map((c, index) => (
                    <Text key={index} style={styles.comment}>
                      {c.content}
                    </Text>
                  ))}
                </ScrollView>

                <TextInput
                  style={styles.commentInput}
                  placeholder="댓글을 입력하세요"
                  value={comment}
                  onChangeText={setComment}
                />
                <TouchableOpacity style={styles.submitButton} onPress={submitComment}>
                  <Text style={styles.submitButtonText}>댓글 작성</Text>
                </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    marginBottom: WINDOW_HEIGHT * 0.1,
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
  createButton: {
    position: 'absolute',
    bottom: WINDOW_HEIGHT * 0.12,
    right: WINDOW_WIDTH * 0.05,
    backgroundColor: '#A4D06F',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    backgroundColor: '#A4D06F',
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
    backgroundColor: '#A4D06F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#333',
  },
});

