import React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './sub/dimensions';
import Header from './Header/commu_header';

export default function PostDetail({ route }) {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Header></Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <Text style={styles.postUser}>{post.user} | {post.time}</Text>
          <Text style={styles.postContent}>{post.content}</Text>
        </View>

        {/* Images */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
          {post.images.map((image, index) => (
            <Image key={index} source={image} style={styles.postImage} />
          ))}
        </ScrollView>

        {/* Like and Comment Count */}
        <View style={styles.postFooter}>
          <Text style={styles.likeText}>❤️ {post.likes}명이 좋아합니다</Text>
          <Text style={styles.commentText}>💬 {post.comments.length}</Text>
        </View>

        {/* Comments */}
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>댓글 {post.comments.length}개</Text>
          {post.comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Text style={styles.commentUser}>{comment.user}</Text>
              <Text style={styles.commentText}>{comment.content}</Text>
              <Text style={styles.commentTime}>{comment.time}</Text>
            </View>
          ))}
        </View>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>등록</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postHeader: {
    padding: 15,
  },
  postUser: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  imageContainer: {
    marginLeft: 15,
    marginBottom: 15,
  },
  postImage: {
    width: WINDOW_WIDTH * 0.9,
    height: WINDOW_HEIGHT * 0.4,
    borderRadius: 10,
    marginRight: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  likeText: {
    fontSize: 14,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    color: '#666',
  },
  commentSection: {
    padding: 15,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  commentInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#A4D06F',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
