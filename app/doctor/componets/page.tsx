import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Portal, Dialog, Paragraph, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Assuming you're using MaterialCommunityIcons

interface Doctor {
    providerId: string;
    name: string;
    qualification: string;
    experienceYears: number;
    averageRating: number;
    ratingCount: number;
    contactPhone: string;
    gender: string;
    isActive: boolean;
}

interface DoctorDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    doctor: Doctor | null;
    maleImg: any;
    femaleImg: any;
}

const DoctorDetailsDialog: React.FC<DoctorDetailsDialogProps> = ({ visible, onHide, doctor, maleImg, femaleImg }) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onHide}>
                <Dialog.Content>
                    {/* Close button on top right */}
                    <IconButton
                        icon="close"
                        size={24}
                        onPress={onHide}
                        style={styles.closeButton}
                    />

                    <View style={styles.dialogContent}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={doctor?.gender === 'M' ? maleImg : femaleImg}
                                style={styles.dialogAvatar}
                            />
                            {doctor?.isActive && (
                                <IconButton
                                    icon={() => (
                                        <Icon name="check-circle" size={24} color="green" />
                                    )}
                                    size={24}
                                    style={styles.verificationIcon}
                                />
                            )}
                        </View>
                        <Text style={styles.dialogName}>{doctor?.name}</Text>

                        {/* Row with icons */}
                        <View style={styles.iconRow}>
                            <View style={styles.iconContainer}>
                                <IconButton icon="phone" size={24} onPress={() => console.log('Phone pressed')} />
                            </View>
                            <View style={styles.iconContainer}>
                                <IconButton icon="message" size={24} onPress={() => console.log('Message pressed')} />
                            </View>
                            <View style={styles.iconContainer}>
                                <IconButton icon="share" size={24} onPress={() => console.log('Share pressed')} />
                            </View>
                            <View style={styles.iconContainer}>
                                <IconButton icon="dots-vertical" size={24} onPress={() => console.log('Menu pressed')} />
                            </View>
                        </View>

                        {/* Row with experience, rating count, and average rating */}
                        <View style={styles.statsRow}>
                            <View style={styles.statsBox}>
                                <Text style={styles.statsValue}>{doctor?.experienceYears}</Text>
                                <Text style={styles.statsLabel}>Years</Text>
                            </View>
                            <View style={styles.statsBox}>
                                <Text style={styles.statsValue}>{doctor?.ratingCount}</Text>
                                <Text style={styles.statsLabel}>Reviews</Text>
                            </View>
                            <View style={styles.statsBox}>
                                <Text style={styles.statsValue}>{doctor?.averageRating}</Text>
                                <Text style={styles.statsLabel}>Rating</Text>
                            </View>
                        </View>
                    </View>
                    <Paragraph>{doctor?.qualification}</Paragraph>
                    <Paragraph>Contact: {doctor?.contactPhone}</Paragraph>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: 'primary',
    },
    dialogContent: {
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dialogAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    verificationIcon: {
        position: 'absolute',
        bottom: 0,
        right: -20,
    },
    dialogName: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    iconContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#7cbedf',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    statsBox: {
        width: 80,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#7cbedf',
        borderRadius: 8,
        marginHorizontal: 5,
    },
    statsValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statsLabel: {
        fontSize: 12,
        color: '#777',
    },
});

export default DoctorDetailsDialog;
