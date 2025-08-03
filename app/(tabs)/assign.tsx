import React, { useState, useEffect } from 'react';
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
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { QrCode, MapPin, Package, X, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const outlets = [
  { id: '1', name: 'Corner Store', address: '123 Main St', kegs: 5 },
  { id: '2', name: 'Downtown Bar', address: '456 Oak Ave', kegs: 3 },
  { id: '3', name: 'Sunset Restaurant', address: '789 Pine Rd', kegs: 8 },
  { id: '4', name: 'City Pub', address: '321 Elm St', kegs: 2 },
];

export default function AssignKegsScreen() {
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedKegs, setScannedKegs] = useState([]);

  const handleOutletSelect = (outlet: any) => {
    setSelectedOutlet(outlet);
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
    // Simulate keg data from QR code
    const kegData = {
      id: data,
      code: data,
      timestamp: new Date().toLocaleTimeString(),
    };

    setScannedKegs(prev => [...prev, kegData]);
    setShowScanner(false);
    
    Alert.alert(
      'Keg Scanned',
      `Keg ${data} assigned to ${selectedOutlet?.name}`,
      [{ text: 'OK' }]
    );
  };

  const renderOutlet = ({ item }: any) => (
    <TouchableOpacity
      style={styles.outletItem}
      onPress={() => handleOutletSelect(item)}
    >
      <View style={styles.outletIcon}>
        <MapPin size={20} color="#2563EB" />
      </View>
      <View style={styles.outletContent}>
        <Text style={styles.outletName}>{item.name}</Text>
        <Text style={styles.outletAddress}>{item.address}</Text>
        <Text style={styles.outletKegs}>{item.kegs} kegs assigned</Text>
      </View>
    </TouchableOpacity>
  );

  const renderScannedKeg = ({ item }: any) => (
    <View style={styles.scannedKeg}>
      <View style={styles.kegIcon}>
        <Package size={16} color="#10B981" />
      </View>
      <View style={styles.kegContent}>
        <Text style={styles.kegCode}>Keg #{item.code}</Text>
        <Text style={styles.kegTime}>Scanned at {item.timestamp}</Text>
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
              Point camera at QR code to scan
            </Text>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assign Kegs to Outlets</Text>
        <Text style={styles.subtitle}>Select outlet and scan keg QR codes</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Outlet Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Outlet</Text>
          <TouchableOpacity
            style={styles.outletSelector}
            onPress={() => setShowOutletModal(true)}
          >
            {selectedOutlet ? (
              <View style={styles.selectedOutletContent}>
                <MapPin size={20} color="#2563EB" />
                <View style={styles.selectedOutletText}>
                  <Text style={styles.selectedOutletName}>
                    {selectedOutlet.name}
                  </Text>
                  <Text style={styles.selectedOutletAddress}>
                    {selectedOutlet.address}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.selectOutletText}>Select Outlet</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* QR Scanner Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.scanButton,
              !selectedOutlet && styles.scanButtonDisabled,
            ]}
            onPress={handleQRScan}
            disabled={!selectedOutlet}
          >
            <QrCode size={24} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Scan Keg QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Scanned Kegs */}
        {scannedKegs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Scanned Kegs ({scannedKegs.length})
            </Text>
            <FlatList
              data={scannedKegs}
              renderItem={renderScannedKeg}
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
              <Text style={styles.modalTitle}>Select Outlet</Text>
              <TouchableOpacity
                onPress={() => setShowOutletModal(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={outlets}
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
    alignItems: 'center',
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
  },
  selectOutletText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  scanButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  scannedKeg: {
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
    backgroundColor: '#EBF8FF',
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
    color: '#10B981',
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