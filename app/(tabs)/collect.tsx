import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Truck, MapPin, Package, X, Check, QrCode } from 'lucide-react-native';

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
      Alert.alert('Error', 'Please select an outlet first');
      return;
    }
    
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    
    setShowScanner(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    // Check if keg belongs to selected outlet
    const outletKeg = selectedOutlet?.kegs.find((keg: any) => keg.id === data);
    
    if (!outletKeg) {
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
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowScanner(false)}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.scannerTitle}>Scan Keg QR Code</Text>
        </View>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>
              Scan kegs from {selectedOutlet?.name}
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
          <TouchableOpacity
            style={styles.outletSelector}
            onPress={() => setShowOutletModal(true)}
          >
            {selectedOutlet ? (
              <View style={styles.selectedOutletContent}>
                <MapPin size={20} color="#F59E0B" />
                <View style={styles.selectedOutletText}>
                  <Text style={styles.selectedOutletName}>
                    {selectedOutlet.name}
                  </Text>
                  <Text style={styles.selectedOutletAddress}>
                    {selectedOutlet.address}
                  </Text>
                  <Text style={styles.availableKegs}>
                    {selectedOutlet.kegs.length} kegs available for pickup
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.selectOutletText}>Select Outlet</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.scanButton,
                !selectedOutlet && styles.scanButtonDisabled,
              ]}
              onPress={handleQRScan}
              disabled={!selectedOutlet}
            >
              <QrCode size={20} color="#FFFFFF" />
              <Text style={styles.scanButtonText}>Scan Keg</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.finishButton,
                collectedKegs.length === 0 && styles.finishButtonDisabled,
              ]}
              onPress={handleFinishCollection}
              disabled={collectedKegs.length === 0}
            >
              <Truck size={20} color="#FFFFFF" />
              <Text style={styles.finishButtonText}>Finish Collection</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Collection Progress */}
        {selectedOutlet && (
          <View style={styles.section}>
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
          </View>
        )}

        {/* Collected Kegs */}
        {collectedKegs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Collected Kegs ({collectedKegs.length})
            </Text>
            <FlatList
              data={collectedKegs}
              renderItem={renderCollectedKeg}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      {/* Outlet Selection Modal */}
      <Modal
        visible={showOutletModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Collection Location</Text>
              <TouchableOpacity
                onPress={() => setShowOutletModal(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={outletsWithKegs}
              renderItem={renderOutlet}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOutletContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  selectedOutletText: {
    marginLeft: 12,
    flex: 1,
  },
  selectedOutletName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  selectedOutletAddress: {
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
  selectOutletText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  scanButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  finishButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  finishButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
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
});