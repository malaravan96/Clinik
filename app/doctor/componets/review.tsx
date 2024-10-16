import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
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
