import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Phone, Eye, EyeOff } from 'lucide-react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // if (phoneNumber.length < 10) {
    //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    //   Alert.alert('Error', 'Please enter a valid phone number');
    //   return;
    // }

    setIsLoading(true);

    // Simulate API call with better feedback
    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>KegTrack Pro</Text>
            <Text style={styles.subtitle}>Driver Login</Text>
          </View>

          <Card style={styles.form}>
            <View style={styles.phoneContainer}>
              <CountryPicker
                countryCode={countryCode as any}
                withFilter
                withFlag
                withCallingCode
                withCallingCodeButton
                onSelect={(country) => {
                  setCountryCode(country.cca2);
                  setCallingCode(country.callingCode[0]);
                }}
                containerButtonStyle={styles.countryPicker}
              />
              <Text style={styles.callingCode}>+{callingCode}</Text>
              <Input
                style={styles.phoneInput}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                containerStyle={styles.phoneInputContainer}
              />
            </View>

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightIcon={
                <Button
                  title=""
                  onPress={() => setShowPassword(!showPassword)}
                  variant="secondary"
                  size="small"
                  style={styles.passwordToggle}
                  icon={showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                />
              }
            />

            <Button
              title={isLoading ? 'Logging in...' : 'Login'}
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
              size="large"
              style={styles.loginButton}
            />
          </Card>

          <Text style={styles.footer}>
            Contact your administrator for login credentials
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  form: {
    padding: 24,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  countryPicker: {
    marginRight: 8,
  },
  callingCode: {
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#374151',
  },
  phoneInputContainer: {
    marginBottom: 0,
  },
  passwordToggle: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    padding: 0,
    minHeight: 'auto',
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});