import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { IconButton } from 'react-native-paper'; 

interface Review {
  reviewId: string;
  providerId: string;
  patientId: string;
  reviewText: string;
  createdAt: string;
}

interface ReviewListProps {
  providerId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ providerId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>(''); // State for the input field

  // Fetch reviews from the API and filter by providerId
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://pyskedev.azurewebsites.net/api/Reviews/GetAllReviews');
        const data = await response.json();
        
        // Filter reviews for the specific providerId
        const filteredReviews = data.filter((review: Review) => review.providerId === providerId);
        setReviews(filteredReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [providerId]);

  // Function to handle review submission
  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      alert("Review text cannot be empty.");
      return;
    }

    const newReview = {
      reviewId: "",
      providerId,
      patientId: "",
      reviewText: inputValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('https://pyskedev.azurewebsites.net/api/Reviews/CreateReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        // Optionally, you can fetch the updated reviews again here or add the new review to the state
        setInputValue(''); // Clear the input field after submission
      } else {
        const errorData = await response.json();
        alert(`Failed to submit review: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField} 
          placeholder="Type your comment here..."
          value={inputValue}
          onChangeText={setInputValue}
          multiline={true} 
          numberOfLines={3} 
          textAlignVertical="top" 
        />
        <IconButton 
          icon="send" // You can change this to any icon you prefer
          onPress={handleSubmit}
          style={styles.submitButton}
          
        />
      </View>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.reviewId}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewText}>{item.reviewText}</Text>
              <Text style={styles.reviewDate}>Reviewed on: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No reviews available for this doctor.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputField: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 90, // Set a height to accommodate 3 lines
    flex: 1, // Allow the TextInput to take the available space
  },
  submitButton: {
    marginLeft: 10, // Space between input and button
  },
  reviewItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#4ebaff',
    borderRadius: 5,
  },
  reviewText: {
    fontSize: 16,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default ReviewList;
