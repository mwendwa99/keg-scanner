import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Package, MapPin, TrendingUp, Clock } from 'lucide-react-native';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import * as Haptics from 'expo-haptics';

const RecentActivity = ({ icon, title, subtitle, time }: any) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIcon, { backgroundColor: '#EBF8FF' }]}>
      {icon}
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activitySubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.activityTime}>{time}</Text>
  </View>
);

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, John!</Text>
          <Text style={styles.date}>Today, {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon={<Package size={24} color="#2563EB" />}
            title="Total Kegs"
            value="248"
            color="#2563EB"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Navigate to keg details
            }}
          />
          <StatCard
            icon={<MapPin size={24} color="#10B981" />}
            title="Active Outlets"
            value="32"
            color="#10B981"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Navigate to outlets
            }}
          />
          <StatCard
            icon={<TrendingUp size={24} color="#F59E0B" />}
            title="Delivered Today"
            value="18"
            color="#F59E0B"
            subtitle="Target: 25"
          />
          <StatCard
            icon={<Clock size={24} color="#EF4444" />}
            title="Pending Pickup"
            value="7"
            color="#EF4444"
            subtitle="Urgent: 2"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityContainer}>
            <RecentActivity
              icon={<Package size={16} color="#2563EB" />}
              title="Kegs Assigned"
              subtitle="Delivered to Corner Store"
              time="2 hrs ago"
            />
            <RecentActivity
              icon={<Package size={16} color="#10B981" />}
              title="Kegs Collected"
              subtitle="Picked up from Downtown Bar"
              time="4 hrs ago"
            />
            <RecentActivity
              icon={<MapPin size={16} color="#F59E0B" />}
              title="New Outlet Added"
              subtitle="Sunset Restaurant"
              time="1 day ago"
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Button
              title="Scan QR Code"
              onPress={() => {
                // Navigate to scanner
              }}
              icon={<Package size={20} color="#FFFFFF" />}
              style={styles.actionButton}
            />
            <Button
              title="View Routes"
              onPress={() => {
                // Navigate to routes
              }}
              icon={<MapPin size={20} color="#FFFFFF" />}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityContainer: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});