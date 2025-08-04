import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Truck, MapPin, Package, X, Check, QrCode } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const outletsWithKegs = [
  {
    id: '1',
    name: 'Corner Store',
    address: '123 Main St',
    kegs: [
      { id: 'KEG001', status: 'ready' },
      { id: 'KEG002', status: 'ready' },
      { id: 'KEG003', status: 'ready' },
    ],
  },
  {
    id: '2',
    name: 'Downtown Bar',
    address: '456 Oak Ave',
    kegs: [
      { id: 'KEG004', status: 'ready' },
      { id: 'KEG005', status: 'ready' },
    ],
  },
  {
    id: '3',
    name: 'Sunset Restaurant',
    address: '789 Pine Rd',
    kegs: [
      { id: 'KEG006', status: 'ready' },
      { id: 'KEG007', status: 'ready' },
      { id: 'KEG008', status: 'ready' },
      { id: 'KEG009', status: 'ready' },
    ],
  },
];

export default function CollectKegsScreen() {
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [collectedKegs, setCollectedKegs] = useState([]);

  const handleOutletSelect = (outlet: any) => {
    setSelectedOutlet(outlet);
    setCollectedKegs([]);
    setShowOutletModal(false);
  };

  const handleQRScan = () => {
    if (!selectedOutlet) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please select an outlet first');
      return;
    }
    
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowScanner(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    // Check if keg belongs to selected outlet
    const outletKeg = selectedOutlet?.kegs.find((keg: any) => keg.id === data);
    
    if (!outletKeg) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Invalid Keg',
        `Keg ${data} does not belong to ${selectedOutlet?.name}`,
        [{ text: 'OK' }]
      );
      setShowScanner(false);
      return;
    }

    // Check if already collected
    if (collectedKegs.find((keg: any) => keg.id === data)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Already Collected',
        `Keg ${data} has already been collected`,
        [{ text: 'OK' }]
      );
      setShowScanner(false);
      return;
    }

    const kegData = {
      id: data,
      code: data,
      timestamp: new Date().toLocaleTimeString(),
    };

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCollectedKegs(prev => [...prev, kegData]);
    setShowScanner(false);
    
    Alert.alert(
      'Keg Collected',
      `Keg ${data} collected from ${selectedOutlet?.name}`,
      [{ text: 'OK' }]
    );
  };

  const handleFinishCollection = () => {
    if (collectedKegs.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('No Kegs', 'No kegs have been collected yet');
      return;
    }

    Alert.alert(
      'Confirm Collection',
      `Confirm collection of ${collectedKegs.length} kegs from ${selectedOutlet?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Keg collection completed successfully!');
            setCollectedKegs([]);
            setSelectedOutlet(null);
          },
        },
      ]
    );
  };

  const renderOutlet = ({ item }: any) => (
    <TouchableOpacity
      style={styles.outletItem}
      onPress={() => handleOutletSelect(item)}
    >
      <View style={styles.outletIcon}>
        <MapPin size={20} color="#F59E0B" />
      </View>
      <View style={styles.outletContent}>
        <Text style={styles.outletName}>{item.name}</Text>
        <Text style={styles.outletAddress}>{item.address}</Text>
        <Text style={styles.outletKegs}>
          {item.kegs.length} kegs ready for pickup
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCollectedKeg = ({ item }: any) => (
    <View style={styles.collectedKeg}>
      <View style={styles.kegIcon}>
        <Package size={16} color="#10B981" />
      </View>
      <View style={styles.kegContent}>
        <Text style={styles.kegCode}>Keg #{item.code}</Text>
        <Text style={styles.kegTime}>Collected at {item.timestamp}</Text>
      </View>
      <Check size={16} color="#10B981" />
    </View>
  );

  if (showScanner) {
    return (
      <SafeAreaView style={styles.scannerContainer}>
        <View style={styles.scannerHeader}>
          <Button
            title=""
            onPress={() => setShowScanner(false)}
            variant="secondary"
            size="small"
            style={styles.closeButton}
            icon={<X size={24} color="#FFFFFF" />}
          />
          <Text style={styles.scannerTitle}>Scan Keg QR Code</Text>
        </View>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'code128', 'code39'],
          }}
        >
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>
              Scan kegs from {selectedOutlet?.name}
            </Text>
            <Text style={styles.scannerSubtext}>
              Progress: {collectedKegs.length}/{selectedOutlet?.kegs.length}
            </Text>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Collect Kegs</Text>
        <Text style={styles.subtitle}>Select outlet and scan kegs to collect</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Outlet Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collection Location</Text>
          <Button
            title={selectedOutlet ? selectedOutlet.name : 'Select Outlet'}
            onPress={() => setShowOutletModal(true)}
            variant="secondary"
            style={styles.outletSelector}
            icon={<MapPin size={20} color="#F59E0B" />}
          />
          {selectedOutlet && (
            <Card style={styles.outletDetails}>
              <Text style={styles.outletAddress}>{selectedOutlet.address}</Text>
              <Text style={styles.availableKegs}>
                {selectedOutlet.kegs.length} kegs available for pickup
              </Text>
            </Card>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <View style={styles.actionButtons}>
            <Button
              title="Scan Keg"
              onPress={handleQRScan}
              disabled={!selectedOutlet}
              icon={<QrCode size={20} color="#FFFFFF" />}
              style={styles.actionButton}
            />
            
            <Button
              title="Finish Collection"
              onPress={handleFinishCollection}
              disabled={collectedKegs.length === 0}
              variant="success"
              icon={<Truck size={20} color="#FFFFFF" />}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Collection Progress */}
        {selectedOutlet && (
          <View style={styles.section}>
            <Card style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.sectionTitle}>Collection Progress</Text>
                <Text style={styles.progressText}>
                  {collectedKegs.length} of {selectedOutlet.kegs.length} kegs
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    {
                      width: `${(collectedKegs.length / selectedOutlet.kegs.length) * 100}%`
                    }
                  ]}
                />
              </View>
            </Card>
          </View>
        )}

        {/* Collected Kegs */}
        {collectedKegs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Collected Kegs ({collectedKegs.length})
            </Text>
            <Card>
              <FlatList
                data={collectedKegs}
                renderItem={renderCollectedKeg}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Outlet Selection Modal */}
      <Modal
        visible={showOutletModal}
        onClose={() => setShowOutletModal(false)}
        title="Select Collection Location"
      >
        <FlatList
          data={outletsWithKegs}
          renderItem={renderOutlet}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  outletSelector: {
    marginBottom: 12,
  },
  outletDetails: {
    padding: 12,
  },
  outletAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  availableKegs: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  progressCard: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  collectedKeg: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  kegIcon: {
    marginRight: 12,
  },
  kegContent: {
    flex: 1,
  },
  kegCode: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  kegTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },

  outletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  outletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  outletContent: {
    flex: 1,
  },
  outletName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  outletAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  outletKegs: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    marginRight: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  scannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  scannerSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
});